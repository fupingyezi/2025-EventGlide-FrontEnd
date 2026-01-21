import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import { useState, useEffect, createContext } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.scss';
import { NavigationBar } from '@/common/components/NavigationBar';
import favor from '@/common/svg/post/heart.svg';
import collect from '@/common/svg/post/star.svg';
import collectActive from '@/common/svg/post/starAct.svg';
import favorActive from '@/common/svg/post/heartAct.svg';
import comment from '@/common/assets/Postlist/comment.png';
import icon from '@/common/assets/Postlist/inputIcon.png';
import { ResponseType, CreatorType } from '@/common/types';
import useUserStore from '@/store/userStore';
import usePostStore from '@/store/PostStore';
import handleInteraction from '@/common/utils/Interaction';
import get from '@/common/api/get';
import post from '@/common/api/post';
import BlogComment from '@/modules/BlogComment/components';
import ReplyInput from '@/modules/ReplyInput';
import CommentActionSheet from '@/modules/CommentActionSheet';

export const SetBlogReponseContext = createContext<(params: any) => void>(() => {});
export const SetBlogComment = createContext<(params: any) => void>(() => {});

const Index = () => {
  const [marginTop, setMarginTop] = useState(0);
  const [response, setResponse] = useState<ResponseType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { avatar } = useUserStore((state) => state);
  const studentid = Taro.getStorageSync('sid');
  const { blogList, blogIndex, setCommentNumChange, backPage } = usePostStore((state) => state);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRequest, setIsRequest] = useState(true);
  const [reply_id, setReply_id] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [commentInput, setCommentInput] = useState(false);
  const [showpicture, setShowpicture] = useState(false);
  const [imageRatios, setImageRatios] = useState<string[]>([]);
  const [ratios, setRatios] = useState<string[]>([]);
  const [maxheight, setMaxheight] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);
  const [commentOperation, setCommentOperation] = useState(false);
  const [commentItems, setCommentItems] = useState('');
  const [commentCreator, setCommentCreator] = useState<CreatorType>();
  const [commentid, setCommentid] = useState('');
  const { setLikeNumChange, setCollectNumChange } = usePostStore((state) => state);
  const windowWidth = Taro.getWindowInfo().windowWidth;
  const windowHeight = Taro.getWindowInfo().windowHeight;
  const Item = blogList[blogIndex];
  console.log(Item);
  const params = {
    subject: 'post',
    studentid: studentid,
    targetid: Item.bid,
    receiver: Item.userInfo.studentid,
  };

  const reply_params = {
    parent_id: reply_id,
    subject: 'post',
    receiver: Item.userInfo.studentid,
  };
  const comment_params = {
    parent_id: Item.bid,
    subject: 'post',
    receiver: Item.userInfo.studentid,
  };

  const handlepic = (pictures) => {
    let max = 0;
    let windowRatio = Number((windowHeight / windowWidth).toFixed(2));
    const res = Array(pictures.length).fill('widthimg');
    const res2 = Array(pictures.length).fill('widthimg');
    for (let i = 0; i < pictures.length; i++) {
      if (pictures[i] > 1.2) {
        max = 1.2;
        res[i] = 'heigthimg';
        if (pictures[i] > windowRatio) {
          res2[i] = 'heigthimg';
        }
      } else {
        max = Math.max(max, pictures[i]);
      }
    }
    console.log(res);
    console.log(max);
    setMaxheight(max);
    setImageRatios(res);
    setRatios(res2);
  };

  const loadImageRatios = async () => {
    if (Item && Item.showImg) {
      const ratios: number[] = [];

      for (const imgUrl of Item.showImg) {
        try {
          const imgInfo = await Taro.getImageInfo({ src: imgUrl });
          const ratio = Number((imgInfo.height / imgInfo.width).toFixed(2));
          ratios.push(ratio);
        } catch (error) {
          console.error(`获取图片 ${imgUrl} 比例失败:`, error);
          ratios.push(1);
        }
      }
      handlepic(ratios);
    }
  };

  const handleLikeComment = async (bid: string, receiver: string) => {
    const action =
      response.find((item) => item.bid === bid)?.isLike === 'true' ? 'dislike' : 'like';
    const tag = handleInteraction(action, {
      studentid: studentid,
      subject: 'comment',
      targetid: bid,
      receiver: receiver,
    });

    try {
      const res = await tag;
      if (res.msg === 'success') {
        const updatedResponse = response.map((item) => {
          if (item.bid === bid) {
            const newIsLike = item.isLike === 'true' ? 'false' : 'true';
            const newLikeNum = newIsLike === 'true' ? item.likeNum + 1 : item.likeNum - 1;
            return {
              ...item,
              isLike: newIsLike,
              likeNum: newLikeNum,
            };
          }
          return item;
        });
        setResponse(updatedResponse);
      } else {
        Taro.showToast({
          title: '点赞失败',
          icon: 'none',
          duration: 1000,
        });
      }
    } catch (err) {
      console.error(err);
      Taro.showToast({
        title: '点赞失败',
        icon: 'none',
        duration: 1000,
      });
    }
  };

  const handleImageClick = () => {
    setClickCount((prev) => prev + 1);

    if (clickCount === 1) {
      if (clickTimer) {
        clearTimeout(clickTimer);
        setClickTimer(null);
      }
      if (Item.isLike === 'false') {
        handleInteraction('like', params)
          .then((res) => {
            if (res.msg === 'success') {
              setLikeNumChange(Item, 1);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setClickCount(0);
    } else {
      const timer = setTimeout(() => {
        setShowpicture(true);
        setClickCount(0);
        setClickTimer(null);
      }, 300);
      setClickTimer(timer);
    }
  };
  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);

  useDidShow(() => {
    get(`/comment/load/${Item.bid}`).then((res) => {
      console.log(res);
      if (res.data === null) {
        setResponse([]);
        return;
      }
      setResponse(res.data);
    });
  });

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query.select('.postDetail-content').boundingClientRect();
    query.exec((res) => {
      console.log(res[0]);
      setMarginTop(res[0].height + 100);
    });
    loadImageRatios();
  }, [blogIndex]);

  useEffect(() => {
    if (isRequest) {
      get(`/comment/load/${Item.bid}`)
        .then((res) => {
          setResponse(res.data);
          setIsRequest(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isRequest]);

  const handleLike = () => {
    if (Item.isLike === 'true') {
      handleInteraction('dislike', params)
        .then((res) => {
          if (res.msg === 'success') {
            setLikeNumChange(Item, 0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Item.isLike === 'false') {
      handleInteraction('like', params)
        .then((res) => {
          console.log(res);
          if (res.msg === 'success') {
            setLikeNumChange(Item, 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCollect = () => {
    if (Item.isCollect === 'true') {
      handleInteraction('discollect', params)
        .then((res) => {
          if (res.msg === 'success') {
            setCollectNumChange(Item, 0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Item.isCollect === 'false') {
      handleInteraction('collect', params)
        .then((res) => {
          if (res.msg === 'success') {
            setCollectNumChange(Item, 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const setBlogComment = (params: any) => {
    if (params.content === '') {
      Taro.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 300,
      });
    } else {
      post('/comment/create', params).then((res) => {
        console.log(res);
        if (res.msg === 'success') {
          setResponse([...response, res.data]);
          setCommentNumChange(Item);
          setInputValue('');
        }
      });
    }
  };

  const setBlogReponseContext = (params: any) => {
    console.log('你干嘛', response);
    if (params.content === '') {
      Taro.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 300,
      });
    } else {
      post('/comment/answer', params).then((res) => {
        if (res.msg === 'success') {
          console.log(res);

          get(`/comment/load/${Item.bid}`).then((res) => {
            console.log(res);
            if (res.data === null) {
              setResponse([]);
              return;
            }
            setResponse(res.data);
          });
        }
      });
    }
  };

  return (
    <>
      <View className="postDetail">
        <NavigationBar url={`/pages/${backPage}/index`} userInfo={Item.userInfo} />
        <View className="postDetail-content">
          {maxheight > 0 && (
            <View className="postDetail-content-avatar" onClick={handleImageClick}>
              <View style={`width: ${windowWidth}px; height: ${windowWidth * maxheight}px`} />
              <Swiper
                className="postDetail-content-avatar-swiper"
                indicatorDots={true}
                circular={false}
                current={currentIndex}
                onChange={(e) => setCurrentIndex(e.detail.current)}
              >
                {Item.showImg.map((item, index) => (
                  <SwiperItem key={index} className="postDetail-content-avatar-swiper-item">
                    <Image
                      src={item}
                      className={`postDetail-content-avatar-swiper-item-${imageRatios[index]}`}
                      mode={imageRatios[index] === 'widthimg' ? 'widthFix' : 'heightFix'}
                    />
                  </SwiperItem>
                ))}
              </Swiper>
            </View>
          )}
          <View className="postDetail-content-title">{Item.title}</View>
          <View className="postDetail-content-desc">{Item.introduce || ''}</View>
          <View className="postDetail-content-timesite">{Item.publishTime}</View>
        </View>
        <View className="postDetail-comment" style={{ top: `${marginTop}px` }}>
          <View className="postDetail-comment-number">共{Item.commentNum}条评论</View>
          <View className="postDetail-comment-input">
            <Image
              className="postDetail-comment-input-avatar"
              mode="scaleToFill"
              src={avatar}
            ></Image>
            <View className="postDetail-comment-input-text" onClick={() => setCommentInput(true)}>
              {inputValue ? inputValue : '让大家听到你的声音'}
            </View>
          </View>
          <View className="postDetail-comment-list">
            {response &&
              response.map((item, index) => (
                <BlogComment
                  key={index}
                  bid={item.bid}
                  creator={item.creator}
                  content={item.content}
                  commented_time={item.commented_time}
                  commented_pos={item.commented_pos}
                  reply={item.reply ?? []}
                  likeNum={item.likeNum}
                  isLike={item.isLike}
                  replyNum={item.replyNum}
                  setIsVisible={setIsVisible}
                  setReply_id={setReply_id}
                  handleLikeComment={handleLikeComment}
                  longClick={() => setCommentOperation(true)}
                  setCommentItems={setCommentItems}
                  setCommentCreator={setCommentCreator}
                  setCommentid={setCommentid}
                ></BlogComment>
              ))}
          </View>
        </View>
        <View className="postDetail-footer">
          <View className="postDetail-footer-input" onClick={() => setCommentInput(true)}>
            <Image className="postDetail-footer-input-icon" mode="widthFix" src={icon}></Image>
            <View className="postDetail-footer-input-text">
              {inputValue ? inputValue : '说点什么'}
            </View>
          </View>
          <View className="postDetail-footer-desc">
            <Image
              className="postDetail-footer-desc-icon1"
              mode="widthFix"
              src={Item.isLike === 'true' ? favorActive : favor}
              onClick={handleLike}
            ></Image>
            <View className="postDetail-footer-desc-text">{Item.likeNum}</View>
            <Image
              className="postDetail-footer-desc-icon2"
              mode="widthFix"
              src={Item.isCollect === 'true' ? collectActive : collect}
              onClick={handleCollect}
            ></Image>
            <View className="postDetail-footer-desc-text">{Item.collectNum}</View>
            <Image className="postDetail-footer-desc-icon3" mode="widthFix" src={comment}></Image>
            <View className="postDetail-footer-desc-text">{Item.commentNum}</View>
          </View>
          {/*{commentInput && (
          <View className="comment-popup">
            <View className="comment-popup-cancel" onClick={() => setCommentInput(false)} />
            <View className="comment-popup-box">
              <Input
                className="comment-popup-box-input"
                placeholder="在此输入"
                placeholderClass="postDetail-comment-input-text-input"
                value={inputValue}
                focus={true}
                onInput={(e) => handleInput(e)}
              ></Input>
              <View
                className={`comment-popup-box-send ${inputValue ? 'comment-popup-box-send-active' : ''}`}
                onClick={() => {
                  handleSubmit();
                  setCommentInput(false);
                }}
              >
                发送
              </View>
            </View>
          </View>
        )}*/}
        </View>
        {isVisible ? (
          <SetBlogReponseContext.Provider value={setBlogReponseContext}>
            <ReplyInput
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              params={reply_params}
              reply_id={reply_id}
              page="post"
            />
          </SetBlogReponseContext.Provider>
        ) : (
          <SetBlogComment.Provider value={setBlogComment}>
            <ReplyInput
              isVisible={commentInput}
              setIsVisible={setCommentInput}
              params={comment_params}
              page="post"
              comment={true}
            />
          </SetBlogComment.Provider>
        )}
        {showpicture && imageRatios.length > 0 && (
          <View className="showpicture" onClick={() => setShowpicture(false)}>
            <Swiper
              className="showpicture-swiper"
              indicatorDots={true}
              interval={3000}
              circular={false}
              current={currentIndex}
            >
              {Item.showImg.map((item, index) => (
                <SwiperItem key={index} className={`showpicture-swiper-${ratios[index]}`}>
                  <Image src={item} className="showpicture-swiper-item-img" mode="widthFix" />
                </SwiperItem>
              ))}
            </Swiper>
          </View>
        )}
        {commentOperation && (
          <CommentActionSheet
            setVisible={setCommentOperation}
            studentid={studentid}
            commentItems={commentItems}
            commentCreator={commentCreator}
            commentid={commentid}
          />
        )}
      </View>
    </>
  );
};

export default Index;
