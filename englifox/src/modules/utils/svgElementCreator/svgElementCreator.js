const svgNameSpace = "http://www.w3.org/2000/svg";

export const svgElementCreator = (type, attributes = {}) => {
  const element = document.createElementNS(svgNameSpace, type);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
};
