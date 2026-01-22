import { ActivityDetailInfo, SelectedInfo } from './ActivityTypes';
import { PostDetailInfo } from './PostTypes';
import { LabelForm } from './FormTypes';

/** 登录相关请求/响应接口类型 */
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

/** 活动相关请求/响应接口类型 */
export interface GetActivityResponse extends ActivityDetailInfo {}

export interface FilteAcitivityRequest extends SelectedInfo {}

export interface CreateActivityRequest {
  title: string;
  introduce: string;
  showImg: string[];
  labelform: LabelForm;
}

export interface GetActivityDrafytResponse {
  activeForm?: string;
  bid?: string;
  createdAt?: string;
  endTime?: string;
  holderType?: string;
  ifRegister?: string;
  introduce?: string;
  position?: string;
  registerMethod?: string;
  showImg?: string;
  signer?: string;
  startTime?: string;
  studentID?: string;
  title?: string;
  type?: string;
}

/** 帖子相关请求/接口类型 */
export interface CreatePostRequest {
  title: string;
  introduce: string;
  showImg: string[];
  studentid?: string;
}

export interface GetPostReponse extends PostDetailInfo {}

export interface GetPostDraftResonse {
  Bid: string;
  Title: string;
  ShowImg: string[];
  Introduce: string;
  CreateAt: string;
  StudentID: string;
}

/** 草稿相关请求 */
export interface SaveDraftRequest {
  title: string;
  introduce: string;
  showImg: string[];
  labelform?: LabelForm;
  studentid?: string;
  [key: string]: any;
}

/** 用户消息相关请求/响应接口类型 */
export interface GetNotificationCountResponse {
  commentandat: number;
  likeandcollect: number;
  total: number;
  [property: string]: any;
}

export interface GetNotificationListReponse {
  ats?: RespFeedAtResp[];
  collects?: RespFeedCollectResp[];
  comments?: RespFeedCommentResp[];
  invitations?: RespFeedInvitationResp[];
  likes?: RespFeedLikeResp[];
  [property: string]: any;
}

/**
 * resp.FeedAtResp
 */
export interface RespFeedAtResp {
  first_pic?: string;
  id?: number;
  message?: string;
  published_at?: string;
  status?: string;
  target_bid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

/**
 * resp.UserInfo
 */
export interface RespUserInfo {
  avatar?: string;
  studentid?: string;
  username?: string;
  [property: string]: any;
}

/**
 * resp.FeedCollectResp
 */
export interface RespFeedCollectResp {
  first_pic?: string;
  id?: number;
  message?: string;
  published_at?: string;
  status?: string;
  target_bid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

/**
 * resp.FeedCommentResp
 */
export interface RespFeedCommentResp {
  first_pic?: string;
  id?: number;
  message?: string;
  published_at?: string;
  status?: string;
  target_bid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

/**
 * resp.FeedInvitationResp
 */
export interface RespFeedInvitationResp {
  first_pic?: string;
  id?: number;
  message?: string;
  published_at?: string;
  status?: string;
  target_bid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

/**
 * resp.FeedLikeResp
 */
export interface RespFeedLikeResp {
  first_pic?: string;
  id?: number;
  message?: string;
  published_at?: string;
  status?: string;
  target_bid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}
