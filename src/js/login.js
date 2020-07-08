import '../css/login.css'
import '../css/reset.css'
import utils from './components/utils'
import config from '../../user.config'
import axios from 'axios'
import authentication from './authentication'
import { $checkPhone, $login } from './http/user'

class Main {
  constructor() {
    this.phoneErr = false;
    this.phoneErrMsg = '';
    this.passErr = false;
    this.passErrMsg = '';
    this.BASE_URL = config.BASE_URL; // dev http://localhost:4000 prod /api
    this.phoneInputEle = document.querySelector('.input-item-phone input');
    this.passInputEle = document.querySelector('.input-item-pass input');
    this.passVisibleBtn = document.querySelector('.input-item-pass .suffix-item');
    this.submitBtnEle = document.querySelector('.btn-login');
  }

  init() {
    this.test();
    this.initPassValidate();
    this.initPassVisibility();
    this.initPhoneValidate();
    this.initSubmit();
  }

  setMessage(element, msg) {
    if (!element) return 0;
    element.innerText = msg;
  }

  initPassVisibility() {

    this.passVisibleBtn.addEventListener('click', () => {
      const iconEle = this.passVisibleBtn.querySelector('i'); // 图标icon
      let type = this.passInputEle.getAttribute('type');
      if (type === 'text') {
        this.passInputEle.setAttribute('type', 'password');
        utils.removeClass(iconEle, 'icon-pass-visible');
        utils.addClass(iconEle, 'icon-pass');
      } else {
        this.passInputEle.setAttribute('type', 'text');
        utils.removeClass(iconEle, 'icon-pass');
        utils.addClass(iconEle, 'icon-pass-visible');
      }
    });
  }

  initPhoneValidate() {
    const errEle = document.querySelector('.input-item-phone .input-error-msg span');

    // focus
    this.phoneInputEle.addEventListener('focus', () => {
      this.phoneErr = false;
      this.phoneErrMsg = '';
      this.setMessage(errEle, this.phoneErrMsg);
    });

    // blur
    this.phoneInputEle.addEventListener('blur', () => {
      let userPhone = this.phoneInputEle.value;
      const phoneReg = /^1[34578][0-9]{9}$/;
      // 本地格式验证
      if (!phoneReg.test(userPhone)) {
        this.phoneErr = true;
        this.phoneErrMsg = '手机号格式错误，请重新填写!';
        this.setMessage(errEle, this.phoneErrMsg);
        return 0;
      }

      // 远程验证
      $checkPhone({
        phone: userPhone
      })
        .then(res => {
          const data = res.data;
          if (data.code === 1010) { // 手机号未注册
            this.phoneErr = true;
            this.phoneErrMsg = data.message;
            this.setMessage(errEle, this.phoneErrMsg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  initPassValidate() {

    const passErrEle = document.querySelector('.input-item-pass .input-error-msg span');

    // blur
    this.passInputEle.addEventListener('blur', () => {
      let userpass = this.passInputEle.value;
      let passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,16}$/;
      if (!passReg.test(userpass)) {
        this.passErr = true;
        this.passErrMsg = '密码应为8到16位数字字母组合';
        this.setMessage(passErrEle, this.passErrMsg);
      }
    });

    // focus
    this.passInputEle.addEventListener('focus', () => {
      this.passErr = false;
      this.passErrMsg = '';
      this.setMessage(passErrEle, this.passErrMsg);
    });
  }

  initSubmit() {

    const passErrEle = document.querySelector('.input-item-pass .input-error-msg span');

    this.submitBtnEle.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.phoneErr || this.passErr) { return 0; }
      let userPhone = this.phoneInputEle.value;
      let userPass = this.passInputEle.value;
      if (!userPhone || !userPass) { return 0; }


      // const userPassHashed = CryptoJS.SHA256(userPass);
      // console.log(userPassHashed);
      $login({
        phone: userPhone,
        password: userPass,
      })
        .then(res => {
          const data = res.data;
          if (data.code === 1012) { // 密码错误
            this.passErr = true;
            this.passErrMsg = data.message;
            this.setMessage(passErrEle, this.passErrMsg);
          }
          if (data.code === 1000) {
            authentication.login(data.data);
            let fromUrl = document.referrer;
            fromUrl = fromUrl || '/index.html';
            if (fromUrl.includes('login.html')) {
              fromUrl = '/index.html';
            }
            window.location.href = fromUrl;
          }
        }).catch(err => {
          console.log(err);
        })
    });
  }

  // 是否已经登录
  test () {
    const isLogin = authentication.test();
    if (isLogin) {
      window.location.href = '/index.html';
    }
  }
};

const main = new Main();
main.init();