import { memo, useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import './style.scss';
import MyActivityCard from './MyActivityCard';
import { getMyActivityList } from '@/common/api/Activity';
import useActivityStore from '@/store/ActivityStore';
import { ActivityDetailInfo } from '@/common/types';
import MinePageNull from '@/modules/EmptyComponent/components/minepagenull';

const MyActivityTab: React.FC<{
  activeIndex: 'release' | 'like' | 'favourite';
  setIsShowActivityWindow: (isShow: boolean) => void;
}> = memo(function ({ activeIndex, setIsShowActivityWindow }) {
  const [activeList, setActiveList] = useState<ActivityDetailInfo[]>([]);
  const { setSelectedItem } = useActivityStore();

  useEffect(() => {
    getMyActivityList(activeIndex)
      .then((res) => {
        console.log(`${activeIndex}:`, res.data);

        if (res.data === null) {
          setActiveList([]);
          return;
        }
        const newActiveList: ActivityDetailInfo[] = [];
        res.data.forEach((item) => {
          if (item.title !== '')
            newActiveList.push({
              ...item,
            });
        });
        setActiveList(newActiveList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [activeIndex]);

  return (
    <View className="mine-activity-page">
      {activeList.length === 0 ? (
        <MinePageNull />
      ) : (
        activeList.map((item, index) => {
          return (
            <View
              key={index}
              onClick={() => {
                setSelectedItem(item);
                setIsShowActivityWindow(true);
              }}
            >
              <MyActivityCard
                key={index}
                avatar={item.userInfo.avatar}
                title={item.title}
                name={item.userInfo.username}
                likes={item.likeNum}
                comment={item.commentNum}
                introduce={item.introduce}
                showImg={item.showImg}
                isLike={item.isLike}
                isCollect={item.isCollect}
                collectNum={item.collectNum}
              />
            </View>
          );
        })
      )}
    </View>
  );
});

export default MyActivityTab;
