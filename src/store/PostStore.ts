import { create } from 'zustand';

type PostType = {
  bid: string;
  collectNum: number;
  commentNum: number;
  introduce: string;
  likeNum: number;
  isLike: string;
  isCollect: string;
  showImg: string[];
  title: string;
  publishTime: string;
  userInfo: {
    avatar: string;
    school: string;
    studentid: string;
    username: string;
  };
};

interface PostStoreType {
  showImg: string[];
  title: string;
  introduce: string;
  studentid: string;
  PostList: PostType[];
  PostIndex: number;
  backPage: string;
  setBackPage: (page: string) => void;
  setPostList: (PostList: PostType[]) => void;
  setPostIndex: (bid: string) => void;
  setLikeNumChange: (blog: PostType, type: number) => void;
  setCollectNumChange: (blog: PostType, type: number) => void;
  setImgUrl: (url: string[]) => void;
  setPostStudentId: (id: string) => void;
  setCommentNumChange: (blog: PostType) => void;
  setContent: (title: string, description: string, imgUrl: string[]) => void;
}

const usePostStore = create<PostStoreType>((set, get) => ({
  showImg: [],
  title: '',
  introduce: '',
  studentid: '',
  PostList: [],
  PostIndex: -1,
  backPage: '',
  setBackPage: (page) => set(() => ({ backPage: page })),
  setPostList: (PostList) => set(() => ({ PostList })),
  setPostIndex: (bid) => {
    const currentPostList = get().PostList;
    const index = currentPostList.findIndex((b) => b.bid === bid); // 找到 bid 对应的索引
    set(() => ({ PostIndex: index }));
  },
  setLikeNumChange: (blog, type) => {
    const currentPostList = get().PostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.bid === blog.bid) {
        return {
          ...b,
          likeNum: type === 1 ? b.likeNum + 1 : b.likeNum - 1,
          isLike: type === 1 ? 'true' : 'false',
        };
      }
      return b;
    });
    set(() => ({ PostList: updatedPostList }));
  },
  setCollectNumChange: (blog, type) => {
    const currentPostList = get().PostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.bid === blog.bid) {
        return {
          ...b,
          collectNum: type === 1 ? b.collectNum + 1 : b.collectNum - 1,
          isCollect: type === 1 ? 'true' : 'false',
        };
      }
      return b;
    });
    set(() => ({ PostList: updatedPostList }));
  },
  setPostStudentId: (id) => set(() => ({ studentid: id })),
  setImgUrl: (url) => set(() => ({ showImg: url })),
  setContent: (title, description, imgUrl) =>
    set(() => ({ title, introduce: description, showImg: imgUrl })),
  setCommentNumChange: (blog) => {
    const currentPostList = get().PostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.bid === blog.bid) {
        return {
          ...b,
          commentNum: b.commentNum + 1,
        };
      }
      return b;
    });
    set(() => ({ PostList: updatedPostList }));
  },
}));

export default usePostStore;
export { PostType };
