import { post } from '../api/request';
const url = '/comment/delete';

const deleteComment = async (data: { target_id: string }) => {
  const res = await post(`${url}`, data);
  return res;
};

export default deleteComment;
