import axios from 'axios';

const KEY = '35723432-df7b45da1818f873f544fd3bd';
const URL = 'https://pixabay.com/api/';

export default class GalleryApiService {
  constructor() {
    this.name = '';
    this.page = 1;
    this.perPage = 40;
    this.totalPages = 0;
  }

  async getImages() {
    try {
      const response = await axios.get(`${URL}`, {
        params: {
          key: `${KEY}`,
          q: `${this.name}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: `${this.perPage}`,
          page: `${this.page}`,
        },
      });
      this.incrementPage();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get getName() {
    return this.name;
  }
  set setName(newName) {
    this.name = newName;
  }

  set setTotalPages(newTotalPages) {
    this.totalPages = newTotalPages;
  }
}