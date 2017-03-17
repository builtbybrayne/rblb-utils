'use strict';
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
require("sinon-as-promised");
chai.use(require('chai-as-promised'));
chai.use(require("sinon-chai"));

require("../shims");

const reduceFn = (acc, k, v) => {
  acc[k] = v;
  if (v%2 == 0) {
    acc.evens = (acc.evens || 0 ) + 1;
  } else {
    acc.odds = (acc.odds || 0) + 1;
  }
  return acc;
};


describe('Shims', function(){

  describe('Function.isFunction', () => {
    it('should return true for functions', () => {
      expect(Function.isFunction(()=>{})).to.be.true;
    });
    it('should return false for non-functions', () => {
      expect(Function.isFunction(null)).to.be.false;
      expect(Function.isFunction(undefined)).to.be.false;
      expect(Function.isFunction(0)).to.be.false;
      expect(Function.isFunction(1)).to.be.false;
      expect(Function.isFunction('')).to.be.false;
      expect(Function.isFunction({})).to.be.false;
      expect(Function.isFunction(true)).to.be.false;
      expect(Function.isFunction(false)).to.be.false;
      expect(Function.isFunction(NaN)).to.be.false;
      expect(Function.isFunction([])).to.be.false;
    })
  });

  describe('Object.entries()', () => {
    it('should return an array of entries from Object.entries()', () => {
      const input = {"a":1, "b" : 2};
      const output = [["a", 1], ["b", 2]];
      expect(Object.entries(input)).to.eql(output);
    });

    it('should return an array of entries from Object.prototype.entries()', () => {
      const input = {"a":1, "b" : 2};
      const output = [["a", 1], ["b", 2]];
      expect(input.oentries()).to.eql(output);
    });
  });

  describe('Object.values()', () => {
    it('should return an array of values from Object.values', () => {
      const input = {"a":1, "b" : 2};
      const output = [1, 2];
      expect(Object.values(input)).to.eql(output);
    });

    it('should return an array of values from Object.prototype.values', () => {
      const input = {"a":1, "b" : 2};
      const output = [1, 2];
      expect(input.ovalues()).to.eql(output);
    });
  });

  describe('Object.oforEach()', () => {
    it('should correctly apply Object.oforEach', () => {
      const input = {"a":1, "b" : 2};
      const output = {};
      Object.oforEach(input, (k, v) => output[k] = v);
      expect(output).to.eql(input);
    });

    it('should correctly apply Object.prototype.oforEach', () => {
      const input = {"a":1, "b" : 2};
      const output = {};
      input.oforEach((k, v) => output[k] = v);
      expect(input).to.eql(output);
    });
  });


  describe('Object.omap()', () => {
    it('should map correctly for Object.omap(...)', () => {
      const input = {"a":1, "b" : 2};
      const output = {"a":2, "b": 0};
      expect(Object.omap(input, (k, v) => (k==="a") ? v*2 : 0)).to.eql(output);
    });

    it('should map correctly for Object.prototype.omap(...)', () => {
      const input = {"a": 1, "b": 2};
      const output = {"a": 2, "b": 0};
      expect(input.omap((k, v) => (k==="a") ? v*2 : 0)).to.eql(output);
    });
  });

  describe('Object.ofilter()', () => {
    it('should map correctly for Object.ofilter(...)', () => {
      const input = {"a": 1, "b": 2, "c": 3};
      const output = {"a": 1, "b": 2};
      expect(Object.ofilter(input, (k, v) => k === "a" || v%2 ==0)).to.eql(output);
    });

    it('should map correctly for Object.prototype.ofilter(...)', () => {
      const input = {"a": 1, "b": 2, "c": 3};
      const output = {"a": 1, "b": 2};
      expect(input.ofilter((k, v) => k === "a" || v%2 ==0)).to.eql(output);
    });
  });

  describe('Object.oreduce', () => {
    it('should reduce correctly for Object.oreduce(...)', () => {
      const input = {"a":1, "b" : 2};
      const output = {"a": 1, "b": 2, "odds": 1, "evens": 1};
      expect(Object.oreduce(input, reduceFn)).to.eql(output);
    });

    it('should reduce correctly for Object.prototype.oreduce(...)', () => {
      const input = {"a":1, "b" : 2};
      const output = {"a": 1, "b": 2, "odds": 1, "evens": 1};
      expect(input.oreduce(reduceFn)).to.eql(output);
    });

    it('should reduce correctly with an initial value for Object.oreduce(...)', () => {
      const input = {"a":1, "b" : 2};
      const output = {"a": 1, "b": 2, "odds": 1, "evens": 1, "c": 3};
      expect(Object.oreduce(input, reduceFn, {"c": 3})).to.eql(output);
    });

    it('should reduce correctly with an initial value for Object.prototype.oreduce(...)', () => {
      const input = {"a":1, "b" : 2};
      const output = {"a": 1, "b": 2, "odds": 1, "evens": 1, "c": 3};
      expect(input.oreduce(reduceFn, {"c": 3})).to.eql(output);
    });
  });


  it('should sequentially map the function to an array via Promise.seqAsync', () => {
    let collector = [];
    const func = (x) => collector.push(x);
    const input = ["a", "b", "c"];
    const output =["a", "b", "c"];

    return input.seqAsync(func)
      .then(() => {
        expect(collector).to.eql(output);
      });
  });

  it("should create a new object with keys from an array", () => {
      const input = ["a", "b", "c"];
      const output = {"a":undefined, "b":undefined, "c":undefined};
      expect(input.toObjectKeys()).to.eql(output);
  });

  it("should return an object with only the keys of the original, but overridden any keys in the subsequent sources", () => {
    const canon = {"a": 1, "b": 2};
    const source1 = {"a": "nope"};
    const source2 = {"c": "nope"}
    const source3 = {"a": "yes", "b": "also", "c": "nope"};
    const output = {"a": "yes", "b": "also"};
    expect(canon.pickAndAssign(source1, source2, source3)).to.eql(output);
  });
});


