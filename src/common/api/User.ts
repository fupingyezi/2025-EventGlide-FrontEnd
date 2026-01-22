import { apiClient } from './request';
import { UserInfo } from '../types';

// 获取用户信息
export const getUserInfo = (studentid: string) => {
  return apiClient.get<UserInfo>(`/user/info/${studentid}`);
};
