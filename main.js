'use strict';

function toValue(attr) {
  if ('S' in attr) {
    return attr.S;
  } else if ('N' in attr) {
    return Number(attr.N);
  } else if ('BOOL' in attr) {
    return attr.BOOL;
  } else if ('NULL' in attr) {
    return null;
  } else if ('M' in attr) {
    return toMap(attr.M);
  } else if ('L' in attr) {
    return attr.L.map((item) => {
        return toValue(item)
      });
  } else if ('B' in attr) {
    return attr.B;
  } else if ('SS' in attr) {
    return attr.SS;
  } else if ('NS' in attr) {
    return attr.NS.map((n) => { return Number(n) });
  } else if ('BS' in attr) {
    return attr.BS;
  } else {
    const keys = Object.keys(attr.B);
    if (keys.length > 0) {
      throw new Error(`${keys[0]} is not supported`);
    } else {
      throw new Error(`An attribute is invalid`);
    }
  }
}

function toMap(attrMap) {
  const item = {}
  for (let key in attrMap) {
    item[key] = toValue(attrMap[key]);
  }
  return item;
}

/**
 * Convert DynamoDB Attribute to JavaScript value
 * @param  {Object} attr - DynamoDB attribute
 * @return {Any} JS primitive value, Array or Object
 */
exports.fromAttr = toValue;

/**
 * Convert DynamoDB Attributes to JavaScript object
 * @param  {Object} attrMap  - DynamoDB Attributes
 * @return {Object} JS object
 */
exports.fromItem = toMap;


const FAST = 0;
const STRICT = 1;
const LIST = 2;


function toAttr(val, arrayMode){
  const valtype = typeof val;

  if (valtype === 'string') {
    return { S: val };
  } else if (valtype === 'number') {
    return { N: String(val) };
  } else if (valtype === 'boolean') {
    return { BOOL: val };
  } else if (val === null) {
    return { NULL: true };
  } else if (val instanceof Array) {
    if (arrayMode !== LIST && val.length > 0) {
      const rset = arrayToSet(val, arrayMode);
      if (rset !== null) return rset;
    }

    return {
      L: val.map((v) => { return toAttr(v, arrayMode) })
    };
  } else if (val instanceof Buffer) {
    return { B: val };
  } else if (valtype === 'object') {
    return { M: fromObject(val) };
  } else {
    throw new Error(`${valtype} is not supported`);
  }
}

function fromObject(map, arrayMode) {
  const attrs = {};
  for (let k in map) {
    attrs[k] = toAttr(map[k], arrayMode);
  }
  return attrs;
}

function arrayToSet(array, arrayMode) {
  const onlyFirst = (arrayMode !== STRICT);
  const firstType = typeof array[0];

  if (firstType === 'string') {
    if (onlyFirst) return { SS: array };

    for (let item of array) {
      if (typeof item !== 'string') return null;
    }
    return { SS: array };

  } else if (firstType === 'number') {
    if (onlyFirst) {
      return { NS: array.map((v) => { return String(v) }) };
    }

    const numset = [];
    for (let item of array) {
      if (typeof item !== 'number') return null;
      numset.push(String(item));
    }
    return { NS: numset };

  } else if (firstType === 'object' && array[0] instanceof Buffer) {
    if (onlyFirst) return { BS: array };

    for (let item of array) {
      if (!(item instanceof Buffer)) return null;
    }
    return { BS: array };
  }

  return null;
}

/**
 * Checking only first element of array,
 * if it is Number, convert array to NumberSet.
 * if it is String, convert array to StringSet.
 * if it is Buffer, convert array to BinarySet.
 */
exports.ARRAY_MODE_FAST = FAST;

/**
 * Checking all elements of array,
 * if they are Number, convert array to NumberSet.
 * if they are String, convert array to StringSet.
 * if they are Buffer, convert array to BinarySet.
 * Else convert array to List.
 */
exports.ARRAY_MODE_STRICT = STRICT;

/**
 * Convert array to List.
 */
exports.ARRAY_MODE_LIST = LIST;

/**
 * Convert JavaScript value to DynamoDB attribute
 *
 * @param  {Any} val - JS value
 * @param  {Number} arrayMode - Judge to convert array (default: FAST is checking only first element)
 * @return {Object} DynamoDB attribute
 */
exports.toAttr = function(val, arrayMode) {
  return toAttr(val, arrayMode || FAST);
}

/**
 * Convert JavaScript object to DynamoDB attributes
 *
 * @param  {Object} val - JS object
 * @param  {Number} arrayMode - Judge to convert array (default: FAST is checking only first element)
 * @return {Object} DynamoDB attributes
 */
exports.toItem = function(obj, arrayMode) {
  return fromObject(obj, arrayMode || FAST);
}
