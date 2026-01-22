import { View } from '@tarojs/components';
import { memo } from 'react';
import './style.scss';
import { ImagePickerProps } from '@/common/types';
import { handleChooseImage } from '@/common/utils/AlbumFunction';
import Drawer from '@/common/components/Drawer';

const ImagePicker: React.FC<ImagePickerProps> = memo(function ({
  isVisiable,
  setIsVisiable,
  imgUrl,
  setImgUrl,
  type,
  count = 9,
  isRequest = false,
}) {
  const handleChooseImageClick = () => {
    if (type === 'blog') {
      handleChooseImage({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: count,
        url: '/subpackage/postAdd/index',
        isAlbum: true,
      });
    } else if (type === 'event') {
      handleChooseImage({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: count,
        url: '',
        isAlbum: true,
        isRequest: isRequest,
      });
    }
  };
  const handleTakePhotoClick = () => {
    if (type === 'blog') {
      handleChooseImage({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: 1,
        url: '/subpackage/postAdd/index',
        isAlbum: false,
      });
    } else if (type === 'event') {
      handleChooseImage({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: 1,
        url: '',
        isAlbum: false,
        isRequest: isRequest,
      });
    }
  };
  return (
    <Drawer
      visible={isVisiable}
      onClose={() => setIsVisiable(false)}
      placement="bottom"
      showHeader={false}
    >
      <View className="album-window-content">
        <View className="album-window-content-btn1" onClick={() => handleChooseImageClick()}>
          从相册中选择
        </View>
        <View className="album-window-content-btn2" onClick={() => handleTakePhotoClick()}>
          拍摄
        </View>
        <View className="album-window-content-cancel" onClick={() => setIsVisiable(false)}>
          取消
        </View>
      </View>
    </Drawer>
  );
});

export default ImagePicker;
