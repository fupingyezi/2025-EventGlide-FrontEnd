import post from '../api/post';
const url = '/comment/delete';

const deleteComment = async (
  data: { target_id: string}
) => {
  const res = await post(`${url}`, data);
  return res;
};

export default deleteComment;