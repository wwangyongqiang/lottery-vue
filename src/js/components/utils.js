
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
  try {
    if (typeof className === 'string') {
      className = className.replace(/\s{2,}/g, ' ');
      classNameArr = className.trim().split(' ');
    } else if (className instanceof Array) {
      classNameArr = className.map(function (item) {
        return item.trim();
      });
    } else {
      throw new TypeError('utils classNameToArr 方法 className 参数需要是字符串或数组');
    }
  } catch (err) {
    console.error(err);
  }

  return classNameArr;
};
/**
 * 添加类名
 * @param { DOMElement } target 需要添加类名的DOM
 * @param { string } className 需要添加的类名
 */
obj.addClass = function (target, className) {
  try {
    if (!target) throw new TypeError('utils addClass target参数不能为空');
    if (!className) throw new TypeError('utils addClass classname参数不能为空');
  } catch (err) {
    console.error(err);
  }

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
  try {
    if (!target) throw new TypeError('utils removeClass target参数不能为空');
    if (!className) throw new TypeError('utils removeClass classname参数不能为空');
  } catch (err) {
    console.error(err);
  }

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
  try {
    if (typeof func !== 'function') throw new TypeError('throttle func 参数必须是函数');
  } catch (err) {
    console.error(err);
  }
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

obj.docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

obj.formatMoney = function (value) {
  let str = '';
  try {
    if ((typeof value).toLowerCase() === 'number') {
      str = value.toFixed(0);
    } else if ((typeof value).toLowerCase() === 'string' && !isNaN(Number(value))) {
      str = Number(value).toFixed(0);
    } else {
      throw new TypeError('Utils formatMoney 参数必须是 string|number');
    }
  } catch (err) {
    console.error(err);
  }

  if (value.length < 5) {
    return `${value}元`
  }
  let part1 = str.slice(-4);
  let part2 = str.slice(-8, -4);
  let part3 = str.slice(0, -8);
  function format(str) {
    return str.replace(/^0*/, '');
  }
  part1 = format(part1);
  part2 = format(part2);
  part3 = format(part3);
  let result = '';

  if (part3) {
    result = `${part3}亿`;
  }
  if (part2) {
    result = `${result}${part2}万`;
  }
  result = `${result}${part1}元`;

  return result.replace(/^0*/, '');
}

export default obj;

