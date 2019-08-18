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
  var preventDefault = function() {
  evt.preventDefault();
  evt.stopPropagation();
    return false;
  };

  var direction = KEYMAPPING[evt.keyCode];

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