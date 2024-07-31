const domCreateElement = (tag, classname, text = false) => {
  let newEle = document.createElement(tag);
  newEle.setAttribute("class", classname);

  if (text) {
    newEle.innerText = text;
  }
  return newEle;
};
