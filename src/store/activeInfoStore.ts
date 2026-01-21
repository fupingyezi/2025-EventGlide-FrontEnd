import { create } from 'zustand';
import { LabelForm } from '@/common/types';

interface activeInfoState {
  title: string;
  introduce: string;
  showImg: string[];
  labelform: LabelForm;
  setBasicInfo: (title: string, description: string, imgUrl: string[]) => void;
  setLabelForm: (labelform: LabelForm) => void;
}

const useActiveInfoStore = create<activeInfoState>((set) => ({
  title: '',
  introduce: '',
  showImg: [],
  labelform: {
    type: '',
    holderType: '',
    startTime: '',
    endTime: '',
    position: '',
    if_register: '',
    activeForm: '111',
    register_method: '',
    signer: [],
  },
  setBasicInfo: (title: string, description: string, imgUrl?: string[]) => {
    set({ title, introduce: description, showImg: imgUrl });
  },
  setLabelForm: (labelform: LabelForm) => {
    set({ labelform });
  },
}));

export default useActiveInfoStore;
