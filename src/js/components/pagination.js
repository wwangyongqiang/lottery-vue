import '../../css/pagination.scss'

class Pagination {
  constructor(el, total, size, fn) {
    this.el = el;
    this.total = total;
    this.size = size;
    this.fn = fn;
    this.count = Math.ceil(this.total / this.size);
    this.currentPage = 0;
    this.pageEle = null;
    this.pageItemEle = null;
    this.prePageEle = null;
    this.nextPageEle = null;
    this.init();
  }
  init() {
    this.createDom();
    this.eventCenter()
    this.updatePage(1);
  }

  createDom() {
    const template = `
      <ul class="last-page">
        <li class="item-pre-page"></li>
      </ul>
      <ul class="page">
      </ul>
      <ul class="next-page">
        <li class="item-next-page"></li>
      </ul>`;

    let boxEle = document.createElement('div');
    boxEle.className = 'pagination-box';
    boxEle.innerHTML = template;

    this.pageEle = boxEle.querySelector('ul.page');
    if (this.count < 7) { // 少于7页
      for (let i = 0; i < this.count; i++) {
        let liEle = document.createElement('li');
        liEle.innerText = i + 1;
        liEle.dataset.index = i;
        if (i === 0) {
          liEle.className = 'item-page current';
        } else {
          liEle.className = 'item-page';
        }
        this.pageEle.appendChild(liEle);
      }
    } else {
      for (let i = 0; i < 7; i++) { // 大于等于7页
        let liEle = document.createElement('li');
        liEle.innerText = i + 1;
        liEle.dataset.index = i;
        if (i === 0) {
          liEle.className = 'item-page current';
        } else {
          liEle.className = 'item-page';
        }
        this.pageEle.appendChild(liEle);
      }
    }
    this.el.innerHTML = '';
    this.el.appendChild(boxEle);
  }

  updatePage(num) {
    if (!this.pageEle) {
      this.pageEle = this.el.querySelector('ul.page');
    }
    if (!this.pageItemEle) {
      this.pageItemEle = Array.from(this.pageEle.querySelectorAll('.item-page'));
    }

    num = Number(num);
    if (this.currentPage === num) {
      return;
    }

    this.currentPage = num;
    // 渲染page

    if (this.count <= 7) {
      let start = 1;
      this.pageItemEle.forEach((item, index) => {
        item.innerText = index + start;
        item.className = 'item-page';
        if (index + 1 === num) {
          item.className = 'item-page current';
        }
      });
    } else {
      if (num <= 4) {
        let start = 1;
        this.pageItemEle.forEach((item, index) => {
          item.innerText = index + start;
          item.className = 'item-page';
          if (index + 1 === num) {
            item.className = 'item-page current';
          }
        });
      } else if (num > 4 && num < this.count - 4 + 1) {
        let start = num - 4 + 1;
        this.pageItemEle.forEach((item, index) => {
          item.innerText = start + index;
          if (index === 3) {
            item.className = 'item-page current';
          } else {
            item.className = 'item-page';
          }
        });
      } else {
        let start = this.count - 7 + 1;
        this.pageItemEle.forEach((item, index) => {
          item.innerText = index + start;
          item.className = 'item-page';
          if (7 - 1 - index === this.count - num) {
            item.className = 'item-page current';
          }
        });
      }
    }

    // 前一页 后一页 样式
    if (!this.prePageEle) {
      this.prePageEle = this.el.querySelector('.item-pre-page');
    }
    if (!this.nextPageEle) {
      this.nextPageEle = this.el.querySelector('.item-next-page');
    }
    if (num === 1) {
      this.prePageEle.className = 'item-pre-page disable';
    } else {
      this.prePageEle.className = 'item-pre-page';
    }
    if (num === this.count) {
      this.nextPageEle.className = 'item-next-page disable';
    } else {
      this.nextPageEle.className = 'item-next-page';
    }

    // 回调函数
    this.fn.call(this, this.currentPage, this.size);
  }

  eventCenter() {
    // const boxEle = this.el.querySelector('.pagination-box');
    this.el.addEventListener('click', event => {
      // 点击页码
      if (/(^|\s)(disable|current)(\s|$)/.test(event.target.className)) {
        return;
      }

      if (event.target.className.includes('item-page')) {
        this.updatePage(event.target.innerText);
      }

      // 点击前一页 后一页
      if (event.target.className.includes('item-pre-page') && this.currentPage > 1) { // 前一页
        this.updatePage(this.currentPage - 1);
      }
      if (event.target.className.includes('item-next-page') && this.currentPage < this.count) { // 后一页
        this.updatePage(this.currentPage + 1);
      }
    });
  }
  reset(total, size) {
    this.total = total;
    this.size = size || this.size;
    this.count = Math.ceil(this.total / this.size);
    this.currentPage = 0;
    this.pageEle = null;
    this.pageItemEle = null;
    this.prePageEle = null;
    this.nextPageEle = null;
  }
  update(total, size) {
    this.reset(total, size);
    this.createDom();
    this.updatePage(1);
  }

}

export default Pagination;