import { apiClient } from './request';
import {
  CommentRequest,
  DeleteCommentRequest,
  CommentResponse,
  LikeCommentRequest,
} from '../types';

// 创建评论
export const createComment = (commentData: CommentRequest) => {
  return apiClient.post<CommentResponse>('/comment/create', commentData);
};

// 回复评论
export const replyComment = (replyData: CommentRequest) => {
  return apiClient.post<CommentResponse>('/comment/answer', replyData);
};

// 获取评论列表
export const getCommentsBySubject = (subjectId: string) => {
  return apiClient.get<CommentResponse[]>(`/comment/load/${subjectId}`);
};

// 删除评论
export const deleteComment = (data: DeleteCommentRequest) => {
  return apiClient.post<{}>('/comment/delete', data);
};

// 点赞评论
export const likeComment = (data: LikeCommentRequest) => {
  return apiClient.post<{}>('/interaction/like', data);
};

// 取消点赞评论
export const unlikeComment = (data: LikeCommentRequest) => {
  return apiClient.post<{}>('/interaction/dislike', data);
};
