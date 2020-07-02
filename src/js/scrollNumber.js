import '../css/scrollNumber.scss'

let scrollNumber = {
  numberList: null,
  element: null,
  targetNumber: 0,
};

scrollNumber.init = function (element) {
  this.element = element;
  this.getTargetNumber();
  this.createDom();
  this.getNumberList();
  this.initNumberItem();
};

scrollNumber.createSingleNumberTemplate = function (target = 0, delay = 0) {

  const ele = document.createElement('div');

  ele.className = 'scroll-number-item';
  
  if (isNaN(parseInt(target))) {
    // 传入的是汉字
    ele.className = 'scroll-number-item-unit';
    const template = `
    <ul>
     <li>${target}</li>
    </ul>
    `;
    ele.innerHTML = template;
  } else {
    // 传入的是数字
    const template = `
    <ul>
      <li>0</li>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
      <li>7</li>
      <li>8</li>
      <li>9</li>
      <li data-item="0">0</li>
      <li data-item="1">1</li>
      <li data-item="2">2</li>
      <li data-item="3">3</li>
      <li data-item="4">4</li>
      <li data-item="5">5</li>
      <li data-item="6">6</li>
      <li data-item="7">7</li>
      <li data-item="8">8</li>
      <li data-item="9">9</li>
    </ul>
  `;
    ele.dataset.target = target;
    ele.dataset.delay = delay;
    ele.innerHTML = template;
  }
  return ele;
};

scrollNumber.getNumberList = function () {
  this.numberList = this.element.querySelectorAll('.scroll-number-item');
}

scrollNumber.initNumberItem = function () {
  [].forEach.call(this.numberList, (item, index) => {
    const targetNumber = parseInt(item.dataset.target);
    const targetEle = item.querySelector(`li[data-item="${targetNumber}"]`);
    const delay = item.dataset.delay;
    const ulEle = item.querySelector('ul');
    ulEle.style.transform = `translateY(-${targetEle.offsetTop}px)`;
    ulEle.style.transition = `transform 3s ease-in-out ${delay}s`;
  });
};

scrollNumber.getTargetNumber = function () {
  this.targetNumber = this.element.dataset.target;
};

scrollNumber.getDelay = function (index) {
  if (index <= 1) {
    return index * .3;
  }
  let num = this.getDelay(index - 1) + .3 / Math.sqrt(index);
  num = Number(num.toFixed(2));
  return num;
};

scrollNumber.createDom = function () {
  let numberList = this.targetNumber.toString().split('');
  const fragment = document.createDocumentFragment();
  numberList.forEach((item, index) => {
    const childEle = this.createSingleNumberTemplate(item, this.getDelay(index));
    fragment.appendChild(childEle);
  });
  this.element.appendChild(fragment);
};

export default scrollNumber;