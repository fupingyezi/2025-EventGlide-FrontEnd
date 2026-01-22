import './index.scss';
import { View, Image } from '@tarojs/components';
import { memo, useState, useEffect } from 'react';
import Picture from '@/common/components/Picture';
import useActiveInfoStore from '@/store/activeInfoStore';
import isChecking from '@/common/assets/isChecking/isChecking1.png';
import alPost from '@/common/assets/isChecking/alPost.png';
import falPost from '@/common/assets/isChecking/falPost.png';
import { ScrollView } from '@tarojs/components';
import { get } from '@/common/api/request';
import NoticePageNull from '@/modules/EmptyComponent/components/noticepagenull';

export interface ActiveItem {
  title: string;
  introduce: string;
  type: string;
  isChecking: string;
  holderType: string;
  ifRegister: string;
  showImg: string[];
}

const Label: React.FC<{ text: string }> = memo(({ text }) => {
  return <View className="reviewPage-label-item">{text}</View>;
});

const Index = () => {
  const { labelform } = useActiveInfoStore((state) => state);
  let signText = '无需报名';
  if (labelform.ifRegister === '是') signText = '需要报名';

  const [activeList, setActiveList] = useState<ActiveItem[]>([]);
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await get('/act/own');
        console.log(res.data);
        setActiveList(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
        setActiveList([]);
      }
    };

    fetchActivities();
  }, []);
  function getImg(items: String) {
    if (items === 'pending') return isChecking;
    if (items === 'rejected') return falPost;
    return alPost;
  }
  return (
    <View className="reviewPage">
      <ScrollView scrollY={true} style={{ height: '100vh' }}>
        {activeList.length > 0 ? (
          activeList.map((item, index) => (
            <View key={index}>
              <View className="reviewPage-container">
                <View className="reviewPage-state">
                  <Image
                    src={getImg(item.isChecking)}
                    mode="widthFix"
                    className="reviewPage-state-img"
                  ></Image>
                </View>
                <View className="reviewPage-header">{item.title}</View>
                <View className="reviewPage-gapline1"></View>
                <View className="reviewPage-content">{item.introduce}</View>
                <View className="reviewPage-label">
                  <Label text={item.type}></Label>
                  <Label text={item.holderType}></Label>
                  <Label text={item.ifRegister === '是' ? '需要报名' : '无需报名'}></Label>
                </View>
                <View className="reviewPage-pic">
                  {(item.showImg || []).map((item, index) => (
                    <Picture
                      key={index}
                      src={item}
                      isShowDelete={true}
                      imgUrl={[]}
                      setImgUrl={([]) => {}}
                    ></Picture>
                  ))}
                </View>
              </View>
            </View>
          ))
        ) : (
          <NoticePageNull />
        )}
        <View style={{ height: '100rpx' }} />
      </ScrollView>
    </View>
  );
};

export default Index;
