import { View, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { memo, useEffect, useState } from 'react';
import { creatorType } from '@/common/types/PostList';
import deleteComment from '@/common/const/DeleteComment';
import './style.scss';
import Confirmation from '@/modules/ConfirmationCard/components/confirmation';

interface CommentOperationProps {
  setVisible: (visible: boolean) => void;
  studentid: string;
  commentItems: string;
  commentCreator: creatorType | undefined;
  commentid: string;
}

const CommentOperation: React.FC<CommentOperationProps> = memo(({setVisible, studentid, commentItems, commentCreator, commentid}) => {
    const [isDelete, setIsDelete] = useState(false);
    const [commentContent, setCommentContent] = useState(commentItems);
    useEffect(() => {
      if (commentItems.length > 18) {
        setCommentContent(commentItems.slice(0, 18) + '...');
      }else{
        setCommentContent(commentItems);
      }      
    }, [commentItems]);
  const param = {
    target_id: commentid || '',
    studentid: commentCreator?.studentid || '',
  }
  const deleteCommentClick = () => {
    if (studentid == commentCreator?.studentid) {
        console.log(param);
        deleteComment(param).then((res) => {
          console.log(res);
          if(res.msg === 'success'){
            setIsDelete(false);
            setVisible(false);
          }
        }).catch((err) => {
          console.log(err);
        });
    }else{
        console.log('非评论者，不能删除');
    }
  }
  const copyComment = () => {
    Taro.setClipboardData({
      data: commentItems,
      success: function () {
        Taro.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        });
        console.log('复制成功:', commentItems);
      },
      fail: function (err) {
        Taro.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 2000
        });
        console.error('复制失败:', err);
      }
    });
  }
  
  return (
    <View className="commentOperation" onClick={() => setVisible(false)}>
        <View className="commentOperation-box" onClick={(e) => e.stopPropagation()}>
        <View className='commentOperation-top'>
            <Image
              className="commentOperation-top-user"
              src={commentCreator?.avatar || ''}
              mode="scaleToFill"
            />
            <View className='commentOperation-top-text'>{commentContent}</View>
        </View>
        <View className='commentOperation-btn'>
            <View className='commentOperation-btn-item' onClick={copyComment}>
                <View className='commentOperation-btn-icon'></View>
                <View className='commentOperation-btn-text'>复制</View>
            </View>
            {studentid == commentCreator?.studentid &&
            <View className='commentOperation-btn-item' onClick={() => setIsDelete(true)}>
                <View className='commentOperation-btn-icon'></View>
                <View className='commentOperation-btn-text'>删除</View>
            </View>
            }
            <View className='commentOperation-btn-item'>
                <View className='commentOperation-btn-icon'></View>
                <View className='commentOperation-btn-text'>举报</View>
            </View>
            <View className='commentOperation-btn-item'>
                <View className='commentOperation-btn-icon'></View>
                <View className='commentOperation-btn-text'>分享</View>
            </View>
        </View>
        </View>
        {isDelete &&
        <View onClick={(e) => e.stopPropagation()}>
        <Confirmation
          visible={isDelete}
          title="确认删除评论吗？"
          confirmText="是"
          cancelText="否"
          onConfirm={deleteCommentClick}
          onCancel={() => setIsDelete(false)}
        />
        </View>
        }
    </View>
  );
});

export default CommentOperation;