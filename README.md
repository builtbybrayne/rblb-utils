# rblb-utils 

> Common utils and shims used by RBLB projects

Basically, this is just my lazy way of adding a few choice shims that I use regularly in certain projects. You might want to look at [lodash](https://lodash.com) instead as it's better for public use ;)


## Install

```
$ yarn add rblb-utils
```

or

```
$ npm install --save rblb-utils
```

## Shims

### `Object.entries()`

```
{"a": 1, "b": 2}.entries() 
// => [["a", 1], ["b", 2]]
```

### `Object.values()

```
{"a": 1, "b": 2}.values() 
// => [1, 2]
```

### `Object.pickAndAssign(...sources)`

```
const source1 = {"a": "nope"};
const source2 = {"c": "nope"}
const source3 = {"a": "yes", "b": "also", "c": "nope"};
{"a": 1, "b": 2}.pickAndAssign(source1, source2, source3);
// {"a": "yes", "b": "also"}
```

Useful if you have an object containing default config and want to extract the values from multiple hierarchical config sources with many entries:

```
const defaults = {
    "a": 1,
    "b": undefined
}

defaults.pickAndAssign(configSourceA, configSourceB);
// => {"a":..., "b":...}
```


### `Array.seqAsync(fn)`

Stands for "Sequential Async". It will run each async function strictly in turn, waiting for the previous function to complete before stepping through to the next. `fn` does not _need_ to be async though. If `fn` is not async then just use `Array.forEach(fn)`.

```
const fn = (x) => {
    return someAsyncFn(c)
        .then(console.log(x));
}
["a", "b", "c"].seqAsync(fn)
// => "a"
// => "b"
// => "c"
```

## `Array.toObjectKeys()`

```
["a", "b", "c"].toObjectKeys()
// => {"a": undefined, "b": undefined, "c": undefined}
```

Handy in conjunction with `pickAndAssign` for setting up the initial object and then pulling out the values from other objects. e.g. for extracting a subset of config from multiple hierarchical config sources:

```
const desiredConfig = ["a", "b", "c"]
const configSourceA = {...lots of keys...}
const configSourceB = {...even more keys...}
desiredConfig.toObjectKeys().pickAndAssign(configSourceA, configSourceB);
// => {"a": ..., "b":..., "c":...}
```

## `Promise.peek(fn)`

Easily peek into a promise chain

```
Promise.resolve("a")
    .peek(console.log)
    .then(console.log)
    .then(console.log)
// => "a"
// => "a"
// => undefined    
```


## Testing

```
npm run mocha
```

## License

MIT © [Alastair Brayne]
