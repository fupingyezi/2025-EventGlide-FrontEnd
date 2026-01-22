# EventGlide 前端项目文档

EventGlide 是一个基于 Taro 框架开发的小程序前端项目，主要用于活动发布、管理和参与等功能。该项目采用现代化的技术栈，具有良好的用户体验和扩展性。

## 项目架构与技术栈

- **框架**: Taro 4.x (支持多端编译)
- **语言**: TypeScript + React
- **状态管理**: Zustand
- **样式**: Sass
- **构建工具**: Vite
- **UI库**: Taro原生组件

## 目录结构

```
EventGlide-FrontEnd/
├── config/                    # 配置文件
│   ├── dev.ts               # 开发环境配置
│   ├── index.ts             # 主配置文件
│   └── prod.ts              # 生产环境配置
├── src/                     # 源代码目录
│   ├── common/              # 公共资源
│   │   ├── api/             # API 接口定义
│   │   │   ├── Activity.ts  # 活动相关 API
│   │   │   ├── Comment.ts   # 评论相关 API
│   │   │   ├── Login.ts     # 登录相关 API
│   │   │   ├── PostRequest.ts # 帖子相关 API
│   │   │   ├── User.ts      # 用户相关 API
│   │   │   ├── index.ts     # API 导出文件
│   │   │   ├── qiniu.ts     # 七牛云上传 API
│   │   │   └── request.ts   # 请求基础配置
│   │   ├── components/      # 公共组件
│   │   │   ├── Button/      # 按钮组件
│   │   │   ├── CustomInput/ # 自定义输入框组件
│   │   │   ├── Drawer/      # 抽屉组件
│   │   │   ├── Message/     # 消息提示组件
│   │   │   ├── Modal/       # 模态框组件
│   │   │   ├── NavigationBar/ # 导航栏组件
│   │   │   └── Picture/     # 图片组件
│   │   ├── const/           # 常量定义
│   │   │   ├── DeleteComment.ts # 删除评论常量
│   │   │   └── Formconst.ts # 表单常量
│   │   ├── hooks/           # 自定义 Hook
│   │   │   └── useSaveDraft.ts # 草稿保存 Hook
│   │   ├── types/           # 类型定义
│   │   │   ├── global/      # 全局类型
│   │   │   ├── ActivityTypes.ts # 活动类型定义
│   │   │   ├── CommentTypes.ts # 评论类型定义
│   │   │   ├── FormTypes.ts # 表单类型定义
│   │   │   ├── PostTypes.ts # 帖子类型定义
│   │   │   ├── RequestType.ts # 请求响应类型定义
│   │   │   ├── UIProps.ts   # UI 组件 Props 定义
│   │   │   └── UserTypes.ts # 用户类型定义
│   │   └── utils/           # 工具函数
│   │       ├── AlbumFunction.ts # 相册功能工具
│   │       ├── DateList.ts  # 日期列表工具
│   │       ├── Interaction.ts # 交互功能工具
│   │       ├── TimeTranslation.ts # 时间转换工具
│   │       └── throttleDebounce.ts # 节流防抖工具
│   ├── modules/             # 业务模块
│   │   ├── ActivityAddRules/ # 活动添加规则模块
│   │   ├── ActivityCard/    # 活动卡片模块
│   │   ├── ActivityModal/   # 活动模态框模块
│   │   ├── ActivityTabs/    # 活动标签页模块
│   │   ├── AddPostButton/   # 添加帖子按钮模块
│   │   ├── BlogComment/     # 博客评论模块
│   │   ├── Comment/         # 评论模块
│   │   ├── CommentActionSheet/ # 评论操作表模块
│   │   ├── ConfirmModal/    # 确认模态框模块
│   │   ├── ConfirmationCard/ # 确认卡片模块
│   │   ├── DatePicker/      # 日期选择器模块
│   │   ├── EmptyComponent/  # 空组件模块
│   │   ├── Form/            # 表单模块
│   │   ├── ImagePicker/     # 图片选择器模块
│   │   ├── MyPageContent/   # 我的页面内容模块
│   │   ├── PolicyModal/     # 活动发布规则模态框模块
│   │   ├── PostCard/        # 帖子卡片模块
│   │   ├── PostComment/     # 帖子评论模块
│   │   ├── ReplyComment/    # 回复评论模块
│   │   ├── ReplyInput/      # 回复输入框模块
│   │   ├── ScrollTop/       # 返回顶部模块
│   │   └── picturecut/      # 图片裁剪模块
│   ├── pages/               # 页面组件
│   │   ├── addHome/         # 添加页面
│   │   ├── indexHome/       # 首页
│   │   ├── login/           # 登录页面
│   │   ├── mineHome/        # 我的页面
│   │   └── postHome/        # 帖子页面
│   ├── store/               # 状态管理
│   │   ├── ActivityStore.ts # 活动状态管理
│   │   ├── PostStore.ts     # 帖子状态管理
│   │   ├── SignersStore.ts  # 报名者状态管理
│   │   ├── activeInfoStore.ts # 活动信息状态管理
│   │   └── userStore.ts     # 用户状态管理
│   ├── subpackage/          # 分包页面
│   │   ├── actComment/      # 活动评论页面
│   │   ├── actScreen/       # 活动筛选页面
│   │   ├── addIntroduce/    # 添加介绍页面
│   │   ├── addLabel/        # 添加标签页面
│   │   ├── addPeopleIndex/  # 添加人员索引页面
│   │   ├── addPeoplePage/   # 添加人员页面
│   │   ├── addSuccess/      # 添加成功页面
│   │   ├── album/           # 相册页面
│   │   ├── myNotification/  # 我的通知页面
│   │   ├── postAdd/         # 添加帖子页面
│   │   ├── postDetail/      # 帖子详情页面
│   │   ├── review/          # 审核页面
│   │   └── userProfile/     # 用户资料页面
│   ├── app.config.ts        # 应用配置文件
│   ├── app.scss             # 全局样式
│   ├── app.ts               # 应用入口文件
│   └── type.t.ts            # 类型声明文件
├── types/                   # 全局类型定义
│   └── global.d.ts          # 全局类型声明
├── .editorconfig            # 编辑器配置
├── .eslintignore            # ESLint 忽略配置
├── .eslintrc.js             # ESLint 规则配置
├── .gitignore               # Git 忽略配置
├── .prettierignore          # Prettier 忽略配置
├── .prettierrc              # Prettier 配置
├── README.md                # 项目说明文档
├── babel.config.js          # Babel 配置
├── package.json             # 项目依赖配置
├── pnpm-lock.yaml           # 依赖锁定文件
├── prettierrc.cjs           # Prettier 配置 (CJS格式)
├── project.config.json      # 小程序项目配置
├── project.private.config.json # 小程序私有配置
├── project.tt.json          # 头条小程序配置
├── tsconfig.json            # TypeScript 配置
└── yarn.lock                # Yarn 依赖锁定文件
```

## 文件详细说明

### 配置文件 (config/)

- `dev.ts`: 开发环境配置，包含开发环境的特定设置
- `prod.ts`: 生产环境配置，包含生产环境的特定设置
- `index.ts`: 主配置文件，整合不同环境的配置

### 源代码目录 (src/)

#### 公共 API (src/common/api/)

- `Activity.ts`: 包含活动相关的 API 函数，如获取活动列表、筛选活动等
- `Comment.ts`: 包含评论相关的 API 函数，如创建评论、回复评论、获取评论列表等
- `Login.ts`: 包含登录相关的 API 函数，如用户登录验证等
- `PostRequest.ts`: 包含帖子相关的 API 函数，如创建帖子、保存草稿等
- `User.ts`: 包含用户相关的 API 函数，如获取用户信息等
- `index.ts`: 统一导出所有 API 模块
- `qiniu.ts`: 七牛云图片上传相关 API
- `request.ts`: 请求配置和拦截器，包含错误处理和认证逻辑

#### 公共组件 (src/common/components/)

- `Button/`: 按钮组件，提供多种样式的按钮
- `CustomInput/`: 自定义输入框组件，增强输入体验
- `Drawer/`: 抽屉组件，用于侧边滑出内容
- `Message/`: 消息提示组件，用于展示通知、警告或错误信息
- `Modal/`: 模态框组件，用于弹窗展示
- `NavigationBar/`: 导航栏组件，提供统一的导航功能
- `Picture/`: 图片组件，处理图片加载和展示

#### 常量定义 (src/common/const/)

- `DeleteComment.ts`: 定义删除评论相关的常量
- `Formconst.ts`: 定义表单相关的常量

#### 自定义 Hook (src/common/hooks/)

- `useSaveDraft.ts`: 用于自动保存表单草稿的 Hook

#### 类型定义 (src/common/types/)

- `global/`: 全局类型定义
- `ActivityTypes.ts`: 活动相关数据类型的定义
- `CommentTypes.ts`: 评论相关数据类型的定义
- `FormTypes.ts`: 表单相关数据类型的定义
- `PostTypes.ts`: 帖子相关数据类型的定义
- `RequestType.ts`: API 请求和响应数据类型的定义
- `UIProps.ts`: UI 组件 Props 的类型定义
- `UserTypes.ts`: 用户相关数据类型的定义
- `index.d.ts`: 统一导出所有类型定义

#### 工具函数 (src/common/utils/)

- `AlbumFunction.ts`: 相册功能相关的工具函数
- `DateList.ts`: 日期列表生成工具
- `Interaction.ts`: 交互功能相关的工具函数
- `TimeTranslation.ts`: 时间转换工具，如相对时间显示
- `throttleDebounce.ts`: 节流和防抖工具函数

#### 业务模块 (src/modules/)

- `ActivityAddRules/`: 活动添加规则相关组件和逻辑
- `ActivityCard/`: 活动卡片展示组件
- `ActivityModal/`: 活动详情模态框组件
- `ActivityTabs/`: 活动分类标签页组件
- `AddPostButton/`: 添加帖子按钮组件
- `BlogComment/`: 博客评论相关组件
- `Comment/`: 通用评论组件
- `CommentActionSheet/`: 评论操作菜单组件
- `ConfirmModal/`: 确认模态框组件
- `ConfirmationCard/`: 确认卡片组件
- `DatePicker/`: 日期选择器组件
- `EmptyComponent/`: 各种空状态组件（如无数据时的占位图）
- `Form/`: 表单相关组件（FormItem, FormPicker等）
- `ImagePicker/`: 图片选择和上传组件
- `MyPageContent/`: 我的页面内容组件
- `PolicyModal/`: 政策协议模态框组件
- `PostCard/`: 帖子卡片展示组件
- `PostComment/`: 帖子评论组件
- `ReplyComment/`: 回复评论组件
- `ReplyInput/`: 回复输入框组件
- `ScrollTop/`: 返回顶部按钮组件
- `picturecut/`: 图片裁剪功能组件

#### 页面组件 (src/pages/)

- `addHome/`: 添加页面，用于发布新的活动或帖子
- `indexHome/`: 首页，展示推荐活动和帖子
- `login/`: 登录页面，用户身份验证
- `mineHome/`: 我的页面，展示个人信息和历史记录
- `postHome/`: 发现页面，浏览所有帖子

#### 状态管理 (src/store/)

- `ActivityStore.ts`: 管理活动相关的全局状态
- `PostStore.ts`: 管理帖子相关的全局状态
- `SignersStore.ts`: 管理报名者相关的全局状态
- `activeInfoStore.ts`: 管理当前活动信息的状态
- `userStore.ts`: 管理用户相关的全局状态

#### 分包页面 (src/subpackage/)

- `actComment/`: 活动评论详情页面
- `actScreen/`: 活动筛选页面
- `addIntroduce/`: 添加活动介绍页面
- `addLabel/`: 添加标签页面
- `addPeopleIndex/`: 添加人员索引页面
- `addPeoplePage/`: 添加人员详细页面
- `addSuccess/`: 添加成功反馈页面
- `album/`: 相册页面
- `myNotification/`: 我的通知页面
- `postAdd/`: 添加帖子页面
- `postDetail/`: 帖子详情页面
- `review/`: 内容审核页面
- `userProfile/`: 用户个人资料编辑页面

### 主要应用文件

- `app.config.ts`: 应用全局配置，包括页面路由、tabBar 设置等
- `app.scss`: 全局样式文件
- `app.ts`: 应用根组件
- `type.t.ts`: 额外的类型声明

## API 接口说明

### 用户相关 API

- `login()`: 用户登录验证
- `getUserInfo()`: 获取用户详细信息
- `checkLogin()`: 检查登录状态

### 活动相关 API

- `getActivityList()`: 获取活动列表
- `createActivity()`: 创建新活动
- `filterActivity()`: 筛选活动
- `getActivityDetail()`: 获取活动详情

### 帖子相关 API

- `getPostList()`: 获取帖子列表
- `createPost()`: 创建新帖子
- `getMyPostList()`: 获取我的帖子列表
- `savePostDraft()`: 保存帖子草稿

### 评论相关 API

- `createComment()`: 创建评论
- `replyComment()`: 回复评论
- `getCommentsBySubject()`: 获取指定主题的评论列表
- `deleteComment()`: 删除评论
- `likeComment()`: 点赞评论
- `unlikeComment()`: 取消点赞评论

## 组件说明

### 公共组件

- **Button**: 提供统一的按钮样式和行为
- **Modal**: 弹出式对话框，用于重要信息确认
- **Drawer**: 侧滑面板，用于展示附加功能
- **Message**: 消息提示，用于反馈用户操作结果
- **Navigation Bar**: 统一的导航栏组件

### 业务组件

- **Activity Card**: 展示活动基本信息的卡片组件
- **Post Card**: 展示帖子内容的卡片组件
- **Comment System**: 完整的评论系统，支持回复和点赞
- **Image Picker**: 图片选择和上传组件
- **Form Components**: 表单相关的各种输入组件

## 状态管理

项目使用 Zustand 进行状态管理，主要包括：

- **User Store**: 管理用户登录信息和基本资料
- **Activity Store**: 管理活动列表和筛选条件
- **Post Store**: 管理帖子列表和用户互动状态
- **Active Info Store**: 管理当前活动的详细信息

## 开发指南

### 环境要求

- Node.js >= 16.0.0
- Taro CLI >= 4.0.0

### 安装依赖

```bash
pnpm install
```

### 开发命令

```bash
# 微信小程序开发
npm run dev:weapp

# H5 开发
npm run dev:h5

# 构建微信小程序
npm run build:weapp

# 构建 H5
npm run build:h5
```

### 代码规范

- 使用 TypeScript 编写所有组件和逻辑
- 组件遵循 React 函数式组件规范
- API 调用使用统一的请求封装
- 样式使用 Sass 预处理器

## 项目特色

1. **多端兼容**: 基于 Taro 框架，一套代码可编译到多个平台
2. **状态管理**: 使用 Zustand 进行高效的状态管理
3. **组件化设计**: 高度组件化的架构，便于维护和复用
4. **类型安全**: 完整的 TypeScript 类型定义，提升代码质量
5. **用户体验**: 注重交互细节，提供流畅的用户体验

## 部署说明

项目可部署为微信小程序或其他支持的平台，具体部署步骤请参考 Taro 官方文档。
