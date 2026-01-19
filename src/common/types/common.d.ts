declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

interface ModalProps {
  /** 是否显示模态框 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题 */
  title?: string;
  /** 确认按钮文字 */
  confirmText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 确认回调 */
  onConfirm?: () => void;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 是否显示确认按钮 */
  showConfirm?: boolean;
  /** 子元素 */
  children?: React.ReactNode;
  /** 是否显示标题栏 */
  showHeader?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  customStyle?: React.CSSProperties;
}
