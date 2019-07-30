import debounce from 'lodash/debounce';
import head from 'lodash/head';

import imgUp from './img/keyboard/up.svg';
import imgDown from './img/keyboard/down.svg';
import imgLeft from './img/keyboard/left.svg';
import imgRight from './img/keyboard/right.svg';
import imgEnter from './img/keyboard/enter.svg';
import extendArray from './extend-array.js';

extendArray();

function calcDistance(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.sqrt( a*a + b*b );
}

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

  focus(nextItem) {
    const $indicator = this.$indicator;
    const { top, left, width, height} = nextItem;

    const transform = `translate(${left}px, ${top}px)`; 
    $indicator.style.transform = transform; 
    $indicator.style.width = width + 'px';
    $indicator.style.height = height + 'px'; 
  }

  calcNextItem({filteredEntries, currentItem, direction}) {
    let nextItem;


    switch (direction) {
      case 'left': {
        let filteredOnlySameRow = filteredEntries
          .filter((item) => {
            return currentItem.centerX > item.centerX 
                && currentItem.centerY === item.centerY;
        });

        if (filteredOnlySameRow.length < 1) {
          filteredOnlySameRow = filteredEntries.filter(item => currentItem.centerX > item.centerX);
        }
        
        const filtered = filteredOnlySameRow.map(item => {
          return {
            ...item,
            distance: calcDistance(currentItem.centerX, currentItem.centerY, item.centerX, item.centerY)
          }
        });

        const sorted = filtered
        .sortBy('distance');

        nextItem = sorted.head();
        break;
      }

      case 'right': {
        let filteredOnlySameRow = filteredEntries
          .filter((item) => {
            return currentItem.centerX < item.centerX 
                && currentItem.centerY === item.centerY;
        });

        if (filteredOnlySameRow.length < 1) {
          filteredOnlySameRow = filteredEntries.filter(item => currentItem.centerX < item.centerX);
        }
        
        const filtered = filteredOnlySameRow.map(item => {
          return {
            ...item,
            distance: calcDistance(currentItem.centerX, currentItem.centerY, item.centerX, item.centerY)
          }
        });

        const sorted = filtered
        .sortBy('distance');
        console.log('current', currentItem);
        console.log('sorted', sorted);
        nextItem = sorted.head();
        break;
      }

      case 'down': {
        let filteredOnlySameRow = filteredEntries
          .filter((item) => {
            return currentItem.centerY < item.centerY 
                && currentItem.centerX === item.centerX;
        });

        if (filteredOnlySameRow.length < 1) {
          filteredOnlySameRow = filteredEntries.filter(item => currentItem.centerY < item.centerY);
        }
        
        const filtered = filteredOnlySameRow.map(item => {
          return {
            ...item,
            distance: calcDistance(currentItem.centerX, currentItem.centerY, item.centerX, item.centerY)
          }
        });

        const sorted = filtered
        .sortBy('distance');

        nextItem = sorted.head();
        break;
      }
      
      case 'up': {
        let filteredOnlySameRow = filteredEntries
          .filter((item) => {
            return currentItem.centerY > item.centerY 
                && currentItem.centerX === item.centerX;
        });

        if (filteredOnlySameRow.length < 1) {
          filteredOnlySameRow = filteredEntries.filter(item => currentItem.centerY > item.centerY);
        }
        
        const filtered = filteredOnlySameRow.map(item => {
          return {
            ...item,
            distance: calcDistance(currentItem.centerX, currentItem.centerY, item.centerX, item.centerY)
          }
        });

        const sorted = filtered
        .sortBy('distance');

        nextItem = sorted.head();

        break;
      }
    }

    return nextItem;
  }

  navigate(direction) {
    const $focus = this.focus.bind(this);
    this.setCurrentDefault();
    const currentItem = this.currentItem;
    const filteredEntries = this.getFilteredEntries();

    const nextItem = this.calcNextItem({filteredEntries, direction, currentItem});
    if (!nextItem) return false;

    this.currentItem = nextItem;
    $focus(nextItem);
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