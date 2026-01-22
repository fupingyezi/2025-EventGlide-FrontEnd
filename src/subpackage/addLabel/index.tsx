import { View, Image, Form } from '@tarojs/components';
import { useState } from 'react';
import './index.scss';
import Taro from '@tarojs/taro';
import { FormItem, FormPicker } from '@/modules/Form';
import formList from '@/common/const/Formconst';
import Button from '@/common/components/Button';
import draft from '@/common/svg/add/draft.svg';
import ActivityModal from '@/modules/ActivityModal';
import ConfirmModal from '@/modules/ConfirmModal';
import { navigateTo, useDidShow } from '@tarojs/taro';
import { LabelForm } from '@/common/types';
import useActiveInfoStore from '@/store/activeInfoStore';
import useSignersStore from '@/store/SignersStore';
import { useDraft } from '@/common/hooks/useDraft';
import { getActivityDraft } from '@/common/api';

const Index = () => {
  const { setLabelForm } = useActiveInfoStore();
  const { labelform } = useActiveInfoStore();

  const { title, introduce, showImg } = useActiveInfoStore();
  const signers = useSignersStore((state) => state.signers).map((signer) => {
    const { id, ...rest } = signer;
    return rest;
  });
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [showDraftWindow, setShowDraftWindow] = useState(false);
  const [showFormWindow, setShowFormWindow] = useState(false);
  const [showFormIndex, setShowFormIndex] = useState<number>(0);
  const [activeForm, setActiveForm] = useState<string[]>([]);

  const updateActiveForm = (values: string[]) => {
    setActiveForm(values);
    setFormValue((prev) => ({
      ...prev,
      activeForm: values.join(','), // 将数组转换为字符串存储
    }));
  };

  const [formValue, setFormValue] = useState<LabelForm>({
    type: '',
    holderType: '',
    startTime: '',
    endTime: '',
    position: '',
    if_register: '',
    activeForm: '',
    register_method: '',
    signer: [],
  });

  const { saveDraft } = useDraft({
    onSaveSuccess: () => {
      setShowDraftWindow(false);
    },
    onSaveError: (error) => {
      console.error('草稿保存失败:', error);
    },
  });

  useDidShow(() => {
    getActivityDraft().then((res) => {
      console.log('label', res);
      if (res.msg === 'success') {
        const newLabelForm: LabelForm = {
          type: formValue.type || res.data.Type,
          holderType: formValue.holderType || res.data.HolderType,
          startTime: formValue.startTime || res.data.StartTime,
          endTime: formValue.endTime || res.data.EndTime,
          position: formValue.position || res.data.Position,
          if_register: formValue.if_register || res.data.IfRegister,
          activeForm: formValue.activeForm || res.data.ActiveForm || '',
          register_method: formValue.register_method || res.data.RegisterMethod || '',
          signer: (signers || res.data.Signer).map((signer) => ({
            name: signer.name,
            studentid: signer.studentid,
          })),
        };
        console.log('newLabelForm', newLabelForm);
        setFormValue(newLabelForm);
      }
    });
  });

  const typeChoice = (showFormIndex: number) => {
    if (showFormIndex === 2 || showFormIndex === 3) return 'dateChoice';
    else if (showFormIndex === 6) return 'albumChoice';
    else return 'SimpChoice';
  };

  const setSafeFormIndex = (value: number) => {
    const safeValue = Math.min(Math.max(value, 0), 8);
    setShowFormIndex(safeValue);
  };

  const handleFormSubmit = () => {
    const { type, holderType, startTime, endTime, position, if_register, register_method } =
      formValue;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const minTimeDiff = 30 * 60 * 1000;
    if (start >= end || end - start < minTimeDiff) {
      Taro.showToast({
        title: '请填写正确的开始时间和结束时间',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!type || !holderType || !startTime || !endTime || !position || !if_register) {
      Taro.showToast({
        title: '还有必填项未选择，请检查',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (if_register === '是' && !register_method) {
      Taro.showToast({
        title: '请填写报名方式',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    setLabelForm({ ...labelform, ...formValue, signer: signers });
    setShowPostWindow(true);
  };

  const handleFormSubmitEvent = (e: any) => {
    console.log('Form submitted:', e.detail.value);
    handleFormSubmit();
  };

  const btn = {
    text: '下一步',
    backgroundColor: '#CF79FA',
    textColor: '#FFFEFF',
    isBorder: false,
  };

  return (
    <View className="add-label">
      <Form onSubmit={handleFormSubmitEvent}>
        <View className="add-label-form-container">
          <View className="add-label-title">{title}</View>
          {formList.map((item, index) => (
            <View key={index} className="add-label-form">
              <FormItem
                id={index}
                text={item.text}
                type={item.type}
                reminder={item.reminder}
                required={item.required}
                disabled={item.disabled}
                activeForm={activeForm}
                setActiveForm={updateActiveForm}
                value={Object.values(formValue).filter((value) => typeof value === 'string')[index]}
                formValue={formValue}
                setFormValue={setFormValue}
                setFormIndex={setSafeFormIndex}
                setIsVisable={setShowFormWindow}
              ></FormItem>
            </View>
          ))}
          <View
            className="add-label-last"
            onClick={() => navigateTo({ url: '/subpackage/addPeopleIndex/index' })}
          >
            申报人身份认证
          </View>
        </View>
        <View className="add-label-floor">
          <View className="add-label-floor-draft" onClick={() => setShowDraftWindow(true)}>
            <Image src={draft} mode="widthFix" style={{ width: '60rpx' }}></Image>
            <View className="add-label-floor-draft-text">存草稿</View>
          </View>
          <View className="add-label-floor-btn">
            <Button formType="submit" {...btn} />
          </View>
        </View>
      </Form>
      {/* 草稿保存modal */}
      <ConfirmModal
        title="是否保存草稿？"
        visible={showDraftWindow}
        onClose={() => setShowDraftWindow(false)}
        onConfirm={() =>
          saveDraft({
            title: title,
            introduce: introduce,
            showImg: showImg,
            labelform: formValue,
          })
        }
        headerClassName="textmid"
      />
      <ActivityModal
        isShowActivityWindow={showPostWindow}
        WindowType="add"
        setShowPostWindow={setShowPostWindow}
      ></ActivityModal>

      {showFormWindow && (
        <FormPicker
          type={typeChoice(showFormIndex)}
          options={formList[showFormIndex].options ?? []}
          isVisiable={showFormWindow}
          showFormIndex={showFormIndex}
          setIsVisiable={setShowFormWindow}
          formValue={formValue}
          setFormValue={setFormValue}
          activeForm={activeForm}
          setActiveForm={updateActiveForm}
        ></FormPicker>
      )}
    </View>
  );
};

export default Index;
