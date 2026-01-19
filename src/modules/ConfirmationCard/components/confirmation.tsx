import './style.scss';
import { View} from '@tarojs/components';
import React, { memo } from 'react';

export interface ConfirmationProps {
  visible: boolean;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  visible,
  title = '确定要执行此操作吗？',
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  const handleConfirmClick = () => {
    onConfirm();
  };

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <View className="confirmationWindow">
      <View className="confirmationWindow-background"></View>
      <View className="confirmationWindow-content">
        <View className="confirmationWindow-content-mask" onClick={handleCancelClick}>
          ×
        </View>
        <View className="confirmationWindow-content-title">{title}</View>
        <View className="confirmationWindow-content-line"></View>
        <View className="confirmationWindow-content-btn">
          <View className="confirmationWindow-content-btn-item" onClick={handleConfirmClick}>
            {confirmText}
          </View>
          <View className="confirmationWindow-content-btn-item" onClick={handleCancelClick}>
            {cancelText}
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(Confirmation);