import { memo, useState, useContext } from 'react';
import { View, Input, PageContainer } from '@tarojs/components';
import { SetReponseContext, SetActivityComment } from '@/subpackage/actComment';
import { SetBlogReponseContext, SetBlogComment } from '@/subpackage/blogDetail';
import './style.scss';

interface replyWindowProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  params: {
    parent_id: string;
    subject: string;
    receiver: string;
  };
  reply_id?: string;
  page: string;
  comment?:boolean;
}

const ReplyWindow: React.FC<replyWindowProps> = memo(({ ...props }) => {
  const [replyText, setReplyText] = useState('');
  const setResponse = useContext(SetReponseContext);
  const setActivityComment = useContext(SetActivityComment);
  const setBlogReponseContext = useContext(SetBlogReponseContext);
  const setBlogComment = useContext(SetBlogComment);
  const {comment}=props;
  const handleSubmit = () => {
    console.log(replyText);
    const { params, page } = props;
    if (!comment) {
      const data = {
        ...params,
        content: replyText,
        parent_id: props.reply_id ?? params.parent_id,
      };
      if (page === 'activity') {
        setResponse(data);
      } else if (page === 'post') {
        setBlogReponseContext(data);
      }
    }else{
      const data = {
        ...params,
        content: replyText,
      };
      if (page === 'activity') {
        setActivityComment(data);
      }else if (page === 'post') {
        setBlogComment(data);
      }
    }
    setReplyText('');
    props.setIsVisible(false);
  };

  return (
    <PageContainer
      show={props.isVisible}
      onLeave={() => props.setIsVisible(false)}
      overlay={true}
      overlayStyle="background-color: rgba(0,0,0,0.5);"
      customStyle="background-color: transparent;"
    >
      <View className="reply-window">
        <View className="reply-window-input">
          <Input
            placeholder={comment?"请输入评论内容":"请输入回复内容"}
            placeholderClass="reply-window-input-placeholder"
            placeholderStyle={'font-family: SimHei;font-size: 30rpx;'}
            value={replyText}
            onInput={(e) => setReplyText(e.detail.value)}
            focus={true}
            onConfirm={() => handleSubmit()}
          />
        </View>
        <View className={`reply-window-btn ${replyText ? 'reply-window-active' : ''}`} onClick={() => handleSubmit()}>
          发布
        </View>
      </View>
    </PageContainer>
  );
});

export default ReplyWindow;
