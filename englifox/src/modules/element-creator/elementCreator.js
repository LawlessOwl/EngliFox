export const elementCreator = (tagName, className, textContent, style) => {
    const element = document.createElement(tagName)
    element.classList.add(className)
    
    if(textContent) {
        element.textContent = textContent
    }

    if (style) {
        Object.entries(style).forEach(([key, value]) => {
          element.style[key] = value;
        });
    }

    return element;
}