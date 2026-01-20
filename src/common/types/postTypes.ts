// 帖子相关类型
export type PostList = {
  imgUrl: string;
  title: string;
  content: string;
};

export interface PostCommentProp {
  username: string;
  desc: string;
  time: string;
  site: string;
}

export interface CreatorType {
  username: string;
  avatar: string;
  studentid: string;
}

export interface ReplyType {
  bid: string;
  reply_content: string;
  parentUserName: string;
  reply_creator: {
    avatar: string;
    studentid: string;
    username: string;
  };
  reply_pos: string;
  reply_time: string;
}

export interface ResponseType {
  bid: string;
  commented_pos: string;
  commented_time: string;
  content: string;
  creator: CreatorType;
  isLike: string;
  likeNum: number;
  replyNum: number;
  reply: ReplyType[];
}

export interface PostCommentProps extends PostCommentProp {
  res: PostCommentProp[];
}
