import { apiClient } from './request';
import Taro from '@tarojs/taro';
import { GetPostReponse, CreatePostRequest, GetPostDraftResonse } from '../types';
// 创建帖子
export const createPost = (postData: CreatePostRequest) => {
  return apiClient.post<any>('/post/create', postData);
};

// 获取帖子列表
export const getPostList = (params?: { page?: number; size?: number; type?: string }) => {
  return apiClient.get<GetPostReponse[]>('/post/all', params);
};

// 根据搜索获取帖子列表
export const searchPostList = (data?: { name: string }) => {
  return apiClient.post<GetPostReponse[]>('/post/find', data);
};

// 获取我的帖子列表
export const getMyPostList = (type: 'release' | 'like' | 'favourite') => {
  if (type === 'release') {
    return apiClient.get<GetPostReponse[]>('/post/own');
  } else if (type === 'like') {
    return apiClient.post<GetPostReponse[]>('/user/like/post', {
      sid: Taro.getStorageSync('sid'),
    });
  } else if (type === 'favourite') {
    return apiClient.post<GetPostReponse[]>('/user/collect/post', {
      sid: Taro.getStorageSync('sid'),
    });
  }
  throw new Error('Invalid type for post list');
};

// 收藏/取消收藏帖子
export const togglePostCollection = (
  postId: string,
  studentid: string,
  action: 'collect' | 'cancel'
) => {
  if (action === 'collect') {
    return apiClient.post<{}>('/user/collect/post', {
      targetid: postId,
      studentid,
    });
  } else {
    return apiClient.post<{}>('/user/cancel/collect/post', {
      targetid: postId,
      studentid,
    });
  }
};

// 点赞/取消点赞帖子
export const togglePostLike = (postId: string, studentid: string, action: 'like' | 'cancel') => {
  if (action === 'like') {
    return apiClient.post<{}>('/user/like/post', {
      targetid: postId,
      studentid,
    });
  } else {
    return apiClient.post<{}>('/user/cancel/like/post', {
      targetid: postId,
      studentid,
    });
  }
};

// 评论帖子
export const commentPost = (
  postId: string,
  commentData: {
    studentid: string;
    content: string;
    parentCommentId?: string;
  }
) => {
  return apiClient.post<{}>('/post/comment', {
    bid: postId,
    ...commentData,
  });
};

// 获取帖子评论
export const getPostComments = (
  postId: string,
  params?: {
    page?: number;
    size?: number;
  }
) => {
  return apiClient.get<any>(`/post/comments/${postId}`, params); // 使用any类型，因为没有具体的评论类型定义
};

// 加载帖子草稿
export const loadPostDraft = () => {
  return apiClient.get<GetPostDraftResonse>('/post/load'); // 返回类型待定，根据实际API响应确定
};

// 保存帖子草稿
export const savePostDraft = (draftData: CreatePostRequest) => {
  return apiClient.post<CreatePostRequest>('/post/draft', draftData);
};
