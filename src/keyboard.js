import debounce from 'lodash/debounce';
import head from 'lodash/head';

import createLayout from './layout.js';
import debugPoint from './debug-point.js';

import { initExtendArray, calcDistanceBy } from './helpers.js';

initExtendArray();

const KEYMAPPING = {
  '37': 'left',
  '38': 'up',
  '39': 'right',
  '40': 'down',
  '13': 'enter',
};

const DEBOUNCED = {
  left: false,
  right: false,
  up: false,
  down: false,
  enter: false
};


const calcNextEntryBy = ({activeEntries, currentItem, filterFn, filterFallbackFn}) => {
  let filteredOnlySameRow = activeEntries.filter(filterFn);

  // extend range of items by fallback function
  if (filteredOnlySameRow.length < 1) {
    filteredOnlySameRow = activeEntries.filter(filterFallbackFn);
  }

  const filtered = filteredOnlySameRow.map(item => {
    return {
      ...item,
      distance: calcDistanceBy(currentItem.top, currentItem.left, item.top, item.left)
    }
  });
  const sorted = filtered.sortBy('distance');

  debugPoint(sorted);
return sorted.head();
}

class Keyboard {
  constructor () {
    this.currentItem = null;
    this.getFilteredEntries = null;
    
    this.$container = null;

    const layout = createLayout();
    this.$indicator = layout.$indicator;
    this.bindedElements = layout.arrows;
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
        return calcNextEntryBy({
          activeEntries,
          currentItem,
          filterFn: item => currentItem.left > item.left && currentItem.centerY === item.centerY,
          filterFallbackFn: item => currentItem.centerX > item.centerX
        });
      }

      case 'right': {
        return calcNextEntryBy({
          activeEntries,
          currentItem,
          filterFn: item => currentItem.left < item.left && currentItem.centerY === item.centerY,
          filterFallbackFn: item => currentItem.centerX < item.centerX
        });
      }

      case 'down': {
        return calcNextEntryBy({
          activeEntries,
          currentItem,
          filterFn: item => currentItem.top < item.top && currentItem.centerY === item.centerY,
          filterFallbackFn: item => currentItem.centerY < item.centerY
        });
      }
      
      case 'up': {
        return calcNextEntryBy({
          activeEntries,
          currentItem,
          filterFn: item => currentItem.top > item.top && currentItem.centerY === item.centerY,
          filterFallbackFn: item => currentItem.centerY > item.centerY
        });
      }
    }
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

      if (keyCode in KEYMAPPING) {
        const direction = KEYMAPPING[keyCode];
        this.navigate(direction);

        this.animateArrow(direction);
        evt.preventDefault();
      }
    });

    window.addEventListener('keyup', (evt) => {
      const keyCode = evt.keyCode;

      if (keyCode in KEYMAPPING) {
        const direction = KEYMAPPING[keyCode];
        const cb = this.unAnimateArrow.bind(this, direction);

        if (!DEBOUNCED[direction]){
          DEBOUNCED[direction] = debounce(cb, 500, false);
        }
        DEBOUNCED[direction].call(this);


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
}

export default Keyboard;