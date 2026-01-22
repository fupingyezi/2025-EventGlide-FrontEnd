import Taro from '@tarojs/taro';
import { switchTab } from '@tarojs/taro';
import useUserStore from '@/store/userStore';
import usePostStore from '@/store/PostStore';
import { apiClient } from './request';

export interface LoginRequest {
  studentid: string;
  password: string;
}

export interface LoginResponse {
  Id: number;
  avatar: string;
  username: string;
  school: string;
  sid: string;
  token: string;
}

export interface CheckLoginResponse {
  id: number;
  avatar: string;
  name: string;
  school: string;
  student_id: string;
  token: string;
}

const handleUserLogin = async ({ studentid, password }: LoginRequest) => {
  const { setId, setStudentId, setAvatar, setUsername, setSchool } = useUserStore.getState();
  const { setPostStudentId } = usePostStore.getState();

  const data: LoginRequest = {
    studentid,
    password,
  };

  const result: { data: LoginResponse } = await apiClient.post('/user/login', data, {
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
    const result: { data: CheckLoginResponse } = await apiClient.get(`/user/info/${sid}`);
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

export { handleCheckLogin, handleUserLogin };
