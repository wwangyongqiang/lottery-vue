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
          <span class="text-prefix"></span>
          <div class="select">
            <div class="select-window">
            </div>
            <div class="select-suffix">
              <span class="iconfont icon-bottom-triangle"></span>
            </div>
            <ul class="select-list">
            </ul>
          </div>
          <span class="text-suffix"></span>`;

    this.el.innerHTML = template;
    this.el.querySelector('.text-prefix').innerText = this.el.dataset.prefix || '';
    this.el.querySelector('.text-suffix').innerText = this.el.dataset.suffix || '';
    let hasCurrent = false;
    let fragment = document.createDocumentFragment();
    this.data.forEach((item, index) => {
      let liEle = document.createElement('li');
      liEle.className = 'select-list-item';
      const {value, text, ...more} = item;
      liEle.dataset.value = value;
      liEle.innerText = text;
      liEle.dataset.data = JSON.stringify(more);
      if (item.current) {
        hasCurrent = true;
        this.setCurrent(liEle);
      }
      fragment.appendChild(liEle);
    });

    if (!hasCurrent) {
      let firstEle = fragment.querySelector('li.select-list-item');
      this.setCurrent(firstEle);
    }

    this.el.querySelector('.select-list').appendChild(fragment);
    let currentEle = this.el.querySelector('li.current');
    let ulEle = this.el.querySelector('.select-list');
    console.log(ulEle.clientHeight)
  }

  eventCenter() {
    if (!this.el) return 0;
    // 先执行一次回调函数
    const selectEle = this.el.querySelector('.select');
    const ulEle = selectEle.querySelector('.select-list');
    this.fn.call(this.current, this.current.dataset.value, this.current.innerText, this.current);
    selectEle.addEventListener('click', event => {
      // 显示隐藏
      if (selectEle.className.includes('active')) {
        utils.removeClass(selectEle, 'active');
      } else {
        utils.addClass(selectEle, 'active');
      }
      // 调整选中项的位置
      const currentEle = selectEle.querySelector('li.current');
      console.log(currentEle.offsetTop);
      console.log(ulEle.scrollTop);
      console.log(ulEle.clientHeight)
      if (currentEle.offsetTop - ulEle.scrollTop > ulEle.clientHeight) {
        ulEle.scrollTop = currentEle.offsetTop - 50;
      }
      // 改变当前值
      let targetEle = event.target;
      if (targetEle.className.includes('select-list-item') && !targetEle.className.includes('current')) {
        this.setCurrent(targetEle);
        this.fn.call(this.current, this.current.dataset.value, this.current.innerText, this.current);
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

  update(data) {
    this.data = data;
    this.el.innerHTML = '';
    this.createDom();
  }
}

export default Select