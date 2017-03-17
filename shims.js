'use strict';
require("es6-promise-peek");


const forEach = Function.bind.call(Function.call, Array.prototype.forEach);
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
if (!Object.oreduce) {
  Object.oreduce = (O, fn, initial={}) => reduce(keys(O), (e, k) => ok(O, k) ? fn(e, k, O[k]) : e, initial);
}
if (!Object.omap) {
  Object.omap = (O, fn) => reduce(keys(O), (e, k) => { if (ok(O, k) ) { e[k] = fn(k, O[k]) } return e; }, {});
}
if (!Object.ofilter) {
  Object.ofilter = (O, fn) => reduce(keys(O), (e, k) => { if (ok(O, k) && fn(k, O[k])) { e[k] = O[k]; } return e }, {});
}
if (!Object.oforEach) {
  Object.oforEach = (O, fn) => forEach(keys(O), (k) => { if (ok(O, k)) { fn(k, O[k]); } });
}

if (!Object.prototype.oforEach) {
  Object.defineProperty(Object.prototype, 'oforEach', {
    value: function(callback) {
      if (this === null) {
        throw new TypeError('Object.prototype.oforEach called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      return Object.oforEach(this, callback);
    }
  })
}

if (!Object.prototype.ovalues) {
  Object.defineProperty(Object.prototype, 'ovalues', {
    value: function() {
      if (this === null) {
        throw new TypeError('Object.prototype.ovalues called on null or undefined');
      }
      return Object.values(this);
    }
  })
}

if (!Object.prototype.oentries) {
  Object.defineProperty(Object.prototype, 'oentries', {
    value: function() {
      if (this === null) {
        throw new TypeError('Object.prototype.oentries called on null or undefined');
      }
      return Object.entries(this);
    }
  })
}

if (!Object.prototype.oreduce) {
  Object.defineProperty(Object.prototype, 'oreduce', {
    value: function(callback, initial={}) {
      if (this === null) {
        throw new TypeError('Object.prototype.oreduce called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      return Object.oreduce(this, callback, initial);
    }
  })
}

if (!Object.prototype.omap) {
  Object.defineProperty(Object.prototype, 'omap', {
    value: function(callback) {
      if (this === null) {
        throw new TypeError('Object.prototype.omap called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      return Object.omap(this, callback);
    }
  })
}

if (!Object.prototype.ofilter) {
  Object.defineProperty(Object.prototype, 'ofilter', {
    value: function(callback) {
      if (this === null) {
        throw new TypeError('Object.prototype.ofilter called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      return Object.ofilter(this, callback);
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