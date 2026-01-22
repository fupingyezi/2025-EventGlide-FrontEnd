// 表单相关类型
export type InputType = 'textInpput' | 'dateChoice' | 'SimpChoice';

export interface FormItemType {
  text: string;
  type: InputType;
  reminder: string;
  required: boolean;
  options?: string[];
  disabled: boolean;
}

/** 活动需要填写的表格信息 */
export interface LabelForm {
  type: string;
  holderType: string;
  startTime: string;
  endTime: string;
  position: string;
  if_register: string;
  activeForm?: string;
  register_method?: string;
  signer: { name: string; studentid: string }[];
}

export interface DateItem {
  label: string;
  subLabel: string;
  value: string;
  isToday?: boolean;
  isAll?: boolean;
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  dateString: string;
}
