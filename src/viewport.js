const totalHeight = window.innerHeight;
const quarter = totalHeight / 3;
const half = totalHeight / 2;
const viewport = totalHeight - quarter;

let scrollY = 0;
let isScrolling = false;
let afterFn = [];

const isInViewport = (item, direction) => {
  if (direction === 'up' && scrollY > 0) {
    return item.top >= quarter;
  }

  return item.top <= viewport;
}

const getScrollY = () => {
  return scrollY;
}

const onScroll = () => {
  const y = window.scrollY;
  if (y === scrollY && afterFn.length > 0) {
    isScrolling = false;
    afterFn.map(fn => {
      fn();
    });

    afterFn = [];
  }
}

function scrollTo(direction) {
  isScrolling = true;
  if (direction === 'up') {
    scrollY = scrollY - half;
  } else {
    scrollY = scrollY + half;
  }
  
  if (scrollY < 0) {
    scrollY = 0;
  };

  if (scrollY > document.innerHeight) {
    scrollY = document.innerHeight - half;
  };

  window.scrollTo({
    top: scrollY,
    behavior: 'smooth'
  });
}

const afterScroll = (fn) => {
  if (isScrolling) {
    afterFn.push(fn);
  } else {
    fn();
  }
};

window.addEventListener('scroll', onScroll);

export {
  afterScroll,
  isInViewport,
  scrollTo,
  getScrollY
}