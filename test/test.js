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

    it("sqrt(20) should return", function() {
      calculator.addFormulas({
        'sqrt': '$1 + $1'
      });
      var test_data = 'sqrt(20)';
      assert.deepEqual(['(', '20', '+', '20', ')'], calculator.fixFormulas(test_data));
    });

    it("custom(20, 10) should return", function() {
      calculator.addFormulas({
        'custom': '$1 + $2'
      });
      var test_data = 'custom(20, 10)';
      assert.deepEqual(['(', '20', '+', '10', ')'], calculator.fixFormulas(test_data));
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


    //it("20 * ( 10 + 20 ) / sqrt(20 + 20) should return", function() {
    //  var test_data = '20 * ( 10 + 20 ) / sqrt(20 + 20)';
    //  assert.deepEqual(['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')'], calculator.convert(test_data));
    //});


    it("20 * ( 10 + 20 ) / sqrt(sqrt(20)) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt(sqrt(20))';
      assert.deepEqual(['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')'], calculator.convert(test_data));
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

  });



});