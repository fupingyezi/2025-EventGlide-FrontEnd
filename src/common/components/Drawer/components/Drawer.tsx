import { View, Text, Image, PageContainer } from '@tarojs/components';
import React, { memo } from 'react';
import deleteSvg from '@/common/svg/delete.svg';
import './style.scss';

interface DrawerProps {
  /** 是否显示抽屉 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  title?: string | React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  customStyle?: React.CSSProperties;
  /** 子元素 */
  children?: React.ReactNode;
  /** 是否显示标题栏 */
  showHeader?: boolean;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 自定义关闭组件 */
  customCloseComponent?: React.ReactNode;
  /** 蒙版是否打开 */
  mask?: boolean;
  /** 抽屉宽度（仅在placement为left/right时有效） */
  width?: string;
  /** 抽屉高度（仅在placement为top/bottom时有效） */
  height?: string;
}

const Drawer: React.FC<DrawerProps> = memo(({ ...props }) => {
  const {
    visible,
    onClose,
    placement = 'bottom',
    title,
    className = '',
    customStyle = {},
    children,
    showHeader = true,
    showClose = true,
    customCloseComponent,
    mask = true,
  } = props;

  // 根据位置确定PageContainer的位置
  const getPosition = () => {
    switch (placement) {
      case 'left':
      case 'right':
      case 'top':
      case 'bottom':
        return placement;
      default:
        return 'bottom';
    }
  };

  const renderClose = () =>
    customCloseComponent ? (
      <View onClick={onClose}>{customCloseComponent}</View>
    ) : (
      <Image className="drawer-close" src={deleteSvg} onClick={onClose} />
    );

  return (
    <PageContainer
      show={visible}
      position={getPosition() as any}
      overlay={mask}
      onLeave={onClose}
      customStyle={typeof customStyle === 'object' ? 'background-color: transparent;' : customStyle}
      overlayStyle={mask ? 'background-color: rgba(0, 0, 0, 0.3);' : ''}
      className={`drawer ${className}`}
    >
      <View className="drawer-content-wrapper">
        {showHeader && (
          <View className="drawer-header">
            <Text className="drawer-title">{title || '标题'}</Text>
            {showClose && renderClose()}
            <View className="drawer-gapline"></View>
          </View>
        )}
        <View className="drawer-content">{children}</View>
      </View>
    </PageContainer>
  );
});

export default Drawer;
