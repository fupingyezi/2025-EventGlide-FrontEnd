import { post } from '../api/request';
const preUrl = '/interaction/';

const handleInteraction = async (
  url: string,
  data: { studentid: string; subject: string; targetid: string; receiver: string }
) => {
  console.log(data);
  const res = await post(`${preUrl}${url}`, data);
  return res;
};

export default handleInteraction;
