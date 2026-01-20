// 统一类型导出文件
export type {
  // 用户相关类型
  User,
} from './userTypes';

export type {
  // 帖子相关类型
  PostList,
  PostCommentProp,
  CreatorType,
  ReplyType,
  ResponseType,
  PostCommentProps,
} from './postTypes';

export type {
  // 活动相关类型
  ActiveList,
  MineActivityList,
  SelectedInfo,
  ActivityDetailList,
  LetterType,
} from './activityTypes';

export type {
  // 表单相关类型
  InputType,
  FormType,
  LabelForm,
} from './formTypes';

export type {
  // UI组件相关类型
  ModalProps,
  DrawerProps,
  CustomInputProps,
  ButtonProps,
  ImagePickerProps,
  AddPeopleProps,
  PictureCutProps,
} from './uiProps';

// 导入资源模块声明
import './global/';
