import './style.scss';
import { View, Image, Text } from '@tarojs/components';
import Taro, { navigateTo } from '@tarojs/taro';
import favorite from '@/common/svg/post/heart.svg';
import favoriteActive from '@/common/svg/post/heartAct.svg';
import { memo, useState, useEffect } from 'react';
import classnames from 'classnames';
import usePostStore from '@/store/PostStore';
import useUserStore from '@/store/userStore';
import post from '@/common/api/post';
import handleInteraction from '@/common/const/Interaction';

const Post: React.FC<any> = memo(function ({ item, index, isShowImg }) {
  const [isVisiable, setIsVisiable] = useState(isShowImg);
  const { setBlogIndex, setLikeNumChange } = usePostStore();
  const [islike, setIsLike] = useState(item.isLike === 'true');
  const [likeNum, setLikeNum] = useState(item.likeNum);
  const studentid = Taro.getStorageSync('sid');

  useEffect(() => {
    setIsVisiable(isShowImg);
  }, [isShowImg]);
  useEffect(() => {
    setIsLike(item.isLike === 'true');
    setLikeNum(item.likeNum);
  }, [item]);

  const handleFavorite = () => {
    const params = {
      subject: 'post',
      studentid: studentid,
      targetid: item.bid,
      receiver: item.userInfo.studentid,
    };
    if (islike) {
      handleInteraction('dislike', params)
        .then((res) => {
          if (res.msg === 'success') {
            setIsLike(false);
            setLikeNum(likeNum - 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      handleInteraction('like', params)
        .then((res) => {
          if (res.msg === 'success') {
            setIsLike(true);
            setLikeNum(likeNum + 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <View className="post-container">
      <View style={{maxHeight: '500rpx', overflow: 'hidden'}}>
      <Image
        className={classnames('img', { 'img-active': isVisiable })}
        mode="widthFix"
        lazyLoad={true}
        src={isVisiable ? item.showImg[0] : ''}
        onClick={() => {
          navigateTo({ url: '/subpackage/blogDetail/index' })
          setBlogIndex(index);
        }}
      ></Image>        
      </View>
      <View className="content">
        <View className="title">
          <Text>{item.title}</Text>
        </View>
        <View className="title-container">
          <View className="post-user">
            <Image className="avatar" src={item.userInfo.avatar}></Image>
            <Text className="username">{item.userInfo.username}</Text>
          </View>
          <View className="post-favorite">
            <Image
              className="avatar"
              src={islike ? favoriteActive : favorite}
              mode="widthFix"
              onClick={() => handleFavorite()}
            ></Image>
            <View className="count">{likeNum}</View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default Post;
