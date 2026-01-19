import { View } from '@tarojs/components';
import './style.scss';
import get from '@/common/api/get';
import usePostStore from '@/store/PostStore';
import { navigateTo } from '@tarojs/taro';
import add from '@/common/assets/Postlist/add.png';
import { Image } from '@tarojs/components';
const BlogAdd: React.FC<{ setIsVisiable: (value: boolean) => void }> = (props) => {
  const { setImgUrl } = usePostStore();
  const handleClick = () => {
    get('/post/load')
      .then((res) => {
        console.log(res);
        if (res === null || res === undefined) {
          props.setIsVisiable(true);
          return;
        } else if (res.msg === 'success') {
          if (res.data !== null) {
            console.log(res.data.showImg);
            setImgUrl(res.data.showImg);
          }
          navigateTo({ url: '/subpackage/blogAdd/index' });
        } else {
          props.setIsVisiable(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View onClick={() => handleClick()}>
      <Image src={add} className="blog-add"/>
    </View>
  );
};

export default BlogAdd;
