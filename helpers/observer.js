function ObserverHelper() {
  const observer = {};
  const observers = [];
  const notify = function (fn) { fn() };

  observer.observe = function (fn) { observers.push(fn); };
  observer.notifyAll = function () { observers.forEach(notify); };

  return observer;
};

export { ObserverHelper };