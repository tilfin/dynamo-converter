'use strict';

const chai = require('chai');
const expect = chai.expect;
const dc = require('../main');


describe('dc', () => {

  describe('#toAttr()', () => {
    it('returns number attribute from integer', () => {
      expect(dc.toAttr(10)).to.deep.equal({ N: '10' });
    });

    it('returns number attribute from float', () => {
      expect(dc.toAttr(3.14)).to.deep.equal({ N: '3.14' });
    });

    it('returns string attribute from string', () => {
      expect(dc.toAttr('45.62')).to.deep.equal({ S: '45.62' });
    });

    it('returns bool attribute from boolean', () => {
      expect(dc.toAttr(true)).to.deep.equal({ BOOL: true });
      expect(dc.toAttr(false)).to.deep.equal({ BOOL: false });
    });

    it('returns null attribute from null', () => {
      expect(dc.toAttr(null)).to.deep.equal({ NULL: true });
    });

    context('arrayMode is default FAST', () => {
      it('returns stringset attribute from array has first string elment', () => {
        const value = ['Hello', '1.25'];
        const result = {
          SS: ['Hello', '1.25']
        };
        expect(dc.toAttr(value)).to.deep.equal(result);
      });

      it('returns numberset attribute from array has first number elment', () => {
        const value = [5478.2, 100];
        const result = {
          NS: ['5478.2', '100']
        };
        expect(dc.toAttr(value)).to.deep.equal(result);
      });

      it('returns binaryset attribute from array has first number Buffer', () => {
        const value = [
          new Buffer('ff063e', 'hex'),
          new Buffer('7b386c', 'hex')
        ];
        const result = {
          BS: [
            new Buffer('ff063e', 'hex'),
            new Buffer('7b386c', 'hex')
          ]
        };
        expect(dc.toAttr(value)).to.deep.equal(result);
      });

      it('returns list attribute from array has first object elment', () => {
        const value = [{ name: 'Ken' }, 'Hello', 999];
        const result = {
          L: [
            {
              M: {
                name: { S: 'Ken' }
              }
            },
            { S: 'Hello' },
            { N: '999' }
          ]
        };
        expect(dc.toAttr(value)).to.deep.equal(result);
      });
    });

    context('arrayMode is STRICT', () => {
      it('returns stringset attribute from array has string elements', () => {
        const value = ['Hello', '1.25'];
        const result = {
          SS: ['Hello', '1.25']
        };
        expect(dc.toAttr(value, dc.ARRAY_MODE_STRICT)).to.deep.equal(result);
      });

      it('returns numberset attribute from array has number elements', () => {
        const value = [5478.2, 100];
        const result = {
          NS: ['5478.2', '100']
        };
        expect(dc.toAttr(value, dc.ARRAY_MODE_STRICT)).to.deep.equal(result);
      });

      it('returns binaryset attribute from array has Buffer elements', () => {
        const value = [
          new Buffer('ff063e', 'hex'),
          new Buffer('7b386c', 'hex')
        ];
        const result = {
          BS: [
            new Buffer('ff063e', 'hex'),
            new Buffer('7b386c', 'hex')
          ]
        };
        expect(dc.toAttr(value, dc.ARRAY_MODE_STRICT)).to.deep.equal(result);
      });

      it('returns list attribute from array has variable elments', () => {
        const value = [{ name: 'Ken' }, 'Hello', 999];
        const result = {
          L: [
            {
              M: {
                name: { S: 'Ken' }
              }
            },
            { S: 'Hello' },
            { N: '999' }
          ]
        };
        expect(dc.toAttr(value, dc.ARRAY_MODE_STRICT)).to.deep.equal(result);
      });
    });

    context('arrayMode is LIST', () => {
      it('returns list attribute from array has string elements', () => {
        const value = ['Hello', '1.25'];
        const result = {
          L: [{ S: 'Hello' }, { S: '1.25' }]
        };
        expect(dc.toAttr(value, dc.ARRAY_MODE_LIST)).to.deep.equal(result);
      });

      it('returns list attribute from array has number elements', () => {
        const value = [5478.2, 100];
        const result = {
          L: [{ N: '5478.2' }, { N: '100' }]
        };
        expect(dc.toAttr(value, dc.ARRAY_MODE_LIST)).to.deep.equal(result);
      });

      it('returns list attribute from array has Buffer elements', () => {
        const value = [
          new Buffer('ff063e', 'hex'),
          new Buffer('7b386c', 'hex')
        ];
        const result = {
          L: [
            { B: new Buffer('ff063e', 'hex') },
            { B: new Buffer('7b386c', 'hex') }
          ]
        };
        expect(dc.toAttr(value, dc.ARRAY_MODE_LIST)).to.deep.equal(result);
      });

      it('returns list attribute from array has variable elments', () => {
        const value = [{ name: 'Ken' }, 'Hello', 999];
        const result = {
          L: [
            {
              M: {
                name: { S: 'Ken' }
              }
            },
            { S: 'Hello' },
            { N: '999' }
          ]
        };
        expect(dc.toAttr(value, dc.ARRAY_MODE_LIST)).to.deep.equal(result);
      });
    });

    it('returns map attribute from object', () => {
      const value = {
        str1: 'Hello',
        str2: '1.25',
        num1: 56.2
      }
      const result = {
        M: {
          str1: { S: 'Hello' },
          str2: { S: '1.25' },
          num1: { N: '56.2' }
        }
      };
      expect(dc.toAttr(value)).to.deep.equal(result);
    });
  });

  describe('#toItem()', () => {
    it('returns DynamoDB attributes from JS object recursively', () => {
      const obj = {
        str1: 'Hello',
        str2: '1.25',
        num1: 56.2,
        map1: {
          foo: 'hoo',
          bar: 1342
        },
        buf1: new Buffer('fe4dcf', 'hex')
      };
      const item = {
        str1: { S: 'Hello' },
        str2: { S: '1.25' },
        num1: { N: '56.2' },
        map1: {
          M: {
            foo: { S: 'hoo' },
            bar: { N: '1342' }
          }
        },
        buf1: { B: new Buffer('fe4dcf', 'hex') }
      };
      expect(dc.toItem(obj)).to.deep.equal(item);
    });
  });

});
