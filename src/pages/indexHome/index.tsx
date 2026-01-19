import { View, ScrollView } from '@tarojs/components';
import Active from '@/modules/activityItem/index';
import { useDidShow, useLoad } from '@tarojs/taro';
import './index.scss';
import Sticky from '@/modules/index-sticky/index';
import PostWindow from '@/modules/PostWindow';
import { useState } from 'react';
import useActivityStore from '@/store/ActivityStore';
import { judgeDate } from '@/common/const/DateList';
import get from '@/common/api/get';
import post from '@/common/api/post';
import useUserStore from '@/store/userStore';
import usePostStore from '@/store/PostStore';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import IndexPageNull from '@/modules/null/components/indexpagenull';
import Taro from '@tarojs/taro';

const Index = () => {
  const [showPostWindow, setShowPostWindow] = useState(false);
  const { activeList, setActiveList, setSelectedItem, selectedInfo, isSelect } = useActivityStore();
  const [approximateTime, setApproximateTime] = useState<string>('');
  const [type, setType] = useState<string>('');
  const studentid = Taro.getStorageSync('sid');
  const { setBlogList } = usePostStore();

  useLoad(() => {
    get('/post/all').then((res) => {
      setBlogList(res.data);
    });
  });

  useDidShow(() => {
    if (isSelect) {
      console.log("selectedInfo:", selectedInfo);
      post('/act/search', selectedInfo)
        .then((res) => {
          console.log(res.data);
          setActiveList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('studentid:',studentid);
      get('/act/all')
        .then((res) => {
          console.log(res);
          setActiveList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const filteredActivities =
    activeList?.filter((activeItem) => {
      const isMatch =
        (approximateTime === '' || judgeDate(approximateTime, activeItem.detailTime)) &&
        (type === '' || activeItem.type === type);
      return isMatch;
    }) || [];
  return (
    <>
      <NavigationBarTabBar backgroundColor="#F8F9FC" title="首页"></NavigationBarTabBar>
      <ScrollView
        className="active"
        scrollY={true}
        usingSticky={true}
        enhanced={true}
        showScrollbar={false}
      >
        <View className="sticky-header">
          <Sticky setApproximateTime={setApproximateTime} setType={setType}></Sticky>
        </View>
        <View className="sticky-item">
          {filteredActivities.length === 0 ? (
            <IndexPageNull />
          ) : (
            filteredActivities.map((activeItem, index) => (
              <View
                key={index}
                onClick={() => {
                  setSelectedItem(activeItem);
                }}
              >
                <Active key={index} activeItem={activeItem} setShowPostWindow={setShowPostWindow} />
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {showPostWindow && (
        <PostWindow WindowType="active" setShowPostWindow={setShowPostWindow}></PostWindow>
      )}
    </>
  );
};

export default Index;
