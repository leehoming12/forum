import React from "react";

/**
 * @type {any}
*/
let resource = {};

if (typeof document !== 'undefined') {
  const elem = document.getElementById('resource');
  resource = JSON.parse(elem.text);
  elem.remove();
}

export const ServerResourceContext = React.createContext(resource);
