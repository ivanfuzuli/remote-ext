function bindIntersectionObservers() {
  const allItems = document.querySelectorAll('a');
  let filteredEntries = [];

  const interSectionOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1
  }

  const interSectionCB = (entries) => {
    const willRemove = [];
    entries.forEach((entry) => {
      if (entry.isIntersecting === true) {
        const { top, left, width, height } = entry.boundingClientRect;
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const obj = {
          top,
          left,
          centerX,
          centerY,
          $target: entry.target
        };

        filteredEntries.push(obj);
        } else {
          willRemove.push(entry.target);
        }
    });


    if (willRemove.length > 0) {
      filteredEntries = filteredEntries.filter((entry) => {
        if (entry.target in willRemove) {
          return false;
        }

        return true;
      })
    }
  };

  const observer = new IntersectionObserver(interSectionCB, interSectionOptions);

  allItems.forEach((link) => {
    observer.observe(link);
  });

  return { 
    filteredEntries,
    observer
  }
}

export default bindIntersectionObservers;