import axios from 'axios';

export default request = async (endpoint, method, params) => {
  const api_base_url = 'https://recommendation--system.herokuapp.com/api/';
  try {
    const res =  await axios({
      url: api_base_url + endpoint,
      method: method,
      params: params
    });
    return res.data;
  } catch(e) { return { 'error': e } }
}