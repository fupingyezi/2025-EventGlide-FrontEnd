import Taro from '@tarojs/taro';
import { switchTab } from '@tarojs/taro';
import useUserStore from '@/store/userStore';
import usePostStore from '@/store/PostStore';
import { apiClient } from './request';
import { LoginRequest, LoginResponse, CheckLoginResponse } from '../types';

const handleUserLogin = async ({ studentId, password }: LoginRequest) => {
  const { setId, setStudentId, setAvatar, setUsername, setSchool } = useUserStore.getState();
  const { setPoststudentId } = usePostStore.getState();

  const data: LoginRequest = {
    studentId,
    password,
  };

  const result = await apiClient.post<LoginResponse>('/user/login', data, {
    skipAuth: true,
  });
  const responseData = result.data;

  Taro.setStorageSync('token', responseData.token);
  Taro.setStorageSync('sid', responseData.sid);

  setStudentId(responseData.sid);
  setId(responseData.id);
  setAvatar(responseData.avatar);
  setUsername(responseData.username);
  setSchool(responseData.school);
  setPoststudentId(responseData.sid);

  switchTab({ url: '/pages/indexHome/index' });
};

const handleCheckLogin = async () => {
  const { setId, setStudentId, setAvatar, setUsername, setSchool } = useUserStore.getState();
  const { setPoststudentId } = usePostStore.getState();
  if (Taro.getStorageSync('token') && Taro.getStorageSync('sid')) {
    const sid = Taro.getStorageSync('sid');
    const result = await apiClient.get<CheckLoginResponse>(`/user/info/${sid}`);
    const responseData = result.data;
    setId(responseData.id);
    setStudentId(responseData.studentId);
    setAvatar(responseData.avatar);
    setUsername(responseData.name);
    setSchool(responseData.school);
    setPoststudentId(sid);
    switchTab({ url: '/pages/indexHome/index' });
  }
};

export { handleCheckLogin, handleUserLogin };
