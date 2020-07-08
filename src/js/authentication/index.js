
import utils from '../components/utils'
import { $getUserInfo } from '../http/user'

class Authentication {
  constructor() { }

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
    const token = localStorage.getItem('token');
    if (!token) { // 没有注册过的
      return false;
    } else {
      const hasValidated = utils.docCookies.getItem('flag');
      if (!hasValidated) { // 留有token但是没有验证过
        this.getUserInfoFromServer()
          .then(res => {
            if (res.data.code === 10000) { // token有效
              let data = res.data.data;
              this.save(data);
              return true;
            } else if (res.data.code === 20000) { // token过期
              this.clear();
              return false;
            }
          })
          .catch(err => {
            console.log(err);
          })
      } else { // 有token并且验证过
        return true;
      }
    }
  }

  init () {
    this.test();
    this.updateViewOfUserInfo();
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
      console.log(data);
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
    this.save(data);
  }

  logout () {
    utils.docCookies.removeItem('flag');
    this.clear();
    this.updateViewOfUserInfo();
  }
}



export default new Authentication()




// validate Token
// axios.post(config.BASE_URL + '/user/token')
//   .then(res => {
//     console.log('validate token');
//     updateUserInfo();
//   }).catch(err => {
//     console.log('ERROR IN AXIOS TOKEN', err);
//   })

// // 获取用户信息
// function updateUserInfo() {
//   const userPhone = utils.docCookies.getItem('uname');
//   const infoEle = document.querySelector('#userInfo');
//   const loginEle = document.querySelector('#login-form');
//   const phoneEle = infoEle.querySelector('.user-phone')

//   if (userPhone) {
//     loginEle.style.display = 'none';
//     infoEle.style.display = 'block';
//     phoneEle.innerText = (userPhone);
//   } else {
//     loginEle.style.display = 'block';
//     infoEle.style.display = 'none';
//     phoneEle.innerText = '';
//   }
// }

// // 登出
// const logoutBtn = document.querySelector('#logoutBtn');
// logoutBtn.addEventListener('click', () => {
//   axios.get(config.BASE_URL + '/user/logout')
//     .then(res => {
//       updateUserInfo();
//     })
//     .catch(err => {
//       console.log('ERROR IN AXIOS LOGOUT', err)
//     })
// });