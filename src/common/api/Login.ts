import Taro from '@tarojs/taro';
import { switchTab } from '@tarojs/taro';
import useUserStore from '@/store/userStore';
import usePostStore from '@/store/PostStore';
import { apiClient } from './request';
import { LoginRequest, LoginResponse, CheckLoginResponse, UserInfo } from '../types';

const handleUserLogin = async ({ studentid, password }: LoginRequest) => {
  const { setId, setStudentId, setAvatar, setUsername, setSchool } = useUserStore.getState();
  const { setPostStudentId } = usePostStore.getState();

  const data: LoginRequest = {
    studentid,
    password,
  };

  const result = await apiClient.post<LoginResponse>('/user/login', data, {
    skipAuth: true,
  });
  const responseData = result.data;

  Taro.setStorageSync('token', responseData.token);
  Taro.setStorageSync('sid', responseData.sid);

  setStudentId(responseData.sid);
  setId(responseData.Id);
  setAvatar(responseData.avatar);
  setUsername(responseData.username);
  setSchool(responseData.school);
  setPostStudentId(responseData.sid);

  switchTab({ url: '/pages/indexHome/index' });
};

const handleCheckLogin = async () => {
  const { setId, setStudentId, setAvatar, setUsername, setSchool } = useUserStore.getState();
  const { setPostStudentId } = usePostStore.getState();
  if (Taro.getStorageSync('token') && Taro.getStorageSync('sid')) {
    const sid = Taro.getStorageSync('sid');
    const result = await apiClient.get<CheckLoginResponse>(`/user/info/${sid}`);
    const responseData = result.data;
    setId(responseData.id);
    setStudentId(responseData.student_id);
    setAvatar(responseData.avatar);
    setUsername(responseData.name);
    setSchool(responseData.school);
    setPostStudentId(sid);
    switchTab({ url: '/pages/indexHome/index' });
  }
};

// 获取用户信息
export const getUserInfo = (studentid: string) => {
  return apiClient.get<UserInfo>(`/user/info/${studentid}`);
};

export { handleCheckLogin, handleUserLogin };
