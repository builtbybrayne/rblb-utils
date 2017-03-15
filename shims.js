'use strict';
require("es6-promise-peek");


const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Object.keys;

function ok(O, k) {
  return typeof k === 'string' && isEnumerable(O, k);
}


if (!Object.values) {
  Object.values = (O) => reduce(keys(O), (v, k) => concat(v, ok(O,k) ? [O[k]] : []), []);
}
if (!Object.entries) {
  Object.entries = (O) => reduce(keys(O), (e, k) => concat(e, ok(O, k) ? [[k, O[k]]] : []), []);
}
if (!Object.reduce) {
  Object.reduce = (O, fn, initial={}) => reduce(keys(O), (e, k) => ok(O, k) ? fn(e, k, O[k]) : e, initial);
}
if (!Object.map) {
  Object.map = (O, fn) => reduce(keys(O), (e, k) => { if (ok(O, k) ) { e[k] = fn(k, O[k]) } return e; }, {});
}
if (!Object.filter) {
  Object.filter = (O, fn) => reduce(keys(O), (e, k) => { if (ok(O, k) && fn(k, O[k])) { e[k] = O[k]; } return e }, {});
}

if (!Object.prototype.values) {
  Object.defineProperty(Object.prototype, 'values', {
    value: function() {
      if (this === null) {
        throw new TypeError('Object.prototype.values called on null or undefined');
      }
      return Object.values(this);
    }
  })
}

if (!Object.prototype.entries) {
  Object.defineProperty(Object.prototype, 'entries', {
    value: function() {
      if (this === null) {
        throw new TypeError('Object.prototype.entries called on null or undefined');
      }
      return Object.entries(this);
    }
  })
}

if (!Object.prototype.reduce) {
  Object.defineProperty(Object.prototype, 'reduce', {
    value: function(callback, initial={}) {
      if (this === null) {
        throw new TypeError('Object.prototype.reduce called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      return Object.reduce(this, callback, initial);
    }
  })
}

if (!Object.prototype.map) {
  Object.defineProperty(Object.prototype, 'map', {
    value: function(callback) {
      if (this === null) {
        throw new TypeError('Object.prototype.map called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      return Object.map(this, callback);
    }
  })
}

if (!Object.prototype.filter) {
  Object.defineProperty(Object.prototype, 'filter', {
    value: function(callback) {
      if (this === null) {
        throw new TypeError('Object.prototype.filter called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      return Object.filter(this, callback);
    }
  })
}



// Chain promises. Sequentially map the function to the array. `fn` must always return a promise
if (!Array.prototype.seqAsync) {
  Object.defineProperty(Array.prototype, 'seqAsync', {
    value: function(callback) {
      if (this === null) {
        throw new TypeError('Array.prototype.seqAsync called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      return this.reduce((previous, item) => {
        return previous.then(callback(item));
      }, Promise.resolve());
    }
  });
}

// Create an object with the array entries set as the keys
if (!Array.prototype.toObjectKeys) {
  Object.defineProperty(Array.prototype, 'toObjectKeys', {
    value: function() {
      if (this === null) {
        throw new TypeError('Array.prototype.toObjectKeys called on null or undefined');
      }

      return this.reduce((obj, key) => {
        if (typeof key != 'string')
          throw new TypeError(`Array entry is not a string and cannot be used for an object key: ${key}`);

        obj[key] = undefined;
        return obj;
      }, {});
    }
  });
}


// Create new object with only the keys in the canon, but allowing subsequent sources to override those keys.
if (!Object.prototype.pickAndAssign) {
  Object.defineProperty(Object.prototype, 'pickAndAssign', {
    value: function(...sources) {
      if (this === null) {
        throw new TypeError('Object.prototype.pickAndAssign called on null or undefined');
      }
      sources.forEach(source => {
        if (typeof source !== 'object') {
          throw new TypeError(`Source '${source}' is not a function`);
        }
      });

      const keys = Object.keys(this);
      sources = sources.map(s => {
        return Object.keys(s)
          .filter(k => keys.includes(k))
          .reduce((obj, k) => { obj[k] = s[k]; return obj}, {});
      });
      return Object.assign({}, this, ...sources);
    }
  });
}