import sortBy from 'lodash/sortBy';
import head from 'lodash/head';

const extender = () => {
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

export default extender;