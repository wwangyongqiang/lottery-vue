import '../css/dropdown.scss'

class Dropdown {
  constructor (ele) {
    this.ele = ele;
    this.list = ele.querySelector('.dropdown-list');
  }

  init () {}

  toggleVisibility () {
    this.ele.addEventListener('mouseenter', () => {

    });
  }

}

export default Dropdown