import axios from 'axios';
import { API_BASE_URL } from '../constant';

const request = async (endpoint, method, params) => {
  try {
    const res =  await axios({
      url: API_BASE_URL + endpoint,
      method: method,
      params: params
    });
    return res.data;
  } catch(e) { return { error: e } }
}

export default request;