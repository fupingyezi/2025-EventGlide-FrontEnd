import Taro from '@tarojs/taro';
import './style.scss';

interface MessageOptions {
  /** 提示内容 */
  content: string;
  /** 提示类型 */
  type?: 'success' | 'error' | 'warn' | 'info' | 'loading';
  /** 显示时长(ms)，设为0则不自动关闭 */
  duration?: number;
  /** 是否显示遮罩 */
  mask?: boolean;
  /** 图标 */
  icon?: 'success' | 'error' | 'loading' | 'none';
  /** 自定义图片 */
  image?: string;
  /** 提示层级 */
  zIndex?: number;
  /** 成功回调 */
  success?: (res: any) => void;
  /** 失败回调 */
  fail?: (res: any) => void;
  /** 完成回调 */
  complete?: (res: any) => void;
}

// 存储当前显示的消息实例
let currentMessageInstance: {
  hide: () => void;
} | null = null;

// 显示消息的方法
const showMessage = (options: MessageOptions) => {
  // 如果当前有正在显示的消息，则先隐藏
  if (currentMessageInstance) {
    currentMessageInstance.hide();
  }

  // 使用Taro.showToast显示消息
  const showToastOptions: Taro.showToast.Option = {
    title: options.content,
    icon: options.icon || getIconByType(options.type),
    image: options.image,
    mask: options.mask ?? false,
    duration: options.duration ?? 2000,
    success: options.success,
    fail: options.fail,
    complete: options.complete,
  };

  // 如果是loading类型，使用showLoading
  if (options.type === 'loading') {
    Taro.showLoading({
      title: options.content,
      mask: options.mask ?? false,
      success: options.success,
      fail: options.fail,
      complete: options.complete,
    });
  } else {
    Taro.showToast(showToastOptions);
  }

  // 保存当前实例
  const instance = {
    hide: () => {
      if (options.type === 'loading') {
        Taro.hideLoading();
      } else {
        Taro.hideToast();
      }
    },
  };

  currentMessageInstance = instance;
  return instance;
};

// 根据类型获取图标
const getIconByType = (type?: string): Taro.showToast.Option['icon'] => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'loading':
      return 'loading';
    case 'warn':
    case 'info':
      return 'none';
    default:
      return 'none';
  }
};

// 定义Message对象
const Message = {
  show: (content: string | MessageOptions) => {
    if (typeof content === 'string') {
      return showMessage({ content });
    }
    return showMessage(content);
  },

  success: (content: string | MessageOptions) => {
    const options = typeof content === 'string' ? { content } : content;
    return showMessage({ ...options, type: 'success' });
  },

  error: (content: string | MessageOptions) => {
    const options = typeof content === 'string' ? { content } : content;
    return showMessage({ ...options, type: 'error' });
  },

  warn: (content: string | MessageOptions) => {
    const options = typeof content === 'string' ? { content } : content;
    return showMessage({ ...options, type: 'warn' });
  },

  info: (content: string | MessageOptions) => {
    const options = typeof content === 'string' ? { content } : content;
    return showMessage({ ...options, type: 'info' });
  },

  loading: (content: string | MessageOptions) => {
    const options = typeof content === 'string' ? { content } : content;
    return showMessage({ ...options, type: 'loading' });
  },

  hide: () => {
    Taro.hideToast();
    Taro.hideLoading();
    currentMessageInstance = null;
  },
};

export default Message;

// 导出类型定义
export type { MessageOptions };
