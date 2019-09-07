import find from 'lodash/find';
import remove from 'lodash/remove';

class MyIntersectionObserver {
  constructor() {

    this.items = [];
    this.observer = null;
    let options = {
      root: null,
      rootMargin: '10px',
      threshold: 1.0
    }
    
    const cleanOldObservers = (cleaningNS) => {
      if (!cleaningNS) {
        return;
      }

      this.items = this.items.filter(obj => {
        if (cleaningNS === obj.cleaningNS) {
          this.observer.unobserve(obj.target);
          return false;
        }

        return true;
      });
    }

    const callback = (entries) => {

      entries.forEach(entry => {
        const target = entry.target;
        const obj = find(this.items, {target});
        if (!obj) {
          return;
        }

        if (!entry.isIntersecting) {
          obj.onLeave && obj.onLeave.call(this);
          cleanOldObservers(obj.cleaningNS);
        } else {
          obj.onEnter && obj.onEnter.call(this);
        }
      });
    };
    
    this.observer = new IntersectionObserver(callback, options);
  }
  
  observeWithFn({ target, onLeave, onEnter, cleaningNS }) {
    const obj = find(this.items, {target});
    if (obj) {
      return;
    }

    this.observer.observe(target);

    this.items.push({
      target,
      onLeave,
      onEnter,
      cleaningNS
    });
  }
  
  unObserve(target) {
    this.observer.unobserve(target);
    remove(this.items, (item) => item.target === target);
  }
}

export default MyIntersectionObserver;