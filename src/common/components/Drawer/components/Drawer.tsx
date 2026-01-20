import { View, Text, Image, PageContainer } from '@tarojs/components';
import React, { memo } from 'react';
import deleteSvg from '@/common/svg/delete.svg';
import './style.scss';
import { DrawerProps } from '@/common/types';

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
