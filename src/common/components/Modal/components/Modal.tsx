import { View, Text, Image } from '@tarojs/components';
import { memo } from 'react';
import deleteSvg from '@/common/svg/delete.svg';
import './style.scss';

interface ModalProps {
  /** 是否显示模态框 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题 */
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 是否显示确认按钮 */
  showConfirm?: boolean;
  /** 子元素 */
  children?: React.ReactNode;
  /** 是否显示标题栏 */
  showHeader?: boolean;
  /** 是否显示内容栏 */
  showContent?: boolean;
  /** 自定义样式 */
  className?: string;
  customStyle?: React.CSSProperties;
  /** 标题栏自定义样式 */
  headerClassName: string;
}

const Modal: React.FC<ModalProps> = memo(({ ...props }) => {
  if (!props.visible) {
    return null;
  }

  const handleMaskClick = () => {
    // 如果点击遮罩层则关闭弹窗
    props.onClose();
  };

  const handleConfirm = () => {
    if (props.onConfirm) {
      props.onConfirm();
    }
    props.onClose();
  };

  const handleCancel = () => {
    props.onClose();
  };

  // 阻止事件冒泡
  const handleContentClick = (e: any) => {
    e.stopPropagation();
  };

  return (
    <View className="modal-overlay modal" onClick={handleMaskClick}>
      <View
        className={`modal-container ${props.className || ''}`}
        onClick={handleContentClick}
        style={props.customStyle}
      >
        {/* 头部 */}
        {props.showHeader !== false && (
          <View className={`modal-header ${props.headerClassName || ''}`}>
            <Text className="modal-title">{props.title || '提示'}</Text>
            <Image className="modal-close" src={deleteSvg} onClick={props.onClose} />
            <View className="modal-gapline"></View>
          </View>
        )}

        {/* 内容区域 */}
        {props.showContent !== false && (
          <View className="modal-content">
            {props.children}
            <View className="modal-gapline"></View>
          </View>
        )}

        {/* 底部按钮 */}
        {(props.showConfirm !== false || props.showCancel !== false) && (
          <View className="modal-footer">
            {props.showCancel !== false && (
              <View className="modal-cancel" onClick={handleCancel}>
                {props.cancelText || '取消'}
              </View>
            )}
            {props.showConfirm !== false && (
              <View className="modal-confirm" onClick={handleConfirm}>
                {props.confirmText || '确定'}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
});

export default Modal;
