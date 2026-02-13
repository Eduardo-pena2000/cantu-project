export function debouncedCallback(fn, time) {
  let timeoutId;
  return function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const context = this;
    const args = arguments;
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, time);
  };
}
