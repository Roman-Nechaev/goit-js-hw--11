import axios from 'axios';
import { key } from '../key/pixabay-key';

export async function fetchPixabayApi(searchQuery) {
  const BASE_URL = 'https://pixabay.com/api/';
  const options = {
    params: {
      key: key,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: 1,
      per_page: 10,
    },
  };
  const response = await axios.get(BASE_URL, options);
  const gatherData = await response.data;
  //   console.log(gatherData);
  return gatherData;
}
