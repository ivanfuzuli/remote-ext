import { getRect } from './helpers.js';
import { relative } from 'path';

const VIEWPORT_HEIGHT = window.innerHeight;
const VIEWPORT_PADDING = 100;
const VIEWPORT_HALF_HEIGHT = VIEWPORT_HEIGHT / 2;

let scrollY = 0;
let untilScrollY = 0;
let resolvers = [];

const getScrollY = () => {
  return scrollY;
}

const getDocHeight = () => {
  return document.documentElement.scrollHeight;
}

const getMaximumScroll = () => {
  const docHeight = getDocHeight();
  const max = docHeight - VIEWPORT_HEIGHT;
  return max;
}

const isDirectionUpInViewport = (top) => {
  const scrollY = getScrollY();
  if (top < VIEWPORT_HALF_HEIGHT && scrollY > 0) {
    return false;
  }

  return true;
}

const isDirectionDownInViewport = (top) => {
  const relativeTop = scrollY + top;
  const relativeViewPortHalf = scrollY + VIEWPORT_HALF_HEIGHT;
  const maximumScroll = getMaximumScroll();

  if (relativeViewPortHalf > maximumScroll && scrollY === maximumScroll) {
    return true;
  }

  if (relativeTop >= relativeViewPortHalf) {
    return false;
  };

  return true;
}

const isInViewPort = (top, direction) => {
  if (direction != 'up' && direction != 'down') {
    return true;
  }

  if (direction === 'up') {
    return isDirectionUpInViewport(top);
  }

  return isDirectionDownInViewport(top);
}

const scrollTo = (direction) => {
  const maximumScroll = getMaximumScroll();
  let updatedScrollY = 0;
  if (direction === 'down') {
    updatedScrollY = scrollY + VIEWPORT_HALF_HEIGHT - VIEWPORT_PADDING;
    if (updatedScrollY >= maximumScroll) {
      updatedScrollY = maximumScroll;
    }
  }

  if (direction === 'up') {
    updatedScrollY = scrollY - VIEWPORT_HALF_HEIGHT + VIEWPORT_PADDING;
    if (updatedScrollY < 0) {
      updatedScrollY = 0;
    }
  }

  untilScrollY = Math.ceil(updatedScrollY);
  window.scrollTo({
    top: updatedScrollY,
    behavior: 'smooth'
  });
}

const updateScrollY = (y) => {
  scrollY = y;
  return true;
}

const onScroll = () => {
  const y = window.scrollY;
  if (untilScrollY <= y) {
    updateScrollY(y);
    resolvers.forEach((fn) => {
      fn();
    });

    resolvers = [];
  }
  return y;
}

const scroller = (elem, direction) => {
  const { top } = getRect(elem);
  const promise = new Promise((resolve) => {
    
    if (isInViewPort(top, direction)) {
      resolve();
    } else {
      scrollTo(direction);
      resolvers.push(resolve);
    }
  });

  return promise;
};

window.addEventListener('scroll', onScroll);

export {
  scroller,
  getScrollY
}