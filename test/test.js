var expect = require('chai').expect;
var happycalculator = require('../libs/calculator');


describe('calculator', function () {
  'use strict';

  describe('fixBracketsPre', function () {
    it("(20) should return (, 20)", function () {
      var test_data = '(20)';
      expect(happycalculator.fixBracketsPre(test_data)).to.deep.equal(['(', '20)']);
    });
  });

  describe('fixBracketsPost', function () {
    it("(20) should return (20)", function () {
      var test_data = '(20)';
      expect(happycalculator.fixBracketsPost(test_data)).to.deep.equal(['(20)']);
    });
    it("20) should return 20, )", function () {
      var test_data = '20)';
      expect(happycalculator.fixBracketsPost(test_data)).to.deep.equal(['20', ')']);
    });

    it("20)) should return 20, ), )", function () {
      var test_data = '20))';
      expect(happycalculator.fixBracketsPost(test_data)).to.deep.equal(['20', ')', ')']);
    });
  });


  describe('fixBrackets', function () {
    it("(20) should return 20", function () {
      var test_data = '(20)';
      expect(happycalculator.fixBrackets(test_data)).to.deep.equal(['20']);
    });
  });



  describe('fixFormulas', function() {


    afterEach(function() {
      happycalculator.removeFormulas();
    });


    it("sqrt(20) should return ['(', '20', '*', '20', ')']", function() {
      var test_data = 'sqrt(20)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '20', '*', '20', ')']);
    });

    it("sqrt(20 + 20) should return ['(', '20', '*', '20', ')']", function() {
      var test_data = 'sqrt(20+20)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')']);

    });

    it("sqrt(sqrt(20)) should return ['(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']", function() {
      var test_data = 'sqrt(sqrt(20))';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']);

    });

    it("sqrt(20) should return ['(', '20', '+', '20', ')']", function() {
      happycalculator.addFormulas({
        'sqrt': '$1 + $1'
      });
      var test_data = 'sqrt(20)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '20', '+', '20', ')']);

    });

    it("custom(20, 10) should return ['(', '20', '+', '10', ')']", function() {
      happycalculator.addFormulas({
        'custom': '$1 + $2'
      });
      var test_data = 'custom(20, 10)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '20', '+', '10', ')']);

    });


  });

  describe('fixFormulasLoop', function() {
    it("[ 'sqrt(sqrt(2', ')', ')' ] should return ['sqrt(sqrt(2))']", function() {
      var test_data = [ 'sqrt(sqrt(2', ')', ')' ];
      expect(happycalculator.fixFormulasLoop(test_data)).to.deep.equal(['sqrt(sqrt(2))']);

    });
    it("[ 'sqrt(2', '+', '2', ')' ] should return ['sqrt(2+2)']", function() {
      var test_data = [ 'sqrt(2', '+', '2', ')' ];
      expect(happycalculator.fixFormulasLoop(test_data)).to.deep.equal(['sqrt(2+2)']);

    });
    it("[ 'sqrt(sqrt(2', '+', '2', ')', ')' ] should return ['sqrt(sqrt(2+2))']", function() {
      var test_data = [ 'sqrt(sqrt(2', '+', '2', ')', ')' ];
      expect(happycalculator.fixFormulasLoop(test_data)).to.deep.equal(['sqrt(sqrt(2+2))']);
    });

    it("[ 'sqrt(sqrt(2', '+', '2', ')', ')' ] should return ['sqrt(sqrt(sqrt(2+2)))']", function() {
      var test_data = [ 'sqrt(sqrt(sqrt(2', '+', '2', ')', ')', ')' ];
      expect(happycalculator.fixFormulasLoop(test_data)).to.deep.equal(['sqrt(sqrt(sqrt(2+2)))']);
    });
  });


  describe('convert', function () {
    it("20 * ( 10 + 20 ) / 20 should return ['20', '*', '(', '10', '+', '20', ')', '/', '20']", function () {
      var test_data = '20 * ( 10 + 20 ) / 20';
      expect(happycalculator.convert(test_data)).to.deep.equal(['20', '*', '(', '10', '+', '20', ')', '/', '20']);

    });

    it("20 * ( 10 + 20 ) / sqrt(20) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '20', '*', '20', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt(20)';
      expect(happycalculator.convert(test_data)).to.deep.equal(['20', '*', '(', '10', '+', '20', ')', '/', '(', '20', '*', '20', ')']);

    });


    it("20 * ( 10 + 20 ) / sqrt(20 + 20) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt(20 + 20)';
      expect(happycalculator.convert(test_data)).to.deep.equal(['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')']);

    });


    it("20 * ( 10 + 20 ) / sqrt(sqrt(20)) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt(sqrt(20))';
      expect(happycalculator.convert(test_data)).to.deep.equal(['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']);

    });

    it("sqrt(sqrt(20+20)) should return right", function() {
      var test_data = 'sqrt(sqrt(20+20))';
      expect(happycalculator.convert(test_data)).to.deep.equal(['(', '(', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')', ')', '*', '(', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')', ')', ')']);

      //((((20+20)*(20+20)))*(((20+20)*(20+20))))
    });
  });

  describe('shunt', function() {

    it("20 * ( 10 + 20 ) / 20 should return [ '20', '10', '20', '+', '*', '20', '/' ]", function() {
      var test_data = '20 * ( 10 + 20 ) / 20';

      expect(happycalculator.shunt(test_data)).to.deep.equal([ '20', '10', '20', '+', '*', '20', '/' ]);

    });
  });

  describe('calculate', function() {
    it("20 * ( 10 + 20 ) / 20 should return 30", function() {
      var test_data = '20 * ( 10 + 20 ) / 20';
      expect(happycalculator.calculate(test_data)).to.equal(30);

    });

    it("sqrt(sqrt(20)) should return 160000", function() {
      var test_data = 'sqrt(sqrt(20))';
      expect(happycalculator.calculate(test_data)).to.equal(160000);
    });


    it("sqrt(20+20) should return 1600", function() {
      var test_data = 'sqrt(20+20)';
      expect(happycalculator.calculate(test_data)).to.equal(1600);
    });


    it("sqrt(20+20) + sqrt(20+20) should return 3200", function() {
      var test_data = 'sqrt(20+20) + sqrt(20+20)';
      expect(happycalculator.calculate(test_data)).to.equal(3200);

    });

    it("sqrt(sqrt(2+2)) should return 256", function() {
      var test_data = 'sqrt(sqrt(2+2))';
      expect(happycalculator.calculate(test_data)).to.equal(256);

    });

    it("custom(sqrt(2+2)) should throw error", function() {
      var test_data = 'custom(2+2)';
      expect(function(){happycalculator.calculate(test_data);}).to.throw(Error, 'unvalid expression');
    });
  });


  describe('parse', function() {

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab should return ['(3+4)*3']", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab';
      expect(happycalculator.parse(test_data)).to.deep.equal(['(3+4)*3']);

    });

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab should return ['(3+4)*3', '4+4']", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab';
      expect(happycalculator.parse(test_data)).to.deep.equal(['(3+4)*3', '4+4']);

    });

  });


  describe('calculateCode', function() {

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab should return [21]", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab';
      expect(happycalculator.calculateCode(test_data)).to.deep.equal([21]);
    });

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab should return [21, 8]", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab';
      expect(happycalculator.calculateCode(test_data)).to.deep.equal([21, 8]);
    });

    it("a=$1 + $2; a(a(5,6), a(5,6)) should return [22]", function() {
      var test_data = 'a=$1 + $2; a(a(5,6), a(5,6))';
      expect(happycalculator.calculateCode(test_data)).to.deep.equal([22]);
    });

  });

});