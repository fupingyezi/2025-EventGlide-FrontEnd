import './style.scss';
import { View } from '@tarojs/components';
import CommentItem from '../CommentItem/CommentItem';
import { CommentListProps } from '@/common/types';

const CommentList: React.FC<CommentListProps> = ({
  comments,
  replycomment,
  setReplyId,
  setCommentItems,
  setCommentCreator,
  setCommentid,
  longClick,
  expandLimit = 5,
}) => {
  // 如果没有评论数据，显示空状态
  if (!comments || comments.length === 0) {
    return (
      <View className="CommentList-empty">
        <View className="CommentList-empty-text">暂无评论，快来发表第一条评论吧</View>
      </View>
    );
  }

  return (
    <View className="CommentList">
      {/* 渲染评论列表 */}
      {comments.map((comment) => (
        <CommentItem
          key={comment.bid}
          comment={comment}
          replycomment={replycomment}
          setReplyId={setReplyId}
          setCommentItems={setCommentItems}
          setCommentCreator={setCommentCreator}
          setCommentid={setCommentid}
          longClick={longClick}
          expandLimit={expandLimit}
        />
      ))}
    </View>
  );
};

export default CommentList;
