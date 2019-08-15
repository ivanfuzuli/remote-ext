import debounce from 'lodash/debounce';
import head from 'lodash/head';

import debugPoints from './debug-points.js';

import { initExtendArray, calcDistanceBy } from './helpers.js';
import { scrollTo, afterScroll, isInViewport, getScrollY } from './viewport.js';

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


class Keyboard {
  constructor () {
    this.currentEntry = null;
    this.getFilteredEntries = null;
    this.recalculateEntriesCoordinates = null;
    this.recalculateEntryCoordinate = null;

    this.$container = null;

    //this.bindPress();

  }


  createLine() {
    const viewportX = window.innerHeight;
    const quarter = (viewportX / 3) * 2;
    const $line = document.querySelector('.can-line') || document.createElement('div');

    $line.style.marginTop = quarter + 'px';
    $line.classList.add('can-line');
    document.body.append($line);
  }

  focus(nextEntry) {
    const $indicator = this.$indicator;
    const { top, left, width, height } = nextEntry;
    const scrollY = getScrollY();

    const transform = `translate(${left}px, ${scrollY + top}px)`;
        
    $indicator.style.transform = transform; 
    $indicator.style.width = width + 'px';
    $indicator.style.height = height + 'px'; 
    $indicator.style.opacity = 1;

    var event = new Event('mouseover');
    const video = document.querySelector('.ytd-player');
    video.dispatchEvent(event);

    this.createLine(nextEntry);
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

  calcNextEntry({activeEntries, currentEntry, direction}) {
    if (!currentEntry) {
      currentEntry = head(activeEntries);
    };

    var distanceFunction = generateDistanceFunction(currentEntry);

    switch (direction) {
      case 'enter': {
        const $target = currentEntry.target;
        const tagName = $target.tagName;

        if (tagName.toLowerCase() === 'input') {
          $target.focus();
        } else {
          $target.click();
          this.unFocus();
        } 

        return false;
      }
      case 'left': {
        return calcNextEntryBy({
          activeEntries,
          currentEntry,
          filterFn: item => {
            return currentEntry.centerX > item.centerX;
          },
          priorities: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.topIsBetter
          ]
        });
      }

      case 'right': {
        return calcNextEntryBy({
          activeEntries,
          currentEntry,
          filterFn: item => {
            return currentEntry.centerX < item.centerX;
          },

          priorityFn: (item) => {
            const min = currentEntry.top;
            const max = currentEntry.top + currentEntry.height;
            
            let priority = 0;

            if (max > item.centerY && min < item.centerY) {
              priority = -1;
            }

            if (currentEntry.centerY === item.centerY) {
              priority = -1;
            }

            return {
                ...item,
                priority
              }
          }
        });
      }

      case 'down': {
        return calcNextEntryBy({
          activeEntries,
          currentEntry,
          filterFn: item => {
            return currentEntry.centerY < item.centerY
          },
          priorityFn: (item) => {
            const currentLeft = currentEntry.left;
            const currentRight = currentEntry.left + currentEntry.width;
            
            let priority = 0;
            if (currentEntry.centerX === item.centerX) {
              priority -= 100;
            }

            if (currentRight > item.centerX && currentLeft < item.centerX) {
               priority -= 10;
            }

            return {
                ...item,
                priority
              }
          }
        });
      }
      
      case 'up': {
        return calcNextEntryBy({
          activeEntries,
          currentEntry,
          filterFn: item => {
            return currentEntry.centerY > item.centerY;
          },
          priorityFn: (item) => {
            const min = currentEntry.left;
            const max = currentEntry.left + currentEntry.width;
            
            let priority = 0;
            if (currentEntry.centerX === item.centerX) {
              priority = -1;
            }
            
            if (max > item.centerX && min < item.centerX) {
              priority = -1;
            }

            return {
                ...item,
                priority
              }
          }
        });
      }
    }
  }

  navigate(direction, secondIteration) {
    if (this.setCurrentDefault()) {
      return;
    };
    const currentEntry = this.currentEntry;
    const filteredEntries = this.getFilteredEntries();
    const { activeEntries } = filteredEntries;

    const nextEntry = this.calcNextEntry({activeEntries, direction, currentEntry});

    if (!nextEntry) {
      return;
    }
  
    if(!isInViewport(nextEntry, direction) && !secondIteration) {
      scrollTo(direction);
      afterScroll(() => {
        this.recalculateEntriesCoordinates();
        this.currentEntry = this.recalculateEntryCoordinate(this.currentEntry);
        return this.navigate(direction, true);
      });
      
      return;
    }

    this.currentEntry = nextEntry;
    this.focus(nextEntry);
  }

  bindPress () {
    document.body.addEventListener('keydown', (evt) => {
      const keyCode = evt.keyCode;

      if (keyCode in KEYMAPPING) {
        const direction = KEYMAPPING[keyCode];
        this.navigate(direction);

        this.animateArrow(direction);
        evt.stopPropagation();
        evt.preventDefault();
      }
    });

    document.addEventListener('keyup', (evt) => {
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

}

export default Keyboard;