import axios from 'axios';
import { key } from '../key/pixabay-key';

export default class PixabayApiServis {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPixabayApi() {
    const BASE_URL = 'https://pixabay.com/api/';
    const options = {
      params: {
        key: key,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      },
    };

    const response = await axios.get(BASE_URL, options);
    const gatherData = await response.data;

    return gatherData;
  }

  incrementPage() {
    this.page += 1;
  }

  UsePage(go) {
    this.page = go;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
