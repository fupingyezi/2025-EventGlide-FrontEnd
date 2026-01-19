import { View, ScrollView, GridView, Image, Input } from '@tarojs/components';
import Taro, { navigateTo, useDidShow } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import './index.scss';
import Post from '@/modules/Post/index';
import BlogAdd from '@/modules/blogAdd';
import AlbumWindow from '@/modules/albumWindow';
import searchpic from '@/common/assets/Postlist/搜索.png';
import Info from '@/common/assets/Postlist/info.png';
import usePostStore, { blogType } from '@/store/PostStore';
import get from '@/common/api/get';
import useActivityStore from '@/store/ActivityStore';
import post from '@/common/api/post';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';

const Index = () => {
  const [isAlbumVisiable, setIsAlbumVisiable] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isShowList, setIsShowList] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const { showImg: imgUrl, setImgUrl } = usePostStore();
  const { blogList, setBlogList, setBackPage, setBlogIndex } = usePostStore();
  const { setIsSelect } = useActivityStore();
  const [msgCount, setMsgCount] = useState(0);
  useDidShow(() => {
    setIsSelect(false);
  });

  useDidShow(() => {
    get('/post/all').then((res) => {
      setBlogList(res.data);
      console.log(res.data);
    });
    get('/feed/total').then((res) => {
      console.log(res.data);
    });
    setImgUrl([]);
  });

  useEffect(() => {
    if (blogList === null) return;
    if (blogList.length > 0) {
      handleScroll(windowHeight);
    }
  }, [blogList]);

  Taro.useReady(() => {
    const newwindowHeight = Taro.getWindowInfo().windowHeight;
    setWindowHeight(newwindowHeight);
  });

  const handleScroll = (newwindowHeight?: number) => {
    let tempHeight = windowHeight;
    if (newwindowHeight) {
      tempHeight = newwindowHeight;
    }
    const query = Taro.createSelectorQuery();
    blogList.forEach((_, index) => {
      query.select(`#post-item-${index}`).boundingClientRect();
    });
    query.exec((res) => {
      res.forEach((rect, index) => {
        if (!rect) return;
        const { top, bottom } = rect;
        if (top <= tempHeight && bottom >= 0) {
          setIsShowList((prevList) => {
            if (!prevList.includes(index)) {
              return [...prevList, index];
            }
            return prevList;
          });
        } else {
          setIsShowList((prevList) => {
            return prevList.filter((item) => item !== index);
          });
        }
      });
    });
  };

  const handleSearch = () => {
    if (searchValue === '') {
      get(`/post/all`).then((res) => {
        if (res.msg === 'success') {
          setBlogList(res.data);
        } else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: 'none',
            duration: 1000,
          });
        }
      });
    } else {
      post('/post/find', { name: searchValue }).then((res) => {
        if (res.msg === 'success') {
          setBlogList(res.data);
        } else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: 'none',
            duration: 1000,
          });
        }
      });
    }
  };

  useDidShow(() => {
    get('/feed/total')
      .then((res) => {
        setMsgCount(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  });

const onRefresh = () => {
  console.log('refresh');
  setRefreshing(true);
  
  const timeoutId = setTimeout(() => {
    if (refreshing) {
      setRefreshing(false);
      console.log('刷新失败');
    }
  }, 3000);
  
  const clearTimeoutSafely = () => {
    clearTimeout(timeoutId);
  };
  
  try {
    if (searchValue === '') {
      get('/post/all').then((res) => {
        clearTimeoutSafely();
        setBlogList(res.data);
        get('/feed/total').then((res) => {
          setMsgCount(res.data.total);
          setRefreshing(false);
        }).catch((err) => {
          clearTimeoutSafely();
          setRefreshing(false);
          console.error(err);
        });
      }).catch((err) => {
        clearTimeoutSafely();
        setRefreshing(false);
        console.error(err);
      });
    } else {
      post('/post/find', { name: searchValue }).then((res) => {
        clearTimeoutSafely();
        if (res.msg === 'success') {
          setBlogList(res.data);
        } else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: 'none',
            duration: 1000,
          });
        }
        setRefreshing(false);
      }).catch((err) => {
        clearTimeoutSafely();
        setRefreshing(false);
        console.error(err);
      });
    }
  } catch (error) {
    clearTimeoutSafely();
    setRefreshing(false);
    console.error('刷新过程发生错误:', error);
    Taro.showToast({
      title: "刷新失败，请稍后重试",
      icon: 'none',
      duration: 1000,
    });
  }
};

  return (
    <>
      <NavigationBarTabBar backgroundColor="#FFFFFF" title="发现" />
      <View className="blog-page">
        <BlogAdd setIsVisiable={setIsAlbumVisiable} />
        <AlbumWindow
          isVisiable={isAlbumVisiable}
          setIsVisiable={setIsAlbumVisiable}
          isOverlay={true}
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
          type={'blog'}
        />
        <View className="search-container">
          <View className="info-icon-container">
            <Image
              src={Info}
              className="info-icon"
              mode="widthFix"
              onClick={() => navigateTo({ url: '/subpackage/blogInfo/index' })}
            />
            {msgCount > 0 && (
              <View className="info-icon-msg">{msgCount < 100 ? msgCount : '99+'}</View>
            )}
          </View>
          <View className="sticky-search">
            <View className="search-input-box">
              <Image src={searchpic} className="gap" mode="widthFix" />
              <Input
                className="search-input"
                placeholder="搜索你想要的"
                type="text"
                value={searchValue}
                onInput={(e) => setSearchValue(e.detail.value)}
                onConfirm={() => handleSearch()}
              />
            </View>
            <View className="search-btn" onClick={() => handleSearch()}>
              搜索
            </View>
          </View>
        </View>
        {/* <View > */}
        <ScrollView
          className="blog-container"
          type="custom"
          style={{ height: 'calc(100vh - 270rpx)' }}
          scrollY={true}
          onScroll={() => handleScroll()}
          enhanced={true}
          showScrollbar={false}
          refresherEnabled={true}
          refresherTriggered={refreshing}
          onRefresherRefresh={onRefresh}
          refresherBackground="#f9f8fc"
        >
          <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
            {blogList === null
              ? null
              : blogList.map((item, index) => (
                  <View
                    key={index}
                    id={`post-item-${index}`}
                    onClick={() => {
                      setBlogIndex(item.bid);
                      setBackPage('blogHome');
                    }}
                  >
                    <Post item={item} index={index} isShowImg={isShowList.includes(index)} />
                  </View>
                ))}
          </GridView>
        </ScrollView>
      </View>
    </>
  );
};

export default Index;
