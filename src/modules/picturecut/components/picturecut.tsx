import { View, Image, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect, useRef } from 'react';
import './style.scss';
import PictureCutProps from '@/common/types/picturecut';
import { fetchToQiniu } from '../../../common/api/qiniu';
import post from '@/common/api/post';

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  minScale: number;
  maxScale: number;
}

interface TouchState {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastDistance: number;
  isMoving: boolean;
  isScaling: boolean;
  initialDistance: number;
}

interface ImageInfo {
  width: number;
  height: number;
  aspectRatio: number;
}

const PictureCut: React.FC<PictureCutProps> = ({
  isvisible,
  imgUrl,
  setImgUrl,
  setIsVisible,
  studentId,
}) => {
  const [cropState, setCropState] = useState<CropState>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    scale: 1,
    minScale: 0.5,
    maxScale: 3
  });

  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastDistance: 0,
    isMoving: false,
    isScaling: false,
    initialDistance: 0
  });

  const [imageInfo, setImageInfo] = useState<ImageInfo>({
    width: 0,
    height: 0,
    aspectRatio: 1
  });

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const isCroppingRef = useRef(false);
  const cropTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isvisible && imgUrl[0]) {
      const query = Taro.createSelectorQuery();
      query.select('.picturecut-content').boundingClientRect();
      query.exec((res) => {
        if (res[0]) {
          const containerWidth = res[0].width;
          const containerHeight = res[0].height;
          setContainerSize({ width: containerWidth, height: containerHeight });
          
          Taro.getImageInfo({
            src: imgUrl[0],
            success: (info) => {
              const aspectRatio = info.width / info.height;
              setImageInfo({
                width: info.width,
                height: info.height,
                aspectRatio
              });

              const cropSize = Math.min(containerWidth, containerHeight) * 0.8;
              
              let initialScale = 1;
              if (aspectRatio >= 1) {
                initialScale = cropSize / info.width;
              } else {
                initialScale = cropSize / info.height;
              }
              const displayWidth = info.width * initialScale;
              const displayHeight = info.height * initialScale;
              const cropBoxX = containerWidth / 2;
              const cropBoxY = containerHeight / 2;
              
              const imageX = cropBoxX - displayWidth / 2;
              const imageY = cropBoxY - displayHeight / 2;

              setCropState({
                x: imageX,
                y: imageY,
                width: cropSize,
                height: cropSize,
                scale: initialScale,
                minScale: initialScale * 0.5,
                maxScale: initialScale * 3
              });
            }
          });
        }
      });
    }
  }, [isvisible, imgUrl]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (cropTimeoutRef.current) {
        clearTimeout(cropTimeoutRef.current);
      }
      if (cropImageRef.current) {
        cropImageRef.current.onload = null;
        cropImageRef.current.onerror = null;
        cropImageRef.current.src = '';
        cropImageRef.current = null;
      }
    };
  }, []);

  const handleTouchStart = (e: any) => {
    const touches = e.touches;
    
    if (touches.length === 1) {
      setTouchState({
        startX: touches[0].clientX,
        startY: touches[0].clientY,
        lastX: touches[0].clientX,
        lastY: touches[0].clientY,
        lastDistance: 0,
        isMoving: true,
        isScaling: false,
        initialDistance: 0
      });
    } else if (touches.length === 2) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const centerX = (touches[0].clientX + touches[1].clientX) / 2;
      const centerY = (touches[0].clientY + touches[1].clientY) / 2;
      
      setTouchState({
        startX: centerX,
        startY: centerY,
        lastX: centerX,
        lastY: centerY,
        lastDistance: distance,
        isMoving: false,
        isScaling: true,
        initialDistance: distance
      });
    }
  };

  const handleTouchMove = (e: any) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const touches = e.touches;
      
      if (touchState.isMoving && touches.length === 1) {
        const deltaX = touches[0].clientX - touchState.lastX;
        const deltaY = touches[0].clientY - touchState.lastY;
        
        setCropState(prev => ({
          ...prev,
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
        
        setTouchState(prev => ({
          ...prev,
          lastX: touches[0].clientX,
          lastY: touches[0].clientY
        }));
        
      } else if (touchState.isScaling && touches.length === 2) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        
        const centerX = (touches[0].clientX + touches[1].clientX) / 2;
        const centerY = (touches[0].clientY + touches[1].clientY) / 2;
        
        if (touchState.initialDistance > 0) {
          const scaleChange = currentDistance / touchState.initialDistance;
          const newScale = Math.max(
            cropState.minScale,
            Math.min(cropState.maxScale, cropState.scale * scaleChange)
          );
          
          const scaleCenterX = (centerX - cropState.x) / cropState.scale;
          const scaleCenterY = (centerY - cropState.y) / cropState.scale;
          
          const newX = centerX - scaleCenterX * newScale;
          const newY = centerY - scaleCenterY * newScale;
          
          setCropState(prev => ({
            ...prev,
            x: newX,
            y: newY,
            scale: newScale
          }));
        }
        
        setTouchState(prev => ({
          ...prev,
          lastX: centerX,
          lastY: centerY,
          initialDistance: currentDistance
        }));
      }
    });
  };

  const handleTouchEnd = () => {
    setTouchState({
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      lastDistance: 0,
      isMoving: false,
      isScaling: false,
      initialDistance: 0
    });
  };

  const cleanupCropResources = () => {
    if (cropTimeoutRef.current) {
      clearTimeout(cropTimeoutRef.current);
      cropTimeoutRef.current = null;
    }
    if (cropImageRef.current) {
      cropImageRef.current.onload = null;
      cropImageRef.current.onerror = null;
      cropImageRef.current.src = '';
      cropImageRef.current = null;
    }
    isCroppingRef.current = false;
    setIsLoading(false);
  };

  const handleCrop = () => {
    if (!imgUrl[0] || !imageInfo.width || isLoading) {
      return;
    }

    isCroppingRef.current = true;
    setIsLoading(true);

    cropTimeoutRef.current = setTimeout(() => {
      cleanupCropResources();
    }, 30000) as unknown as number;

    Taro.createSelectorQuery()
      .select('#cropCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log('获取Canvas结果:', res);
        if (!res || !res[0] || !res[0].node) {
          Taro.showToast({ title: 'Canvas初始化失败', icon: 'none' });
          setIsLoading(false);
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = Taro.getSystemInfoSync().pixelRatio;
        
        console.log('Canvas配置:', { width: cropState.width * dpr, height: cropState.height * dpr, dpr });
        canvas.width = cropState.width * dpr;
        canvas.height = cropState.height * dpr;
        ctx.scale(dpr, dpr);
        
        ctx.clearRect(0, 0, cropState.width, cropState.height);

        if (cropImageRef.current) {
          cropImageRef.current.onload = null;
          cropImageRef.current.onerror = null;
          cropImageRef.current.src = '';
        }
        
        const img = canvas.createImage();
        cropImageRef.current = img;
        img.src = imgUrl[0];

        const imgLoadTimeout = setTimeout(() => {
          console.error('图片加载超时');
          if (cropImageRef.current) {
            cropImageRef.current.onload = null;
            cropImageRef.current.onerror = null;
            cropImageRef.current.src = '';
            cropImageRef.current = null;
          }
          cleanupCropResources();
        }, 10000);
        
        img.onload = () => {
          clearTimeout(imgLoadTimeout);
          console.log('图片加载成功:', { width: img.width, height: img.height });
          try {
            const cropBoxCenterX = containerSize.width / 2;
            const cropBoxCenterY = containerSize.height / 2;
            
            const cropBoxLeft = cropBoxCenterX - cropState.width / 2;
            const cropBoxTop = cropBoxCenterY - cropState.height / 2;
            
            const offsetX = cropBoxLeft - cropState.x;
            const offsetY = cropBoxTop - cropState.y;
            
            const sourceX = Math.max(0, offsetX / cropState.scale);
            const sourceY = Math.max(0, offsetY / cropState.scale);
            
            const sourceWidth = Math.min(
              cropState.width / cropState.scale,
              img.width - sourceX
            );
            const sourceHeight = Math.min(
              cropState.height / cropState.scale,
              img.height - sourceY
            );

            console.log('绘制图片参数:', {
              sourceX, sourceY, sourceWidth, sourceHeight,
              destX: 0, destY: 0, destWidth: cropState.width, destHeight: cropState.height
            });
            
            ctx.drawImage(
              img,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, 0, cropState.width, cropState.height
            );

            const canvasTimeout = setTimeout(() => {
              console.error('Canvas导出超时');
              cleanupCropResources();
            }, 10000);
            
            Taro.canvasToTempFilePath({
              canvas,
              fileType: 'png',
              quality: 1,
              success: async (tempRes) => {
                clearTimeout(canvasTimeout);
                console.log('裁剪成功，临时文件路径:', tempRes.tempFilePath);
                try {
                  console.log('裁剪成功，临时文件路径:', tempRes.tempFilePath);
                  
                  const url = await fetchToQiniu(tempRes.tempFilePath);
                  console.log('七牛云返回URL:', url);
                  
                  const response = await post('/user/avatar', {
                    avatar_url: url,
                    studentid: studentId,
                  });
                  
                  if (response.msg === 'success') {
                    setImgUrl([tempRes.tempFilePath]);
                    setIsVisible(false);
                  } else {
                    Taro.showToast({ 
                      title: '上传失败: ' + (response.msg || '未知错误'), 
                      icon: 'none' 
                    });
                  }
                } catch (uploadError) {
                  console.error('上传失败:', uploadError);
                  Taro.showToast({ 
                    title: '上传失败', 
                    icon: 'none' 
                  });
                } finally {
                  setIsLoading(false);
                }
              },
              fail: (error) => {
                console.error('导出失败:', error);
                Taro.showToast({ title: '导出失败', icon: 'none' });
                setIsLoading(false);
              }
            });
          } catch (error) {
            console.error('裁剪过程出错:', error);
            Taro.showToast({ title: '裁剪失败', icon: 'none' });
            setIsLoading(false);
          }
        };
        
        img.onerror = () => {
          console.error('图片加载失败');
          Taro.showToast({ title: '图片加载失败', icon: 'none' });
          setIsLoading(false);
        };
      });
  };

  const handleCancel = () => {
    cleanupCropResources();
    setIsVisible(false);
  };

  if (!isvisible) return null;

  return (
    <View className="picturecut" ref={containerRef}>
      <View className="picturecut-header">
        <View className="picturecut-title">裁剪图片</View>
      </View>

      <View className="picturecut-content">
        <View 
          className="picturecut-crop-area"
          style={{
            width: `${cropState.width}px`,
            height: `${cropState.height}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <View className="picturecut-crop-grid">
            <View className="picturecut-grid-horizontal picturecut-grid-top" />
            <View className="picturecut-grid-horizontal picturecut-grid-bottom" />
            <View className="picturecut-grid-vertical picturecut-grid-left" />
            <View className="picturecut-grid-vertical picturecut-grid-right" />
            <View className="picturecut-corner picturecut-corner-tl" />
            <View className="picturecut-corner picturecut-corner-tr" />
            <View className="picturecut-corner picturecut-corner-bl" />
            <View className="picturecut-corner picturecut-corner-br" />
          </View>
        </View>

        <View 
          className="picturecut-image-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{
            transform: `translate(${cropState.x}px, ${cropState.y}px) scale(${cropState.scale})`,
            transformOrigin: '0 0',
          }}
        >
          <Image 
            src={imgUrl[0]} 
            className="picturecut-image"
            mode="widthFix"
            style={{ 
              width: `${imageInfo.width}px`,
              height: `${imageInfo.height}px`,
            }}
          />
        </View>
        
        <Canvas 
          id="cropCanvas"
          className="picturecut-canvas"
          style={{ 
            width: `${cropState.width}px`, 
            height: `${cropState.height}px`,
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            opacity: 0 
          }}
          type="2d"
        />
      </View>
      <View className="picturecut-footer">
        <View className="picturecut-buttons">
          <View className="picturecut-btn picturecut-btn-cancel" onClick={handleCancel}>
            取消
          </View>
          <View 
            className="picturecut-btn picturecut-btn-confirm" 
            onClick={handleCrop}
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? '处理中...' : '确定'}
          </View>
        </View>
      </View>

      {isLoading && (
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <View style={{ color: '#fff', fontSize: '16px' }}>处理中...</View>
        </View>
      )}
    </View>
  );
};

export default PictureCut;