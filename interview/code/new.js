function myNew(fn, ...args) {
    const _this = Object.create(fn.prototype);
    const ret = fn.apply(fn, args);
    const isObject = typeof ret === 'object' && ret !== null;
    const isFunction = typeof ret === 'function';
    return isObject || isFunction ? ret : _this;
}