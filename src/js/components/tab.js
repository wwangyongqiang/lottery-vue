import utils from './utils'
import '../../css/tab.scss'

const tab = document.querySelector('#asideTab');
const tabBtns = tab.querySelectorAll('.tab-header a');
const tabContent = tab.querySelector('.tab-content-wrapper');
let activeIndex = 0;
let preActiveIndex = -1;

// tab切换
[].forEach.call(tabBtns, function (item, index) {

  const handleClickFn = function (item, index) {
    return function () {
      // 添加 移除 active 类名
      const classNameLists = utils.classNameToArr(item.className);
      if (classNameLists.includes('active')) {
        return 0;
      }
      preActiveIndex = activeIndex;
      activeIndex = index;
      if (preActiveIndex > -1) {
        utils.removeClass(tabBtns[preActiveIndex], 'active');
      }
      console.log(activeIndex)
      utils.addClass(tabBtns[activeIndex], 'active');
      // 移动 tab-content-wrapper 位置
      tabContent.style.left = `${-160 * activeIndex}px`;
    };
  };

  item.addEventListener('click', handleClickFn(item, index));
  if (index === activeIndex) {
    utils.addClass(item, 'active');
  }
});

// tab 吸顶
document.addEventListener('scroll', function () {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 120) {
    utils.addClass(tab, 'fixed-to-top');
  } else {
    utils.removeClass(tab, 'fixed-to-top');
  }
});


