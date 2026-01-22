import React from 'react';
import { View, Image } from '@tarojs/components';
import './style.scss';
import { ScrollTopProps } from '@/common/types';

const ScrollTop: React.FC<ScrollTopProps> = ({ setScrollTop, isVisible, bottom = 100 }) => {
  const onScrollTop = () => {
    setScrollTop(1);

    setTimeout(() => {
      setScrollTop(0);
    }, 0);
  };
  return (
    <View
      className={`scroll-top ${isVisible ? 'scroll-top-visible' : ''} `}
      style={{ bottom }}
      onClick={onScrollTop}
    >
      <Image
        className="scroll-top-icon"
        src="https://img.icons8.com/ios-filled/50/9b59b6/up--v1.png"
        mode="widthFix"
      />
    </View>
  );
};

export default ScrollTop;
