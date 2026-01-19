import Taro from '@tarojs/taro';
import { switchTab } from '@tarojs/taro';
const preUrl = 'https://api.inside-me.top';
import useUserStore from '@/store/userStore';
import usePostStore from '@/store/PostStore';
import { log } from 'console';

const handleUserLogin = async ({ params }) => {
  const { setId, setStudentId, setAvatar, setUsername, setSchool } = useUserStore.getState();
  const { setPostStudentId } = usePostStore.getState();
  const header = {
    'Content-Type': 'application/json;charset=utf-8',
  };
  const { studentid, password, setShowError, setErrortext } = params;
  const url = `${preUrl}/user/login`;
  const data = {
    studentid,
    password,
  };
  const response = await Taro.request({
    method: 'POST',
    url: url,
    header: header,
    data: JSON.stringify(data),
  });
  console.log(response);
  
  if (response.data.msg === "处理成功"||response.data.msg === 'success') {
    console.log(response.data.data.token);
    Taro.setStorageSync('token', response.data.data.token);
    Taro.setStorageSync('sid', response.data.data.sid);
    setStudentId(response.data.data.sid);
    setId(response.data.data.Id);
    setAvatar(response.data.data.avatar);
    setUsername(response.data.data.username);
    setSchool(response.data.data.school);
    setPostStudentId(response.data.data.sid);
    switchTab({ url: '/pages/indexHome/index' });
  } else if (response.data.msg === "学号或密码错误") {
    Taro.showToast({
      title: response.data.msg,
      icon: 'none',
      duration: 2000,
    });
    setErrortext('账号或密码错误，请重新输入');
    setShowError(true);
  }else {
    Taro.showToast({
      title: '登录失败，请稍后重试',
      icon: 'none',
      duration: 2000,
    });
    setErrortext('登录失败，请稍后重试');
    setShowError(true);
  }
};

export default handleUserLogin;
