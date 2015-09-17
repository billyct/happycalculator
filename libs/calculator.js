/*jslint node: true */
/*jslint todo: true */
"use strict";

var _ = require('lodash');

/****
 * calculator 1.转化字符串成数组
 *            2.将数组调度
 *            3.进行rpn计算出结果
 * @type {object}
 * @api
 *      convert(str) return array
 *      shunt(str) return array postfix
 *      calculate(str) return int
 */
var Calculator = {

  /**
   * 配置的运算符
   */
  ops : {
    '-' : {
      'prec' : 2,
      'assoc' : 'Left'
    },
    '+' : {
      'prec' : 2,
      'assoc' : 'Left'
    },
    '*' : {
      'prec' : 3,
      'assoc' : 'Left'
    },
    '/' : {
      'prec' : 3,
      'assoc' : 'Left'
    }
  },


  /**
   * 计算结果
   * @param fir
   * @param sec
   * @param cur
   * @returns {*}
   * @private
   */
  __calculate : function(fir, sec, cur) {
    var result;
    switch(cur) {
      case '+' :
        result = fir + sec;
        break;
      case '-' :
        result = fir - sec;
        break;
      case '*' :
        result = fir * sec;
        break;
      case '/' :
        result = fir / sec;
        break;
      default :
        result = -1;
        break;
    }
    return result;
  },


  /***
   * 计算后缀法的公式,并返回整个计算结果
   * @param infix
   * @returns {number}
   */
  calculate : function(infix) {
    var postfixArray = this.shunt(infix),
      outputStack = [],
      cur, fir, sec;

    while(postfixArray.length > 0) {
      cur = postfixArray.shift();
      if (!this.isOperator(cur)) {
        /**
         * @TODO 这里将把变量等等等等都变成数字，如果是NAN，那就悲剧的吧，哈哈!
         **/
        outputStack.push(global.parseInt(cur));
      } else {
        if (outputStack.length < 2) {
          throw 'unvalid stack length';
        }
        sec = outputStack.pop();
        fir = outputStack.pop();
        outputStack.push(this.__calculate(fir, sec, cur));
      }
    }
    if (outputStack.length !== 1) {
      throw "unvalid expression";
    }
    return outputStack[0];
  },



  /**
   * get a associativity
   * @param o
   * @returns {string}
   */
  assoc: function(o) {
    return this.ops[o].assoc;
  },

  /**
   * get a precedence 优先级
   * @param o
   * @returns {number}
   */
  prec: function(o) {
    return this.ops[o].prec;
  },

  /**
   * 是否是运算符
   * @param val
   * @returns {boolean}
   */
  isOperator: function (val){
    return _.keys(this.ops).indexOf(val) > - 1;
  },

  /**
   * 计算match 在str 中的数量
   * @param str
   * @param match
   * @returns {number}
   */
  countMatches: function(str, match) {
    match = '\\' + match;
    return str.length - str.replace(new RegExp(match, "gm"), "").length;
  },


  /**
   * 把需要变成数组字段的(，变成数组
   * @param string item
   * @returns {Array}
   */
  fixBracketsPre: function(item) {

    var result = [],
      countBracketsPre = this.countMatches(item, '(');

    if (countBracketsPre > 0 && item.indexOf('(') === 0) {
      //如果第一个有(
      result = result.concat(item.substr(0, 1));
      result = result.concat(this.fixBracketsPre(item.substr(1)));
    } else {
      result = result.concat(item);
    }
    return result;
  },

  /**
   * 把需要变成数组的)变成数组
   * @param array preFixedItem
   * @returns {Array}
   */
  fixBracketsPost: function(preFixedItem) {
    var result = [],
      countBracketsPre = this.countMatches(preFixedItem, '('),
      countBracketsPost = this.countMatches(preFixedItem, ')');

    if (countBracketsPost > 0 && preFixedItem.lastIndexOf(')') === preFixedItem.length - 1) {
      //最后有)
      if(countBracketsPre > 0) {
        //如果有(
        if (countBracketsPost - countBracketsPre > 1) {
          //如果)比(多好几个
          result = result.concat(this.fixBracketsPost(preFixedItem.substr(0, preFixedItem.length - 1)));
          result = result.concat(preFixedItem.substr(preFixedItem.length - 1));
        }

        if (countBracketsPost - countBracketsPre === 1) {
          //如果)比(多一个
          result = result.concat(preFixedItem.substr(0, preFixedItem.length - 1));
          result = result.concat(preFixedItem.substr(preFixedItem.length - 1));
        }

        if (countBracketsPost - countBracketsPre < 1) {
          //如果)比(少
          result = result.concat(preFixedItem);
        }
      } else {
        //如果没有(
        result = result.concat(preFixedItem.substr(0, preFixedItem.length - 1));
        result = result.concat(preFixedItem.substr(preFixedItem.length - 1));
      }
    } else {
      result = result.concat(preFixedItem);
    }

    return result;
  },

  /**
   * 把需要变成数组的括号变成数组
   * @param item
   * @returns {*|Array}
   */
  fixBrackets: function(item) {
    var result = this.fixBracketsPre(item),
      preFixedItem = result.pop(),
      i;

    result = result.concat(this.fixBracketsPost(preFixedItem));
    //需要把前面的括号和后面的括号中和掉，比如"(,(,cos(29),),),)"应该是"cos(29),)"
    for (i = 0; i < result.length; i++) {
      if (_.first(result) === '(' && _.last(result) === ')') {
        result.shift();
        result.pop();
      } else {
        break;
      }
    }

    return result;
  },

  /**
   * 将字符串转化成数组
   * @param infix
   * @returns {Array}
   */
  convert: function(infix) {
    infix = infix.replace(/\s+/g, ''); // remove spaces, so infix[i]!=" "
    var infixArray = infix.split(/[\+\-\*\/]+/), //先把字符串里面的数据和符号区分开！没有运算符的数组
      result = [],
      flag = 0,
      i;
    for (i = 0; i < infixArray.length; i++) {
      //把括号修复一下，就是之前的切割会出来类似((cos(20)的字符串，其实应该是"(,(,(cos(20)"
      result = result.concat(this.fixBrackets(infixArray[i]));
      //把运算符添加进去
      flag += flag === 0 ? infixArray[i].length : infixArray[i].length + 1;
      if (!_.isUndefined(infix[flag])) {
        result.push(infix[flag]);
      }
    }

    return result;
  },


  /***
   * from wiki http://rosettacode.org/wiki/Parsing/Shunting-yard_algorithm#JavaScript
   * 将他代码里的字符串变成数组
   * @param infix
   * @returns {Array}
   */
  shunt : function(infix) {
    function push(element) {
      this.dataStore[this.top++] = element;
    }

    function pop() {
      return this.dataStore[--this.top];
    }

    function peek() {
      return this.dataStore[this.top - 1];
    }

    function length() {
      return this.top;
    }


    function Stack() {
      this.dataStore = [];
      this.top = 0;
      this.push = push;
      this.pop = pop;
      this.peek = peek;
      this.length = length;
    }


    var infixArray = this.convert(infix),
      s = new Stack(),
      postfixArray = [],
      token, o1, o2, i;

    for (i = 0; i < infixArray.length; i++) {
      token = infixArray[i];

      if (this.isOperator(token)) { // if token is an operator
        o1 = token;
        o2 = s.peek();
        while (this.isOperator(o2) && ( // while operator token, o2, on top of the stack
          // and o1 is left-associative and its precedence is less than or equal to that of o2
          (this.assoc(o1) === "Left" && (this.prec(o1) <= this.prec(o2))) ||
            // the algorithm on wikipedia says: or o1 precedence < o2 precedence, but I think it should be
            // or o1 is right-associative and its precedence is less than that of o2
          (this.assoc(o1) === "Right" && (this.prec(o1) < this.prec(o2)))
        )) {
          postfixArray.push(o2); // add o2 to output queue
          s.pop(); // pop o2 of the stack
          o2 = s.peek(); // next round
        }
        s.push(o1); // push o1 onto the stack
      } else if (token === "(") { // if token is left parenthesis
        s.push(token); // then push it onto the stack
      } else if (token === ")") { // if token is right parenthesis
        while (s.peek() !== "(") { // until token at top is (
          postfixArray.push(s.pop());
        }
        s.pop(); // pop (, but not onto the output queue
      } else {
        //如果是数字或者变量或者应该处理成字符串的东西
        postfixArray.push(token);
      }
    }
    while (s.length() > 0) {
      postfixArray.push(s.pop());
    }
    return postfixArray;

  }
};



module.exports = Calculator;