const Mapper = {
  elements: {

  },
  map: (entries) => {
    const elements = Mapper.elements;
    const lastIndex = elements.length - 1;
    let lastTop = 0;

    entries.map((entry) => {
      if (entry.isIntersecting) {
        const { top, left } = entry.boundingClientRect;
        if (!elements[top]) {
          elements[top] = [];
        } else {
          elements[top].push(entry);
        }
      }
    });

    return elements;
  }
}

export default Mapper;