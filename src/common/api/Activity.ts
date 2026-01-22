import { apiClient } from './request';
import Taro from '@tarojs/taro';
import { ActivityDetailList, SelectedInfo } from '../types/activityTypes';
import { User } from '../types/userTypes';
import { LabelForm } from '../types';

// 创建活动
export const createActivity = (activityData: {
  title: string;
  introduce: string;
  showImg: string[];
  labelform: LabelForm;
}) => {
  return apiClient.post<ActivityDetailList>('/act/create', activityData);
};

// 获取活动列表
export const getActivityList = (params?: {
  page?: number;
  size?: number;
  type?: string;
  holderType?: string;
  date?: string;
  position?: string;
}) => {
  return apiClient.get<ActivityDetailList[]>('/act/all', params);
};

export const getActivityDraft = () => {
  return apiClient.get<any>('/act/load');
};

// 获取我的活动列表
export const getMyActivityList = (type: 'release' | 'like' | 'favourite') => {
  if (type === 'release') {
    return apiClient.get<ActivityDetailList[]>('/act/own');
  } else if (type === 'like') {
    return apiClient.post<ActivityDetailList[]>('/user/like/act', {
      studentid: Taro.getStorageSync('sid'),
    });
  } else if (type === 'favourite') {
    return apiClient.post<ActivityDetailList[]>('/user/collect/act', {
      studentid: Taro.getStorageSync('sid'),
    });
  }
  throw new Error('Invalid type for activity list');
};

// 获取活动详情
export const getActivityDetail = (activityId: string) => {
  return apiClient.get<ActivityDetailList>(`/act/detail/${activityId}`);
};

// 根据搜索获取帖子列表
export const searchActivityList = (data?: { name: string }) => {
  return apiClient.post<ActivityDetailList[]>('/act/name', data);
};

// 筛选活动
export const filterActivity = (filterData: SelectedInfo) => {
  return apiClient.post<ActivityDetailList[]>('/act/search', filterData);
};

// 收藏/取消收藏活动
export const toggleActivityCollection = (
  activityId: string,
  studentid: string,
  action: 'collect' | 'cancel'
) => {
  if (action === 'collect') {
    return apiClient.post<{}>('/user/collect/act', {
      targetid: activityId,
      studentid,
    });
  } else {
    return apiClient.post<{}>('/user/cancel/collect/act', {
      targetid: activityId,
      studentid,
    });
  }
};

// 点赞/取消点赞活动
export const toggleActivityLike = (
  activityId: string,
  studentid: string,
  action: 'like' | 'cancel'
) => {
  if (action === 'like') {
    return apiClient.post<{}>('/user/like/act', {
      targetid: activityId,
      studentid,
    });
  } else {
    return apiClient.post<{}>('/user/cancel/like/act', {
      targetid: activityId,
      studentid,
    });
  }
};

// 获取用户信息
export const getUserInfo = (studentid: string) => {
  return apiClient.get<User>(`/user/info/${studentid}`);
};
