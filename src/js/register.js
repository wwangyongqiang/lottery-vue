import '../css/login.css'
import '../css/reset.css'
import utils from './components/utils'
import config from '../../user.config'
import axios from 'axios'
const BASE_URL = config.BASE_URL;
import { $register } from './http/user'
import { $checkPhone } from './http/user'
import authentication from './authentication'


let main = {};

main.initDom = function () {
  this.phoneErr = false;
  this.phoneErrMsg = '';
  this.passErr = false;
  this.passErrMsg = '';
  this.passRepeatErr = false;
  this.passRepeatErrMsg = '';

  this.phoneInputEle = document.querySelector('.input-item-phone input');
  this.phoneErrEle = document.querySelector('.input-item-phone .input-error-msg span');
  this.passInputEle = document.querySelector('.input-item-pass input');
  this.passVisibleBtn = document.querySelector('.input-item-pass .suffix-item');
  this.iconEle = this.passVisibleBtn.querySelector('i');
  this.passRepeatInputEle = document.querySelector('.input-item-passrepeat input');
  this.passErrEle = document.querySelector('.input-item-pass .input-error-msg span');
  this.passRepeatErrEle = document.querySelector('.input-item-passrepeat .input-error-msg span');
  this.submitBtnEle = document.querySelector('.btn-login');
};

main.setMessage = (ele, text) => {
  if (!ele) return 0;
  ele.innerText = text;
}

// 验证手机
main.validatePhone = function () {

  this.phoneInputEle.addEventListener('focus', () => {
    this.phoneErr = false;
    this.phoneErrMsg = '';
    this.setMessage(this.phoneErrEle, this.phoneErrMsg);
  });

  this.phoneInputEle.addEventListener('blur', () => {
    let userPphone = this.phoneInputEle.value;
    const phoneReg = /^1[34578][0-9]{9}$/;
    // 本地格式验证
    if (!phoneReg.test(userPphone)) {
      this.phoneErr = true;
      this.phoneErrMsg = '手机号格式错误，请重新填写!';
      this.setMessage(this.phoneErrEle, this.phoneErrMsg);
      return 0;
    }
    // 远程验证
    $checkPhone({phone: userPphone})
      .then(res => {
        const data = res.data;
        if (data.code === 1011) {
          this.phoneErr = true;
          this.phoneErrMsg = data.message;
          this.setMessage(this.phoneErrEle, this.phoneErrMsg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
};

// 密码可见
main.togglePassVisibility = function () {

  this.passVisibleBtn.addEventListener('click', () => {

    let type = this.passInputEle.getAttribute('type');
    if (type === 'text') {
      this.passInputEle.setAttribute('type', 'password');
      utils.removeClass(this.iconEle, 'icon-pass-visible');
      utils.addClass(this.iconEle, 'icon-pass');
    } else {
      this.passInputEle.setAttribute('type', 'text');
      utils.removeClass(this.iconEle, 'icon-pass');
      utils.addClass(this.iconEle, 'icon-pass-visible');
    }
  });
};

// 本地验证密码格式
main.validatePass = function () {

  let userpass = '';
  let userpassRepeat = '';

  this.passInputEle.addEventListener('focus', () => {
    this.passErr = false;
    this.passErrMsg = '';
    this.setMessage(this.passErrEle, this.passErrMsg);
  });
  this.passInputEle.addEventListener('blur', () => {
    userpass = this.passInputEle.value;
    let passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,16}$/;
    if (!passReg.test(userpass)) {
      this.passErr = true;
      this.passErrMsg = '密码应为8到16位数字字母组合';
      this.setMessage(this.passErrEle, this.passErrMsg);
    }
  });

  this.passRepeatInputEle.addEventListener('blur',  () => {
    userpassRepeat = this.passRepeatInputEle.value;
    if (userpassRepeat !== userpass) {
      this.passRepeatErr = true;
      this.passRepeatErrMsg = '两次密码不相符';
      this.setMessage(this.passRepeatErrEle, this.passRepeatErrMsg);
    }
  });
  this.passRepeatInputEle.addEventListener('focus', () => {
    this.passRepeatErr = false;
    this.passRepeatErrMsg = '';
    this.setMessage(this.passRepeatErrEle, this.passRepeatErrMsg);
  });
};

main.submit = function () {
  
  this.submitBtnEle.addEventListener('click', event => {
    event.preventDefault();
    let userPhone = this.phoneInputEle.value;
    let userPass = this.passInputEle.value;
    let userPassRepeat = this.passRepeatInputEle.value;
    if (!userPhone || !userPass || !userPassRepeat) { return 0; }
    if (this.phoneErr || this.passErr || this.passRepeatErr) { return 0; }
    
    $register({
      phone: userPhone,
      password: userPass,
    })
      .then(res => {
        const data = res.data;
        if (data.code === 1001) {
          authentication.login(data.data);
          window.location.href = '/index.html';
        }
      }).catch(err => {
        console.log(err);
      })
  });
};

main.init = function () {
  this.initDom();
  this.validatePhone();
  this.validatePass();
  this.togglePassVisibility();
  this.submit();
};

main.test = function () {
  // 是否已经登录
    const isLogin = authentication.test();
    if (isLogin) {
      window.location.href = '/index.html';
    }
};

main.init();

/*
// 密码可见
(function changePassVisibility() {
  const passVisibleBtn = document.querySelector('.input-item-pass .suffix-item');
  if (!passVisibleBtn) { return 0; }
  if (!utils.addClass || !utils.removeClass) { return 0; }

  passVisibleBtn.addEventListener('click', function () {
    const inputEle = this.previousElementSibling;
    const iconEle = this.querySelector('i');
    let type = inputEle.getAttribute('type');
    if (type === 'text') {
      inputEle.setAttribute('type', 'password');
      utils.removeClass(iconEle, 'icon-pass-visible');
      utils.addClass(iconEle, 'icon-pass');
    } else {
      inputEle.setAttribute('type', 'text');
      utils.removeClass(iconEle, 'icon-pass');
      utils.addClass(iconEle, 'icon-pass-visible');
    }
  });
})();

let phoneErr = false;
let phoneErrMsg = '';
let passErr = false;
let passErrMsg = '';
let passRepeatErr = false;
let passRepeatErrMsg = '';
const setMessage = function (element, msg) {
  if (!element) return 0;
  element.innerText = msg;
};
// 验证手机号
(function () {
  const ele = document.querySelector('.input-item-phone input');
  const errEle = document.querySelector('.input-item-phone .input-error-msg span');
  ele.addEventListener('blur', function () {
    let userPphone = this.value;
    const phoneReg = /^1[34578][0-9]{9}$/;
    // 本地格式验证
    if (!phoneReg.test(userPphone)) {
      phoneErr = true;
      phoneErrMsg = '手机号格式错误，请重新填写!';
      setMessage(errEle, phoneErrMsg);
      return 0;
    } else {
      phoneErr = false;
      phoneErrMsg = '';
      setMessage(errEle, phoneErrMsg);
    }
    // 远程验证
    axios.get(BASE_URL + '/user', {
      params: {
        phone: userPphone
      }
    })
      .then(res => {
        const data = res.data;
        if (data.code === 1011) {
          phoneErr = true;
          phoneErrMsg = data.message;
          setMessage(errEle, phoneErrMsg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
})();

// 本地验证密码格式
(function () {
  const passEle = document.querySelector('.input-item-pass input');
  const passRepeatEle = document.querySelector('.input-item-passrepeat input');
  const passErrEle = document.querySelector('.input-item-pass .input-error-msg span');
  const passRepeatErrEle = document.querySelector('.input-item-passrepeat .input-error-msg span');
  let userpass = '';
  let userpassRepeat = '';
  console.log(1)
  passEle.addEventListener('blur', function () {
    userpass = this.value;
    let passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,16}$/;
    console.log(setMessage)
    if (!passReg.test(userpass)) {
      passErr = true;
      passErrMsg = '密码应为8到16位数字字母组合';
      setMessage(passErrEle, passErrMsg);
    } else {
      passErr = false;
      passErrMsg = '';
      setMessage(passErrEle, passErrMsg);
    }
  });
  passRepeatEle.addEventListener('blur', function () {
    userpassRepeat = this.value;
    console.log(111)
    if (userpassRepeat !== userpass) {
      console.log(1)
      passRepeatErr = true;
      passRepeatErrMsg = '两次密码不相符';
      console.log(passRepeatEle)
      setMessage(passRepeatErrEle, passRepeatErrMsg);
    } else {
      passRepeatErr = false;
      passRepeatErrMsg = '';
      setMessage(passRepeatErrEle, passRepeatErrMsg);
    }
  });
})();

// 提交注册
(function () {
  const submitBtnEle = document.querySelector('.btn-login');
  submitBtnEle.addEventListener('click', function (event) {
    event.preventDefault();
    if (phoneErr || passErr || passRepeatErr) { return 0; }
    let userPhone = document.querySelector('.input-item-phone input').value;
    let userPass = document.querySelector('.input-item-pass input').value;
    let userPassRepeat = document.querySelector('.input-item-passrepeat input').value;
    if (!userPhone || !userPass || !userPassRepeat) { return 0; }

    axios.post(BASE_URL + '/user/register', {
      phone: userPhone,
      password: userPass,
    })
      .then(res => {
        const data = res.data;
        if (data.code === 1001) {
          window.location.href = '/html/login.html';
        }
      }).catch(err => {
        console.log(err);
      })
  });
})();
*/
