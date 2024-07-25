
/**
 * @type {any}
*/
let env = {};

if (typeof document !== 'undefined') {
  const envElement = document.getElementById('env');
  env = JSON.parse(envElement.text);
  envElement.remove();
}

export { env }