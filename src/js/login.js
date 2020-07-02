import '../css/login.css'
import '../css/reset.css'
import utils from './utils'

// 公共变量
let phoneErr = false;
let phoneErrMsg = '';
let passErr = false;
let passErrMsg = '';
const BASE_URL = '/api'; // dev http://localhost:4000 prod /api
const setMessage = function (element, msg) {
  if (!element) return 0;
  element.innerText = msg;
};

// 获取cookie 
(function () {
  const cookie = document.cookie; //
  if (cookie) {
    let arr = cookie.split(';');
    arr = arr.map(item => item.split('='));
    let obj = {};
    arr.forEach(item => {
      let key = item[0].trim();
      let value = item[1].trim();
      obj[key] = value;
    });

    if (obj.p) {
      const passEle = document.querySelector('.input-item-pass input');
      passEle.value = window.atob(obj.p);
    }
    if (obj.phone) {
      const phoneEle = document.querySelector('.input-item-phone input');
      phoneEle.value = obj.phone;
    }
  }
})();
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

        if (data.code === 1010) { // 手机号未注册
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
  const passErrEle = document.querySelector('.input-item-pass .input-error-msg span');
  passEle.addEventListener('blur', function () {
    let userpass = this.value;
    let passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,16}$/;
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
})();

// 提交登录
(function () {
  const submitBtnEle = document.querySelector('.btn-login');
  const passErrEle = document.querySelector('.input-item-pass .input-error-msg span');
  submitBtnEle.addEventListener('click', function (event) {
    event.preventDefault();
    if (phoneErr || passErr) { return 0; }
    let userPhone = document.querySelector('.input-item-phone input').value;
    let userPass = document.querySelector('.input-item-pass input').value;
      if (!userPhone || !userPass) { return 0; }
    

    // const userPassHashed = CryptoJS.SHA256(userPass);
    // console.log(userPassHashed);
    axios.post(BASE_URL + '/user/login', {
      phone: userPhone,
      password: userPass,
    })
      .then(res => {
        const data = res.data;
        if (data.code === 1012) { // 密码错误
          console.log(1)
          passErr = true;
          passErrMsg = data.message;
          setMessage(passErrEle, passErrMsg);
        } 
        if (data.code === 1000) {
          window.location.href = 'index.html';
        }
      }).catch(err => {
        console.log(err);
      })
  });
})();
