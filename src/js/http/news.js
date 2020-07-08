import axios from 'axios'
import config from '../../../user.config'


const url = config.NEWS_BASE_URL;

const $news = (page = 1, size = 15) => axios.get(`${url}${page}/${size}`);

export {
  $news
}