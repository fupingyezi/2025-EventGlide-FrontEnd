import { View, Image, Input } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import './index.scss';
// import avatar from "@/common/assets/Postlist/波奇.jpg";
import schoolSrc from '@/common/assets/mineInfo/学校.png';
import departmentSrc from '@/common/assets/mineInfo/院系.png';
import cardSrc from '@/common/assets/mineInfo/一卡通号.png';
import useUserStore from '@/store/userStore';
import AlbumWindow from '@/modules/albumWindow';
import classnames from 'classnames';
import post from '@/common/api/post';
import { NavigationBar, NavigationBarBack } from '@/common/components/NavigationBar';
import PictureCut from '@/modules/picturecut/components/picturecut';
const Index = () => {
  const {
    studentid: studentId,
    username,
    school,
    college,
    avatar,
  } = useUserStore((state) => state);
  const { setUsername } = useUserStore();
  const [inputValue, setInputValue] = useState('');
  const [isVisiable, setIsVisiable] = useState(false);
  const [imgUrl, setImgUrl] = useState<string[]>([avatar]);
  const [cutImgUrl, setCutImgUrl] = useState<string[]>([]);
  const [isCutVisible, setIsCutVisible] = useState(false);
  const [changgename, setChanggename] = useState(false);
  const handleInputChange = (e) => {
    setInputValue(e.detail.value);
  };
  const handleConfirm = () => {
    if (!inputValue) {
      Taro.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }else{
    post('/user/username', { new_name: inputValue, studentid: studentId }).then((res) => {
      console.log(res);
      setUsername(inputValue);
    });
    setUsername(inputValue);
    setChanggename(false);
    setInputValue('');      
    }
  };
  const handleLogOut = () => {
    post('/user/logout').then((res) => {
      console.log(res);
      if (res.msg === 'success') {
        Taro.showToast({ title: '退出成功', icon: 'success' });
        Taro.removeStorageSync('token');
        navigateTo({ url: '/pages/login/index' });
      }
    });
  };
  useEffect(() => {
    console.log(cutImgUrl);
    if (cutImgUrl.length > 0) {
      setIsCutVisible(true);
    }
  }, [cutImgUrl]);
  return (
    <>
      <NavigationBarBack backgroundColor="#FFFFFF" title="账号设置" url="/pages/mineHome/index" />
      <View className="mineInfo-page">
        <View className="mineInfo-user">
          <View className="mineInfo-container-top">
            <View className="mineInfo-container-column">头像</View>
            <View className="mineInfo-container-avatar">
              <Image
                className="mineInfo-container-img"
                style={'border-radius: 50%;height: 80rpx;width: 80rpx;background-color: #F9F8FC;'}
                mode="aspectFill"
                src={imgUrl[0]}
                onClick={() => setIsVisiable(true)}
              />
            </View>
          </View>
          <View className="mineInfo-container-bottom">
            <View className="mineInfo-container-column">昵称</View>
            <View className="mineInfo-container-desc">
              <View onClick={() => setChanggename(true)}>{username ? username : '点击设置昵称'}</View>
            </View>
          </View>
        </View>
        <View className="mineInfo-desc">
          <View className="mineInfo-container-top">
            <View className="mineInfo-container-column">实名信息</View>
          </View>
          <View className="mineInfo-container">
            <View className="mineInfo-container-column">
              <Image className="mineInfo-container-img" mode="widthFix" src={schoolSrc} />
              学校
            </View>
            <View className="mineInfo-container-desc">{school}</View>
          </View>
          <View className="mineInfo-container">
            <View className="mineInfo-container-column">
              <Image className="mineInfo-container-img" mode="widthFix" src={departmentSrc} />
              院系
            </View>
            <View className="mineInfo-container-desc">{college ? college : '计算机学院'}</View>
          </View>
          <View className="mineInfo-container-bottom">
            <View className="mineInfo-container-column">
              <Image className="mineInfo-container-img" mode="widthFix" src={cardSrc} />
              一卡通号
            </View>
            <View className="mineInfo-container-desc">{studentId}</View>
          </View>
        </View>
        <View className="mineInfo-floor-btn" onClick={() => handleLogOut()}>
          退出登录
        </View>
      </View>
      {changgename && (
      <View className='changename'>
        <View className='changename-background'/>
        <View className="changename-content">
          <View onClick={() => setChanggename(false)} className="changename-content-close">
            x
          </View>
          <View className="changename-content-input">
            <Input 
            style={{fontSize: '32rpx',fontFamily: 'SimHei'}} 
            placeholder="请输入新昵称"
            value={inputValue}
            onInput={handleInputChange}
            />
          </View>
          <View className="changename-content-line"/>
          <View className="changename-content-btn">
            <View onClick={() => setChanggename(false)} className="changename-content-btn-item">取消</View>
            <View onClick={handleConfirm} className="changename-content-btn-item" style={{color: '#b36aeb'}}>确认</View>
          </View>
        </View>
      </View>)}
      <AlbumWindow
        isVisiable={isVisiable}
        setIsVisiable={setIsVisiable}
        isOverlay={true}
        imgUrl={imgUrl}
        setImgUrl={setCutImgUrl}
        type="event"
        count={1}
        isRequest={true}
      />
      {cutImgUrl.length > 0 && (
      <PictureCut
        isvisible={isCutVisible}
        imgUrl={cutImgUrl}
        setImgUrl={setImgUrl}
        setIsVisible={setIsCutVisible}
        studentId={studentId}
      />)}
    </>
  );
};

export default Index;
