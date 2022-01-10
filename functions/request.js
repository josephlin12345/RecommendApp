import axios from 'axios';

const request = async (endpoint, method, params) => {
  const api_base_url = 'https://recommend--api.herokuapp.com/api/';
  try {
    const res =  await axios({
      url: api_base_url + endpoint,
      method: method,
      params: params
    });
    return res.data;
  } catch(e) { return { error: e } }
}

export default request;