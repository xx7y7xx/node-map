// @ts-nocheck

const logger =
  (name) =>
  (...args) => {
    console.debug('[NM]', name, ...args);
  };

export default logger;
