import debounce from 'lodash/debounce';
import head from 'lodash/head';
import find from 'lodash/find';

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
      const { activeEntries } = this.getFilteredEntries();
      this.currentItem = head(activeEntries);
      this.focus(this.currentItem);

      return true;
    }

    return false;
  }

  focus(nextItem) {
    const $indicator = this.$indicator;
    const { top, left, width, height} = nextItem;

    const transform = `translate(${left}px, ${top}px)`; 
    $indicator.style.transform = transform; 
    $indicator.style.width = width + 'px';
    $indicator.style.height = height + 'px'; 
    $indicator.style.opacity = 1;
  }

  unFocus() {
    const reset =  {
      top: 0,
      left: 0,
      transform: 'inherit',
      width: 0,
      height: 0,
      opacity: 0        
    };

    this.focus(reset);
  }

  calcNextItem({activeEntries, currentItem, direction}) {
    let nextItem;

    if (!currentItem) {
      currentItem = head(activeEntries);
    }

    switch (direction) {
      case 'enter': {
        currentItem.$target.click();
        this.unFocus();
        return false;
      }
      case 'left': {
        let filteredOnlySameRow = activeEntries
          .filter((item) => {
            return currentItem.left > item.left 
                && currentItem.top === item.top;
        });

        if (filteredOnlySameRow.length < 1) {
          filteredOnlySameRow = activeEntries.filter(item => currentItem.left > item.left);
        }
        
        const filtered = filteredOnlySameRow.map(item => {
          return {
            ...item,
            distance: calcDistance(currentItem.top, currentItem.left, item.top, item.left)
          }
        });

        const sorted = filtered
        .sortBy('distance');

        nextItem = sorted.head();
        break;
      }

      case 'right': {
        let filteredOnlySameRow = activeEntries
          .filter((item) => {
            return currentItem.left < item.left 
                && currentItem.top === item.top;
        });

        if (filteredOnlySameRow.length < 1) {
          filteredOnlySameRow = activeEntries.filter(item => currentItem.left < item.left);
        }
        
        const filtered = filteredOnlySameRow.map(item => {
          return {
            ...item,
            distance: calcDistance(currentItem.left, currentItem.top, item.left, item.top)
          }
        });

        const sorted = filtered
        .sortBy('distance');
        nextItem = sorted.head();
        break;
      }

      case 'down': {
        let filteredOnlySameRow = activeEntries
          .filter((item) => {
            return currentItem.top < item.top 
                && currentItem.top === item.top;
        });

        if (filteredOnlySameRow.length < 1) {
          filteredOnlySameRow = activeEntries.filter(item => currentItem.top < item.top);
        }
        
        const filtered = filteredOnlySameRow.map(item => {
          return {
            ...item,
            distance: calcDistance(currentItem.left, currentItem.top, item.left, item.top)
          }
        });

        const sorted = filtered
        .sortBy('distance');

        nextItem = sorted.head();
        break;
      }
      
      case 'up': {
        let filteredOnlySameRow = activeEntries
          .filter((item) => {
            return currentItem.top > item.top 
                && currentItem.left === item.left;
        });

        if (filteredOnlySameRow.length < 1) {
          filteredOnlySameRow = activeEntries.filter(item => currentItem.top > item.top);
        }
        
        const filtered = filteredOnlySameRow.map(item => {
          return {
            ...item,
            distance: calcDistance(currentItem.left, currentItem.top, item.left, item.top)
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
    const focus = this.focus.bind(this);
    if (this.setCurrentDefault()) {
      return;
    };
    const currentItem = this.currentItem;
    const filteredEntries = this.getFilteredEntries();
    const { activeEntries, passiveEntries } = filteredEntries;

    const nextItem = this.calcNextItem({activeEntries, direction, currentItem});

    if (!nextItem) return;

    this.currentItem = nextItem;
    window.requestAnimationFrame(() => {
      focus(nextItem);
    });
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