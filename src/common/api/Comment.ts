import { apiClient } from './request';
import { ResponseType, ReplyType } from '../types';

// 创建评论
export const createComment = (commentData: {
  parent_id: string;
  subject: string;
  receiver: string;
  content: string;
}) => {
  return apiClient.post<ResponseType>('/comment/create', commentData);
};

// 回复评论
export const replyComment = (replyData: {
  parent_id: string;
  subject: string;
  receiver: string;
  content: string;
}) => {
  return apiClient.post<ReplyType>('/comment/answer', replyData);
};

// 获取评论列表
export const getCommentsBySubject = (subjectId: string) => {
  return apiClient.get<ResponseType[]>(`/comment/load/${subjectId}`);
};

// 删除评论
export const deleteComment = (commentId: string) => {
  return apiClient.delete<{}>(`/comment/delete/${commentId}`);
};

// 点赞评论
export const likeComment = (commentId: string, studentId: string, receiver: string) => {
  return apiClient.post<{}>('/interaction/like', {
    studentId,
    subject: 'comment',
    targetid: commentId,
    receiver,
  });
};

// 取消点赞评论
export const unlikeComment = (commentId: string, studentId: string, receiver: string) => {
  return apiClient.post<{}>('/interaction/dislike', {
    studentId,
    subject: 'comment',
    targetid: commentId,
    receiver,
  });
};

// 获取活动评论
export const getActivityComments = (activityId: string) => {
  return apiClient.get<ResponseType[]>(`/act/comment/load/${activityId}`);
};

// 获取帖子评论
export const getPostCommentsFromComment = (postId: string) => {
  return apiClient.get<ResponseType[]>(`/post/comment/load/${postId}`);
};
