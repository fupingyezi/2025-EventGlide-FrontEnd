// 统一类型导出文件
export type {
  // 用户相关类型
  UserInfo,
} from './UserTypes';

export type {
  // 帖子相关类型
  PostList,
  PostDetailInfo,
  PostCommentProp,
  CreatorType,
  ReplyType,
  ResponseType,
  PostCommentProps,
} from './PostTypes';

export type {
  // 活动相关类型
  ActiveList,
  MyActivityList,
  SelectedInfo,
  ActivityDetailInfo,
  LetterType,
} from './ActivityTypes';

export type {
  // 表单相关类型
  InputType,
  FormItemType,
  LabelForm,
  DateItem,
  CalendarDay,
} from './FormTypes';

export type {
  // UI组件相关类型
  ModalProps,
  DrawerProps,
  CustomInputProps,
  ButtonProps,
  ImagePickerProps,
  ConfirmModalProps,
  AddPeopleProps,
  PictureCutProps,
  ReplyInputProps,
} from './UIProps';

// 二级请求函数的接口/响应类型
export type {
  LoginRequest,
  LoginResponse,
  CheckLoginResponse,
  CreateActivityRequest,
  GetActivityResponse,
  GetActivityDrafytResponse,
  FilteAcitivityRequest,
  GetPostReponse,
  CreatePostRequest,
  GetPostDraftResonse,
  SaveDraftRequest,
} from './RequestType';

// 导入资源模块声明
import './global/';
