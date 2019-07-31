import unionBy from 'lodash/unionBy';

function bindIntersectionObservers(bindEntriesGetter) {
  const domItems = document.querySelectorAll('a');
  let filteredEntries = [];

  const interSectionOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  }

  const interSectionCB = (entries) => {
    const mappedEntries = entries.map(entry => {
      const $target = entry.target;
      const isIntersecting = entry.isIntersecting;
      const { top, left, width, height } = entry.boundingClientRect;
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      return {
        top,
        left,
        centerX,
        centerY,
        height,
        width,
        isIntersecting,
        $target
      };
    });

    filteredEntries = unionBy(mappedEntries, filteredEntries, item => item.$target)
                      .filter(item => item.isIntersecting)
                      .map((item, index) => {
                        return {
                          ...item,
                          $index: index
                        }
                      });
  };

  
  const observer = new IntersectionObserver(interSectionCB, interSectionOptions);

  domItems.forEach((link) => {
    observer.observe(link);
  });

  const getFilteredEntries = () => {
    return filteredEntries;
  }

  return { 
    getFilteredEntries,
    observer
  }
}

export default bindIntersectionObservers;