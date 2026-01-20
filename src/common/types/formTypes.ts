// 表单相关类型
export type InputType = 'textInpput' | 'dateChoice' | 'SimpChoice';

export interface FormType {
  text: string;
  type: InputType;
  reminder: string;
  required: boolean;
  options?: string[];
  disabled: boolean;
}

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
