import { View } from '@tarojs/components';
import './style.scss';
import usePostStore from '@/store/PostStore';
import { navigateTo } from '@tarojs/taro';
import add from '@/common/assets/Postlist/add.png';
import { Image } from '@tarojs/components';
import { loadPostDraft } from '@/common/api';
const AddPostButton: React.FC<{ setIsVisiable: (value: boolean) => void }> = (props) => {
  const { setImgUrl } = usePostStore();

  const handleClick = async () => {
    try {
      const res = await loadPostDraft();
      console.log(res);
      if (res === null || res === undefined) {
        props.setIsVisiable(true);
        return;
      } else if (res.msg === 'success') {
        if (res.data !== null) {
          console.log(res.data.showImg);
          setImgUrl(res.data.showImg);
        }
        navigateTo({ url: '/subpackage/postAdd/index' });
      } else {
        props.setIsVisiable(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View onClick={() => handleClick()}>
      <Image src={add} className="blog-add" />
    </View>
  );
};

export default AddPostButton;
