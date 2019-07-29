import debounce from 'lodash/debounce';
import head from 'lodash/head';

import imgUp from './img/keyboard/up.svg';
import imgDown from './img/keyboard/down.svg';
import imgLeft from './img/keyboard/left.svg';
import imgRight from './img/keyboard/right.svg';
import imgEnter from './img/keyboard/enter.svg';

class Keyboard {
  constructor () {
    this.currentItem = null;
    this.getFilteredEntries = null;
    
    this.$container = null;
    this.$indicator = null;

    this.KEYMAPPING = {
      '37': 'left',
      '38': 'up',
      '39': 'right',
      '40': 'down',
      '13': 'enter',
    };

    this.debounced = {
      left: false,
      right: false,
      up: false,
      down: false,
      enter: false
    };

    this.bindedElements = this.createLayout();
    this.bindPress();
  }

  setCurrentDefault() {
    if (!this.currentItem) {
      const filteredEntries = this.getFilteredEntries();
      this.currentItem = head(filteredEntries);
    }
  }

  focus() {
    const currentItem = this.currentItem;
    const $indicator = this.$indicator;
    const { top, left, width, height} = currentItem;

    const transform = `translate(${left}px, ${top}px)`; 
    $indicator.style.transform = transform; 
    $indicator.style.width = width + 'px';
    $indicator.style.height = height + 'px'; 
  }

  navigate(direction) {
    this.setCurrentDefault();
    const filteredEntries = this.getFilteredEntries();
    let nextItem;
  
    switch (direction) {
      case 'left':
        nextItem = filteredEntries
        .filter((item) => {
          return this.currentItem.centerX > item.centerX;
        })
        .sortBy((item) => {
          return item.left
        })
        .head();
        break;

      case 'right':
        nextItem = filteredEntries
        .filter((item) => {
          return this.currentItem.centerX < item.centerX;
        })
        .sortBy((item) => {
          return item.top
        })
        .head();
        break;
      case 'down':
        break; 
      case 'up':
        break;
    }

    if (!nextItem) return;
    this.currentItem = nextItem;
  
    this.focus();
  }

  bindPress () {
    window.addEventListener('keydown', (evt) => {
      const keyCode = evt.keyCode;

      if (keyCode in this.KEYMAPPING) {
        const direction = this.KEYMAPPING[keyCode];
        this.navigate(direction);

        this.animateArrow(direction);
        evt.preventDefault();
      }
    });

    window.addEventListener('keyup', (evt) => {
      const keyCode = evt.keyCode;

      if (keyCode in this.KEYMAPPING) {
        const direction = this.KEYMAPPING[keyCode];
        const cb = this.unAnimateArrow.bind(this, direction);

        if (!this.debounced[direction]){
          this.debounced[direction] = debounce(cb, 500, false);
        }
        this.debounced[direction].call(this);


        evt.preventDefault();
      }
    });
  }

  unAnimateArrow(direction) {
    const elm = this.bindedElements[direction];
    elm.classList.remove('can-layout__active');
  }
  animateArrow(direction) {
    const elm = this.bindedElements[direction];
    elm.classList.add('can-layout__active');
  }

  createLayout() {
    const $indicator = document.createElement('div');
  
    const container = document.createElement('div');
    const middle = document.createElement('div');

    const left = document.createElement('div');
    const right = document.createElement('div');
    const up = document.createElement('div');
    const down = document.createElement('div');
    const enter = document.createElement('div');

    container.classList.add('can-layout');
    
    up.innerHTML = imgUp;
    down.innerHTML = imgDown;
    left.innerHTML = imgLeft;
    right.innerHTML = imgRight;
    enter.innerHTML = imgEnter;
  
    left.classList.add('can-layout__icon');
    right.classList.add('can-layout__icon');
    up.classList.add('can-layout__icon');
    down.classList.add('can-layout__icon');
    enter.classList.add('can-layout__icon');
  
    middle.classList.add('can-layout__middle');

    $indicator.classList.add('can-selected');

    middle.appendChild(left);
    middle.appendChild(enter);
    middle.appendChild(right);

    container.appendChild(up);
    container.appendChild(middle);
    container.appendChild(down);
    
    document.body.appendChild($indicator);

    this.$indicator = $indicator;

    window.addEventListener('load', () => {
      document.body.appendChild(container);
    });

    return {
      up,
      down,
      left,
      right,
      enter
    }
  }
}

export default Keyboard;