var assert = require('assert');
var calculator = require('../libs/calculator');


describe('calculator', function () {
  'use strict';

  describe('fixBracketsPre', function () {
    it("(20) should return (, 20)", function () {
      var test_data = '(20)';
      assert.deepEqual(['(', '20)'], calculator.fixBracketsPre(test_data));
    });
  });

  describe('fixBracketsPost', function () {
    it("(20) should return (20)", function () {
      var test_data = '(20)';
      assert.deepEqual(['(20)'], calculator.fixBracketsPost(test_data));
    });
    it("20) should return 20, )", function () {
      var test_data = '20)';
      assert.deepEqual(['20', ')'], calculator.fixBracketsPost(test_data));
    });

    it("20)) should return 20, ), )", function () {
      var test_data = '20))';
      assert.deepEqual(['20', ')', ')'], calculator.fixBracketsPost(test_data));
    });
  });


  describe('fixBrackets', function () {
    it("(20) should return 20", function () {
      var test_data = '(20)';
      assert.deepEqual(['20'], calculator.fixBrackets(test_data));
    });
  });



  describe('fixFormulas', function() {


    afterEach(function() {
      calculator.removeFormulas();
    });


    it("sqrt(20) should return ['(', '20', '*', '20', ')']", function() {
      var test_data = 'sqrt(20)';
      assert.deepEqual(['(', '20', '*', '20', ')'], calculator.fixFormulas(test_data));
    });

    it("sqrt(20 + 20) should return ['(', '20', '*', '20', ')']", function() {
      var test_data = 'sqrt(20+20)';
      assert.deepEqual(['(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')'], calculator.fixFormulas(test_data));
    });

    it("sqrt(sqrt(20)) should return ['(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']", function() {
      var test_data = 'sqrt(sqrt(20))';
      assert.deepEqual(['(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')'], calculator.fixFormulas(test_data));
    });

    it("sqrt(20) should return ['(', '20', '+', '20', ')']", function() {
      calculator.addFormulas({
        'sqrt': '$1 + $1'
      });
      var test_data = 'sqrt(20)';
      assert.deepEqual(['(', '20', '+', '20', ')'], calculator.fixFormulas(test_data));
    });

    it("custom(20, 10) should return ['(', '20', '+', '10', ')']", function() {
      calculator.addFormulas({
        'custom': '$1 + $2'
      });
      var test_data = 'custom(20, 10)';
      assert.deepEqual(['(', '20', '+', '10', ')'], calculator.fixFormulas(test_data));
    });


  });

  describe('fixFormulasLoop', function() {
    it("[ 'sqrt(sqrt(2', ')', ')' ] should return ['sqrt(sqrt(2))']", function() {
      var test_data = [ 'sqrt(sqrt(2', ')', ')' ];
      assert.deepEqual(['sqrt(sqrt(2))'], calculator.fixFormulasLoop(test_data));
    });
    it("[ 'sqrt(2', '+', '2', ')' ] should return ['sqrt(2+2)']", function() {
      var test_data = [ 'sqrt(2', '+', '2', ')' ];
      assert.deepEqual(['sqrt(2+2)'], calculator.fixFormulasLoop(test_data));
    });
    it("[ 'sqrt(sqrt(2', '+', '2', ')', ')' ] should return ['sqrt(sqrt(2+2))']", function() {
      var test_data = [ 'sqrt(sqrt(2', '+', '2', ')', ')' ];
      assert.deepEqual(['sqrt(sqrt(2+2))'], calculator.fixFormulasLoop(test_data));
    });

    it("[ 'sqrt(sqrt(2', '+', '2', ')', ')' ] should return ['sqrt(sqrt(sqrt(2+2)))']", function() {
      var test_data = [ 'sqrt(sqrt(sqrt(2', '+', '2', ')', ')', ')' ];
      assert.deepEqual(['sqrt(sqrt(sqrt(2+2)))'], calculator.fixFormulasLoop(test_data));
    });
  });


  describe('convert', function () {
    it("20 * ( 10 + 20 ) / 20 should return ['20', '*', '(', '10', '+', '20', ')', '/', '20']", function () {
      var test_data = '20 * ( 10 + 20 ) / 20';
      assert.deepEqual(['20', '*', '(', '10', '+', '20', ')', '/', '20'], calculator.convert(test_data));
    });

    it("20 * ( 10 + 20 ) / sqrt(20) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '20', '*', '20', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt(20)';
      assert.deepEqual(['20', '*', '(', '10', '+', '20', ')', '/', '(', '20', '*', '20', ')'], calculator.convert(test_data));
    });


    it("20 * ( 10 + 20 ) / sqrt(20 + 20) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt(20 + 20)';
      assert.deepEqual(['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')'], calculator.convert(test_data));
    });


    it("20 * ( 10 + 20 ) / sqrt(sqrt(20)) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt(sqrt(20))';
      assert.deepEqual(['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')'], calculator.convert(test_data));
    });

    it("sqrt(sqrt(20+20)) should return right", function() {
      var test_data = 'sqrt(sqrt(20+20))';
      //((((20+20)*(20+20)))*(((20+20)*(20+20))))
      assert.deepEqual(['(', '(', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')', ')', '*', '(', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')', ')', ')'], calculator.convert(test_data));
    });
  });

  describe('shunt', function() {

    it("20 * ( 10 + 20 ) / 20 should return [ '20', '10', '20', '+', '*', '20', '/' ]", function() {
      var test_data = '20 * ( 10 + 20 ) / 20';
      assert.deepEqual([ '20', '10', '20', '+', '*', '20', '/' ], calculator.shunt(test_data));
    });
  });

  describe('calculate', function() {
    it("20 * ( 10 + 20 ) / 20 should return 30", function() {
      var test_data = '20 * ( 10 + 20 ) / 20';
      assert.equal(30, calculator.calculate(test_data));
    });

    it("sqrt(sqrt(20)) should return 160000", function() {
      var test_data = 'sqrt(sqrt(20))';
      assert.equal(160000, calculator.calculate(test_data));
    });


    it("sqrt(20+20) should return 1600", function() {
      var test_data = 'sqrt(20+20)';
      assert.equal(1600, calculator.calculate(test_data));
    });


    it("sqrt(20+20) + sqrt(20+20) should return 3200", function() {
      var test_data = 'sqrt(20+20) + sqrt(20+20)';
      assert.equal(3200, calculator.calculate(test_data));
    });

    it("sqrt(sqrt(2+2)) should return 256", function() {
      var test_data = 'sqrt(sqrt(2+2))';
      assert.equal(256, calculator.calculate(test_data));
    });

    it("custom(sqrt(2+2)) should throw error", function() {
      var test_data = 'custom(2+2)';
      assert.throws(function(){calculator.calculate(test_data);}, Error, 'unvalid expression');
    });
  });


  describe('parse', function() {

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab should return ['(3+4)*3']", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab';
      assert.deepEqual(['(3+4)*3'], calculator.parse(test_data));
    });

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab should return ['(3+4)*3', '4+4']", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab';
      assert.deepEqual(['(3+4)*3', '4+4'], calculator.parse(test_data));
    });

  });


  describe('calculateCode', function() {

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab should return [21]", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab';
      assert.deepEqual([21], calculator.calculateCode(test_data));
    });

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab should return [21, 8]", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab';
      assert.deepEqual([21, 8], calculator.calculateCode(test_data));
    });

  });



});