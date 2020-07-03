import '../css/login.css'
import '../css/reset.css'
import utils from './utils'
import config from '../../user.config'
const BASE_URL = config.BASE_URL;

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
