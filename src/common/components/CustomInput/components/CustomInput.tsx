import { View, Input, Textarea, Text } from '@tarojs/components';
import { memo, useState } from 'react';
import './style.scss';

interface CustomInputProps {
  /** 输入框类型 */
  type?: 'text' | 'number' | 'password' | 'textarea';
  /** 输入框的值 */
  value?: string;
  /** 输入框为空时占位符 */
  placeholder?: string;
  /** 是否禁用输入框 */
  disabled?: boolean;
  /** 最大输入长度 */
  maxLength?: number;
  /** 是否是密码类型 */
  password?: boolean;
  /** 是否聚焦 */
  focus?: boolean;
  /** 键盘弹起时，是否自动上推页面 */
  adjustPosition?: boolean;
  /** 点击完成时，是否保持键盘不收起 */
  holdKeyboard?: boolean;
  /** 是否自动聚焦 */
  autoFocus?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 是否显示字数统计 */
  showWordLimit?: boolean;
  /** 标题 */
  title?: string;
  /** 左侧图标 */
  leftIcon?: string;
  /** 右侧图标 */
  rightIcon?: string;
  /** 输入框样式 */
  inputStyle?: React.CSSProperties;
  /** 自定义样式 */
  customStyle?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 输入时触发的事件 */
  onInput?: (value: string) => void;
  /** 聚焦时触发的事件 */
  onFocus?: (e: any) => void;
  /** 失焦时触发的事件 */
  onBlur?: (e: any) => void;
  /** 点击完成时触发的事件 */
  onConfirm?: (value: string) => void;
  /** 清空内容时触发的事件 */
  onClear?: () => void;
  /** 是否自动增高 */
  autoHeight?: boolean;
  /** 指定光标与键盘的距离 */
  cursorSpacing?: number;
  /** 是否显示键盘上方带有"完成"按钮那一栏 */
  showConfirmBar?: boolean;
  /** 光标起始位置 */
  selectionStart?: number;
  /** 光标结束位置 */
  selectionEnd?: number;
}

const CustomInput: React.FC<CustomInputProps> = memo(({ ...props }) => {
  const {
    type = 'text',
    value = '',
    placeholder,
    disabled = false,
    maxLength = 140,
    password = false,
    focus = false,
    adjustPosition = true,
    holdKeyboard = false,
    autoFocus = false,
    clearable = false,
    showWordLimit = false,
    title,
    leftIcon,
    rightIcon,
    inputStyle,
    customStyle,
    className = '',
    onInput,
    onFocus,
    onBlur,
    onConfirm,
    onClear,
    autoHeight,
    cursorSpacing,
    showConfirmBar,
    selectionStart,
    selectionEnd,
  } = props;

  const [innerValue, setInnerValue] = useState(value);

  // 当外部value变化时同步内部状态
  if (value !== innerValue && typeof value !== 'undefined') {
    setInnerValue(value);
  }

  const handleInput = (e: any) => {
    const newValue = e.detail.value;
    setInnerValue(newValue);
    if (onInput) {
      onInput(newValue);
    }
  };

  const handleClear = () => {
    setInnerValue('');
    if (onInput) {
      onInput('');
    }
    if (onClear) {
      onClear();
    }
  };

  const handleFocus = (e: any) => {
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleConfirm = (e: any) => {
    if (onConfirm) {
      onConfirm(e.detail.value);
    }
  };

  // 根据类型渲染不同的输入组件
  const renderInputField = () => {
    if (type === 'textarea') {
      return (
        <Textarea
          value={innerValue}
          placeholder={placeholder}
          disabled={disabled}
          maxlength={maxLength}
          focus={focus}
          autoHeight={autoHeight}
          showConfirmBar={showConfirmBar}
          selectionStart={selectionStart}
          selectionEnd={selectionEnd}
          cursorSpacing={cursorSpacing}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onConfirm={handleConfirm}
          className="custom-input-field custom-textarea-field"
          style={inputStyle}
        />
      );
    } else {
      return (
        <Input
          type={type === 'password' ? 'text' : type}
          password={password || type === 'password'}
          value={innerValue}
          placeholder={placeholder}
          disabled={disabled}
          maxlength={maxLength}
          focus={focus}
          adjustPosition={adjustPosition}
          holdKeyboard={holdKeyboard}
          autoFocus={autoFocus}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onConfirm={handleConfirm}
          className="custom-input-field"
          style={inputStyle}
        />
      );
    }
  };

  return (
    <View className={`custom-input ${className}`} style={customStyle}>
      {title && <Text className="custom-input-title">{title}</Text>}
      <View className="custom-input-wrapper">
        {leftIcon && (
          <View className="custom-input-left-icon">
            <Text>{leftIcon}</Text>
          </View>
        )}
        {renderInputField()}
        {clearable && innerValue && (
          <View className="custom-input-clear" onClick={handleClear}>
            <Text className="custom-input-clear-icon">×</Text>
          </View>
        )}
        {showWordLimit && (
          <View className="custom-input-limit">
            <Text className="custom-input-limit-text">
              {innerValue.length}/{maxLength}
            </Text>
          </View>
        )}
        {rightIcon && (
          <View className="custom-input-right-icon">
            <Text>{rightIcon}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

export default CustomInput;
