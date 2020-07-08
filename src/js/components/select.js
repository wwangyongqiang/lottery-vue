import '../../css/select.scss'
import utils from './utils'

class Select {
  constructor(el, data, fn) {
    this.current = null;
    this.el = el;
    this.fn = fn;
    this.data = data;
    this.currentText = '';
    this.currentValue = '';
  }

  init() {
    this.createDom();
    this.eventCenter();
  }

  createDom() {

    let template = `
          <div class="select-window">
          </div>
          <div class="select-suffix">
            <span class="iconfont icon-bottom-triangle"></span>
          </div>
          <ul class="select-list">
          </ul>`;

    this.el.innerHTML = template;

    let hasCurrent = false;
    let fragment = document.createDocumentFragment();
    this.data.forEach((item, index) => {
      let liEle = document.createElement('li');
      liEle.className = 'select-list-item';
      liEle.dataset.value = item.value;
      liEle.innerText = item.text;
      if (item.current) {
        hasCurrent = true;
        this.setCurrent(item);
      }
      fragment.appendChild(liEle);
    });

    if (!hasCurrent) {
      let firstEle = fragment.querySelector('li.select-list-item');
      this.setCurrent(firstEle);
    }

    this.el.querySelector('.select-list').appendChild(fragment);
  }

  eventCenter() {
    if (!this.el) return 0;
    // 先执行一次回调函数
    this.fn.call(this.current, this.current.dataset.value, this.current.innerText);
    this.el.addEventListener('click', event => {
      // 显示隐藏
      if (this.el.className.includes('active')) {
        utils.removeClass(this.el, 'active');
      } else {
        utils.addClass(this.el, 'active');
      }
      // 改变当前值
      let targetEle = event.target;
      if (targetEle.className.includes('select-list-item') && !targetEle.className.includes('current')) {
        this.setCurrent(targetEle);
        this.fn.call(this.current, this.current.dataset.value, this.current.innerText);
      }
    });
  }

  setCurrent(el) {
    if (this.current) {
      utils.removeClass(this.current, 'current');
    }
    this.current = el;
    utils.addClass(this.current, 'current');
    this.currentText = this.current.innerText;
    this.currentValue = this.current.dataset.value;
    // 改变显示
    this.el.querySelector('.select-window').innerText = this.currentText;
  }
}

export default Select