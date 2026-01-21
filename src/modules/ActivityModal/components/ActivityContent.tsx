import './style.scss';
import { View } from '@tarojs/components';
import { memo } from 'react';
import Picture from '@/common/components/Picture';

interface ActivityData {
  title?: string;
  introduce?: string;
  showImg?: string[] | null;
  type?: string;
  holderType?: string;
  if_register?: boolean | string;
}

interface ActivityContentProps {
  activityData: ActivityData;
  canDeleteImages?: boolean;
  isDraftMode?: boolean; // 如果是草稿模式，会显示默认提示文字等
}

const Label: React.FC<{ text: string }> = memo(({ text }) => {
  return <View className="activity-content-label-item">{text}</View>;
});

const ActivityContent: React.FC<ActivityContentProps> = memo(
  ({ activityData, canDeleteImages = false, isDraftMode = false }) => {
    const { introduce: description, showImg, type, holderType, if_register } = activityData;

    // 处理报名状态文本
    let registerText = '无需报名';
    if (if_register === '是' || if_register === true) registerText = '需要报名';

    // 标签列表
    const labelList = [type || '', holderType || '', registerText].filter((item) => item !== ''); // 过滤空字符串

    // 默认内容文本
    const defaultDescription =
      '为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......';

    // 图片列表处理
    const imgList = showImg && Array.isArray(showImg) ? showImg : [];

    return (
      <View className="activity-content">
        <View className="activity-content-text">
          {isDraftMode
            ? description !== ''
              ? description
              : defaultDescription
            : description
              ? description
              : '暂无介绍'}
        </View>

        <View className="activity-content-other">
          <View className="activity-content-label">
            {labelList.map((item, index) => (
              <Label key={index} text={item}></Label>
            ))}
          </View>

          <View className="activity-content-pic">
            {imgList.map((item, index) => (
              <Picture
                key={index}
                src={item}
                isShowDelete={canDeleteImages}
                imgUrl={[]}
                setImgUrl={([]) => {}}
              ></Picture>
            ))}
          </View>
        </View>
      </View>
    );
  }
);

export default ActivityContent;
