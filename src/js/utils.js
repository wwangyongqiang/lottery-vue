
const w = window,
  d = document;

var obj = {};

/**
 * 类名字符串转换为数组
 * @param {String | Array[string]} className
 * @return {Array[string]}
 */
obj.classNameToArr = function (className) {
  if (!className) return [];
  var classNameArr = [];
  if (typeof className === 'string') {
    className = className.replace(/\s{2,}/g, ' ');
    classNameArr = className.trim().split(' ');
  } else if (className instanceof Array) {
    classNameArr = className.map(function (item) {
      return item.trim();
    });
  } else {
    throw 'utils classNameToArr 方法 className 参数需要是字符串或数组';
  }
  return classNameArr;
};
/**
 * 添加类名
 * @param { DOMElement } target 需要添加类名的DOM
 * @param { string } className 需要添加的类名
 */
obj.addClass = function (target, className) {
  if (!target) throw 'utils addClass 方法需要target参数';
  if (!className) throw 'utils addClass 方法需要className参数';

  var classNameArr = this.classNameToArr(className);
  var oldClassArr = this.classNameToArr(target.getAttribute('class'));

  classNameArr.forEach(function (item) {
    if (oldClassArr.indexOf(item) === -1) {
      oldClassArr.push(item);
    }
  });
  var newClassName = oldClassArr.join(' ');
  target.setAttribute('class', newClassName);
};
/**
 * 移除类名
 * @param { DOMElement } target 
 * @param { String | Array[string] } className 
 */
obj.removeClass = function (target, className) {
  if (!target) throw 'utils addClass 方法需要target参数';
  if (!className) throw 'utils addClass 方法需要className参数';

  // className 转换成 数组
  var classNameArr = this.classNameToArr(className);
  var oldClassArr = this.classNameToArr(target.getAttribute('class'));

  classNameArr.forEach(function (item) {
    oldClassArr = oldClassArr.filter(function (_item) {
      return item !== _item;
    });
  });
  var newClass = oldClassArr.join(' ');
  target.setAttribute('class', newClass);
};

/**
 * 节流函数生成器
 * @param { Function } func 需要被节流的函数
 * @param { Number } wait 函数执行的时间间隔 
 * @return { Function } 包装后的函数
 */
obj.throttle = function (func, wait) {
  if (typeof func !== 'function') throw ('throttle func 参数必须是函数');
  if (!wait) wait = 1000;
  var previous = 0;
  return function () {
    var args = arguments;
    var now = Date.now();
    if (now - previous > wait) {
      func.apply(args[0], [].slice.call(args, 1));
      previous = now;
    }
  };
};

export default obj;

