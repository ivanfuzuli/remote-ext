import SpatialNavigation from '../spatial-navigation.js';
let _ready = false;
const KEYMAPPING = {
    '37': 'left',
    '38': 'up',
    '39': 'right',
    '40': 'down',
    '13': 'enter'
  };

function onKeyDown(evt) {
  const preventDefault = function() {
  evt.preventDefault();
  evt.stopPropagation();
    return false;
  };


  // @TODO only development
  if (evt.key === 'r') {
    window.location = 'http://reload.extensions';
  } 

  const direction = KEYMAPPING[evt.keyCode];
  if (!direction) {
    return;
  }

  SpatialNavigation.move(direction, preventDefault);
}

const init = () => {
  if (!_ready) {
    document.addEventListener('keydown', onKeyDown, true);
    _ready = true;
  }
}

export default {
  init
};