import unionBy from 'lodash/unionBy';

function bindIntersectionObservers() {
  const domItems = document.querySelectorAll('a');
  let activeEntries = [];
  let passiveEntries = [];

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
      const isVisible = $target.offsetParent;

      return {
        top,
        left,
        centerX,
        centerY,
        height,
        width,
        isIntersecting,
        $target,
        isVisible
      };
    });

    const unionEntries = unionBy(mappedEntries, activeEntries, item => item.$target);
    activeEntries = unionEntries
                      .filter(item => item.isIntersecting && item.isVisible);
    
    passiveEntries = unionEntries
                        .filter(item => item.isIntersecting === false && !item.isVisible);
  };

  
  const observer = new IntersectionObserver(interSectionCB, interSectionOptions);

  domItems.forEach((link) => {
    observer.observe(link);
  });

  const getFilteredEntries = () => {
    return {
      activeEntries,
      passiveEntries
    };
  }

  return { 
    getFilteredEntries,
    observer
  }
}

export default bindIntersectionObservers;