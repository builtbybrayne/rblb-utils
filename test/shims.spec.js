'use strict';
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
require("sinon-as-promised");
chai.use(require('chai-as-promised'));
chai.use(require("sinon-chai"));


require("../shims");



describe('Shims', function(){

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

  it('should map correctly for Object.map(...)', () => {
    const input = {"a":1, "b" : 2};
    const output = {"a":2, "b": 0};
    expect(Object.map(input, (k, v) => (k==="a") ? v*2 : 0)).to.eql(output);
  });

  it('should map correctly for Object.prototype.map(...)', () => {
    const input = {"a": 1, "b": 2};
    const output = {"a": 2, "b": 0};
    expect(input.omap((k, v) => (k==="a") ? v*2 : 0)).to.eql(output);
  });

  it('should map correctly for Object.filter(...)', () => {
    const input = {"a": 1, "b": 2, "c": 3};
    const output = {"a": 1, "b": 2};
    expect(Object.filter(input, (k, v) => k === "a" || v%2 ==0)).to.eql(output);
  });

  it('should map correctly for Object.prototype.filter(...)', () => {
    const input = {"a": 1, "b": 2, "c": 3};
    const output = {"a": 1, "b": 2};
    expect(input.ofilter((k, v) => k === "a" || v%2 ==0)).to.eql(output);
  });

  const reduceFn = (acc, k, v) => {
    acc[k] = v;
    if (v%2 == 0) {
      acc.evens = (acc.evens || 0 ) + 1;
    } else {
      acc.odds = (acc.odds || 0) + 1;
    }
    return acc;
  };

  it('should reduce correctly for Object.reduce(...)', () => {
    const input = {"a":1, "b" : 2};
    const output = {"a": 1, "b": 2, "odds": 1, "evens": 1};
    expect(Object.reduce(input, reduceFn)).to.eql(output);
  });

  it('should reduce correctly for Object.prototype.reduce(...)', () => {
    const input = {"a":1, "b" : 2};
    const output = {"a": 1, "b": 2, "odds": 1, "evens": 1};
    expect(input.oreduce(reduceFn)).to.eql(output);
  });

  it('should reduce correctly with an initial value for Object.reduce(...)', () => {
    const input = {"a":1, "b" : 2};
    const output = {"a": 1, "b": 2, "odds": 1, "evens": 1, "c": 3};
    expect(Object.reduce(input, reduceFn, {"c": 3})).to.eql(output);
  });

  it('should reduce correctly with an initial value for Object.prototype.reduce(...)', () => {
    const input = {"a":1, "b" : 2};
    const output = {"a": 1, "b": 2, "odds": 1, "evens": 1, "c": 3};
    expect(input.oreduce(reduceFn, {"c": 3})).to.eql(output);
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


