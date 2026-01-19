import './style.scss';
import { View, Image } from '@tarojs/components';
import { replyType } from '@/common/types/PostList';
import { memo } from 'react';
import TimeTranslation from '@/common/const/TimeTranslation';
import favor from '@/common/svg/post/heart.svg';
import favorAct from '@/common/svg/post/heartAct.svg';
import { useState } from 'react';
import handleInteraction from '@/common/const/Interaction';
const ReplyComment: React.FC<replyType | any> = memo(({ ...props }) => {
  const [islike, setIslike] = useState(props.isLike);
  const [nums, setNums] = useState(props.likeNum);
  const param={
    studentid: props.studentid,
    subject: 'comment',
    targetid: props.bid,
    receiver: props.reply_creator.studentid,
  }
  const clickLove = async () => {
    const action = islike === 'true' ? 'dislike' : 'like';
    const tag = handleInteraction(action, param);
    try{
      const res = await tag;
      if(res.msg === 'success'){
        if(action === 'like'){
          setIslike('true');
          setNums(nums + 1);
        }else if(action === 'dislike'){
          setIslike('false');
          setNums(nums - 1);
        }
      }
    }catch(error){
      console.log('Error handling interaction:', error);
      return;
    }
  }
  return (
    <View className="ReplyComment">
      <View className="ReplyComment-content">
        <Image
          className="ReplyComment-avatar"
          src={props.reply_creator.avatar}
          mode="scaleToFill"
        />
        <View className="ReplyComment-info"
        onClick={() => {
          props.setIsVisible(true);
          props.setReply_id(props.bid);
        }}
        >
          <View className="ReplyComment-info-name">{props.reply_creator.username ?? '校灵通'}</View>
          <View className="ReplyComment-info-content">
            {props.parentUserName && `@${props.parentUserName}:`}
            {props.reply_content}
          </View>
          <View className="ReplyComment-info-timesite">
            {TimeTranslation(props.reply_time)}&nbsp;&nbsp;
            <View
              style={' color: #5E5064;'}
            >
              回复
            </View>
          </View>
        </View>
        <Image
          className="ReplyComment-favor"
          onClick={clickLove}
          src={islike === 'true' ? favorAct : favor}
          mode="widthFix"
        />
        <View className="ReplyComment-likeNum">{nums}</View>
      </View>
    </View>
  );
});

export default ReplyComment;
