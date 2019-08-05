import imgUp from './img/keyboard/up.svg';
import imgDown from './img/keyboard/down.svg';
import imgLeft from './img/keyboard/left.svg';
import imgRight from './img/keyboard/right.svg';
import imgEnter from './img/keyboard/enter.svg';

const createLayout = () => {
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

  window.addEventListener('load', () => {
    document.body.appendChild(container);
  });

  return {
    $indicator,
    arrows: {
      up,
      down,
      left,
      right,
      enter
    }
  }
}

const createLoading = () => {
  const $loading = document.createElement('div');
  const $loadingText = document.createTextNode('Remote Extension: loading...');
  $loading.classList.add('can-loading');
  
  $loading.appendChild($loadingText);
  document.body.appendChild($loading);

  return $loading;
}

export default createLayout;
export {
  createLoading,
  createLayout
};