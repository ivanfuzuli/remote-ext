import sortBy from 'lodash/sortBy';
import head from 'lodash/head';

export const initExtendArray = () => {
  if (!Array.prototype.sortBy) {
      Array.prototype.sortBy = function (fn) {
        return sortBy(this, fn);
      }
  }

  if (!Array.prototype.head) {
    Array.prototype.head = function (fn) {
      return head(this, fn);
    }
}
}

export const calcDistanceBy = (x1, y1, x2, y2) => {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.sqrt( a * a + b * b );
}


export const getRect = (elem) => {
  var cr = elem.getBoundingClientRect();
  var rect = {
      left: cr.left,
      top: cr.top,
      right: cr.right,
      bottom: cr.bottom,
      width: cr.width,
      height: cr.height
  };
  rect.element = elem;
  rect.center = {
    x: rect.left + Math.floor(rect.width / 2),
    y: rect.top + Math.floor(rect.height / 2)
  };
  rect.center.left = rect.center.right = rect.center.x;
  rect.center.top = rect.center.bottom = rect.center.y;
  return rect;
}