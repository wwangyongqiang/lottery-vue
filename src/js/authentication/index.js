
import utils from '../components/utils'
import { $getUserInfo, $login } from '../http/user'

class Authentication {
  constructor() {}

  getUserInfoFromLocal() {
    const userInfoFromLocalStorage = localStorage.getItem('userInfo');
    let userinfo = null;
    if (userInfoFromLocalStorage) {
      userinfo = JSON.parse(userInfoFromLocalStorage);
    }
    return userinfo;
  }

  getUserInfoFromServer() {
    const token = localStorage.getItem('token');
    if (!token) { // 没有token
      return null;
    }
    return $getUserInfo();
  }

  save(data) {
    if (data.userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
  }

  clear() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  }

  test() {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      if (!token) { // 没有注册过的
        console.log('no token');
        resolve(false);
      } else {
        const hasValidated = utils.docCookies.getItem('flag');
        if (!hasValidated) { // 留有token但是没有验证过
          console.log('token not validate');
          this.getUserInfoFromServer()
            .then(res => {
              if (res.data.code === 10000) { // token有效
                console.log('token validate success');
                let data = res.data.data;
                this.save(data);
                resolve(true);
              } else if (res.data.code === 20000) { // token过期
                console.log('token validate fail');
                this.clear();
                resolve(false);
              }
            })
            .catch(err => {
              console.log(err);
            })
        } else { // 有token并且验证过
          console.log('token validate')
          resolve(true);
        }
      }
    })
  }

  init () {
    console.log('======console from authentication======')
    this.test()
    .then(result => {
      this.updateViewOfUserInfo();
    })
  }

  // 刷新页面更新用户信息
  updateViewOfUserInfo() {

    let data = this.getUserInfoFromLocal();
    const infoEle = document.querySelector('#userInfo');
    const loginEle = document.querySelector('#login-form');
    const phoneEle = infoEle.querySelector('.user-phone');
    const lvEle = infoEle.querySelector('.user-lv span');
    const roleEle = infoEle.querySelector('.user-role span');

    if (data) {
      loginEle.style.display = 'none';
      infoEle.style.display = 'block';
      phoneEle.innerText = data.phone;
      lvEle.innerText = 'lv' + data.lv;
      roleEle.innerText = data.role === '1' ? '会员' : '注册用户';
    } else {
      loginEle.style.display = 'block';
      infoEle.style.display = 'none';
      phoneEle.innerText = '';
      lvEle.innerText = '';
      roleEle.innerText = '';
    }
  }

  login (data) {
    return $login(data)
    .then(res => {
      if(res.data.code === 1000) {
        this.save(res.data.data);
      }
      return Promise.resolve(res);
    })
  }

  logout () {
    utils.docCookies.removeItem('flag');
    this.clear();
    this.updateViewOfUserInfo();
  }
}

export default new Authentication()
