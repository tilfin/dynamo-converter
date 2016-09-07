dynamo-converter
================

[![NPM Version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/tilfin/dynamo-converter.svg?branch=master)](https://travis-ci.org/tilfin/dynamo-converter)

Light reversible converter JavaScript value to DynamoDB attrbute for Node.js

## Features

* Simply and lightly for Node.js 4.2 or later only
* Easy to understand method names
* Fast judge to convert Array to Number/String/BinarySet because of see only a first element (default mode)

## How to Install

```
$ npm install -save dynamo-converter
```

## How to Use

```
const dc = require('dynamo-converter')
```

## DynamoDB -> JS

### Convert JS value from DynamoDB Attribute

```
> dc.fromAttr({ S: 'Hello' })
'Hello'

> dc.fromAttr({ N: '3.14' })
3.14

> dc.fromAttr({
    M: {
      name: { S: 'Taro' }
    }
  })
{ name: 'Taro' }

> dc.fromAttr({ NS: [ '1', '2', '3' ] })
[ 1, 2, 3 ]

> dc.fromAttr({ L: [ { N: '1' }, { N: '2' }, { N: '3' } ] })
[ 1, 2, 3 ]
```

### Convert JS object from DynamoDB Item

For converting from DynamoDB getItem result

```
> dc.fromItem({ name: { S: 'Taro' }, age: { N: '15' }})
{ name: 'Taro', age: 15 }
```


## JS -> DynamoDB

### Convert JS value to DynamoDB Attribute

```
> dc.toAttr('Hello')
{ S: 'Hello' }

> dc.toAttr(3.14)
{ N: '3.14' }

> dc.toAttr({ name: 'Taro' })
{
  M: {
    name: { S: 'Taro' }
  }
}

> dc.toAttr([1, 2, 3])
{ NS: [ '1', '2', '3' ] }

```

### Convert JS object to DynamoDB Item

```
> dc.toItem({ name: 'Taro' })
{ name: { S: 'Taro' } }
```

* A root does not has `M` key.

### Converting Array mode

#### FAST (default)

This is checking only first element of array. so you do not use an array has both string and number, Buffer elements.

```
> dc.toAttr([1, 'word'], dc.ARRAY_MODE_FAST)
{ NS: [ '1', 'word' ] } // Invalid
```

#### STRICT

This is checking all elements of array. so safe

```
dc.toAttr([1, 'word'], dc.ARRAY_MODE_STRICT)
{ L: [ { N: '1' }, { S: 'word' } ] }
```

#### LIST

Convert list as array at all

```
> dc.toItem({ ids: [3, 4, 12] }, dc.ARRAY_MODE_LIST)
{ ids: {
  { L: [ { N: '3' }, { N: '4' }, { N: '12' } ] }
}
```

## LICENSE

MIT


[npm-image]: https://img.shields.io/npm/v/dynamo-converter.svg
[npm-url]: https://npmjs.org/package/dynamo-converter
