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