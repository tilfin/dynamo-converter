'use strict';

const chai = require('chai');
const expect = chai.expect;
const dc = require('../main');


describe('dc', () => {

  describe('#fromAttr()', () => {
    it('returns string from string attribute', () => {
      expect(dc.fromAttr({ S: '255.2' })).to.equal('255.2');
    });

    it('returns number from number attribute', () => {
      expect(dc.fromAttr({ N: '10' })).to.equal(10);
      expect(dc.fromAttr({ N: '3.14' })).to.equal(3.14);
    });

    it('returns boolean from bool attribute', () => {
      expect(dc.fromAttr({ BOOL: true })).to.be.true;
      expect(dc.fromAttr({ BOOL: false })).to.be.false;
    });

    it('returns null from null attribute', () => {
      expect(dc.fromAttr({ NULL: true })).to.be.null;
    });

    it('returns array from numberset attribute', () => {
      const data = { NS: ['1.25', '6'] };
      expect(dc.fromAttr(data)).to.deep.equal([1.25, 6]);
    });

    it('returns array from stringset attribute', () => {
      const data = { SS: ['Hello', '1.25'] };
      expect(dc.fromAttr(data)).to.deep.equal(['Hello', '1.25']);
    });

    it('returns array from stringset attribute', () => {
      const buf1 = new Buffer(0);
      const buf2 = new Buffer(1);
      const data = { BS: [buf1, buf2] };
      expect(dc.fromAttr(data)).to.deep.equal([buf1, buf2]);
    });

    it('returns array from list attribute', () => {
      const data = {
        L: [{ S: 'Hello' }, { S: '1.25' }, { N: '56.2' }]
      };
      expect(dc.fromAttr(data)).to.deep
        .equal(['Hello', '1.25', 56.2]);
    });

    it('returns object from map attribute', () => {
      const attrMap = {
        M: {
          str1: { S: 'Hello' },
          str2: { S: '1.25' },
          num1: { N: '56.2' }
        }
      };
      const result = {
        str1: 'Hello',
        str2: '1.25',
        num1: 56.2
      };
      expect(dc.fromAttr(attrMap)).to.deep.equal(result);
    });
  });

  describe('#fromItem()', () => {
    it('returns JS object from DynamoDB attributes recursively', () => {
      const item = {
        str1: { S: 'Good!' },
        str2: { S: '91.2' },
        num1: { N: '1563.236' },
        map1: {
          M: {
            foo: { S: 'hoo' },
            bar: { N: '857' }
          }
        },
        buf1: { B: new Buffer('fe4dcf', 'hex') }
      };
      const result = {
        str1: 'Good!',
        str2: '91.2',
        num1: 1563.236,
        map1: {
          foo: 'hoo', bar: 857
        },
        buf1: new Buffer('fe4dcf', 'hex')
      };
      expect(dc.fromItem(item)).to.deep.equal(result);
    });
  });

});
