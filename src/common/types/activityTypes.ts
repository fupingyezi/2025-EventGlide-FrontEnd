// 活动相关类型
import { UserInfo } from './UserTypes';

export type ActiveList = {
  date: string;
  position: string;
};

export interface MyActivityList {
  avatar: string;
  title: string;
  name: string;
  likes: number;
  collectNum: number;
  comment: number;
  introduce: string;
  showImg: string[];
  isLike: string;
  isCollect: string;
}

export interface SelectedInfo {
  holderType: string[];
  type: string[];
  detailTime: { startTime: string; endTime: string };
  position: string[];
  if_register: string;
}

export interface ActivityDetailInfo {
  bid: string;
  userInfo: UserInfo;
  title: string;
  detailTime: { startTime: string; endTime: string };
  position: string;
  introduce: string;
  holderType: string;
  type: string;
  if_register: boolean;
  showImg: string[];
  collectNum: number;
  likeNum: number;
  commentNum: number;
  isLike: string;
  isCollect: string;
  isChecking?: string;
}

export interface LetterType {
  message: string;
  published_at: string;
  status: string;
  target_bid: string;
  userInfo: {
    avatar: string;
    studentid: string;
    username: string;
  };
}
