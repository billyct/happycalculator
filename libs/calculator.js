/*jslint node: true */
/*jslint todo: true */
"use strict";

var _ = require('lodash');
var calculator_formulas = require('./calculator_formulas');

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
   * 存储公式函数，初始化的公式函数在 calculator_formulas.js
   */
  formulas : _.clone(calculator_formulas),


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
        cur = _.parseInt(cur);
        if (_.isNaN(cur)) {
          throw new Error("unvalid expression");
        }
        outputStack.push(cur);
      } else {
        if (outputStack.length < 2) {
          throw new Error('unvalid stack length');
        }
        sec = outputStack.pop();
        fir = outputStack.pop();
        outputStack.push(this.__calculate(fir, sec, cur));
      }
    }
    if (outputStack.length !== 1) {
      throw new Error("unvalid expression");
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
        result = result.concat(this.fixBracketsPost(preFixedItem.substr(0, preFixedItem.length - 1)));
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
    // 需要把前面的括号和后面的括号中和掉，比如"(,(,cos(29),),),)"应该是"cos(29),)"
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
   * 解析公式函数
   * @param item
   * @returns {string/array}
   */
  fixFormulas: function(item) {
    var indexOfBracketPre = _.indexOf(item, '('),
      indexOfBracketPost = _.lastIndexOf(item, ')'),
      result = item,
      args, reg, i;

    if (indexOfBracketPre !== -1 && indexOfBracketPost !== -1) {
      //表示是一个公式函数
      //公式函数规则 example: "sqrt(2)",字母加上一个括号
      (function(_this) {

        return _.forIn(_this.formulas, function (formulaValue, formulaKey) {
          formulaValue = formulaValue.replace(/\s+/g, '');
          //需要判断这个key是开始位置开始的，还有这个item到(为止的前面跟key是相等的
          if (item.indexOf(formulaKey) === 0 &&
            item.substr(0, indexOfBracketPre) === formulaKey) {
            //匹配公式规则
            args = item.substring(indexOfBracketPre + 1, indexOfBracketPost);
            args = args.split(',');
            for (i = 0; i < args.length; i++) {
              //函数的定义格式是$1为第一个参数,$2为第二个参数以此类推
              reg = new RegExp('\\$' + (i + 1), 'g');
              //这里优先级可能会有问题，所以得加一个括号，这个如果是无用的括号，在后面的convert中会消除掉
              formulaValue = formulaValue.replace(reg, '(' + args[i] + ')');

            }

            //这个生成的解析后的函数表达式，也是一个表达式，可能也包括括号，所以需要convert
            formulaValue = _this.convert(formulaValue);

            formulaValue.unshift('(');
            formulaValue.push(')');

            result = formulaValue;
          }
        });

      }(this));
    }

    return result;

  },


  /**
   * 修复如果在公式函数里面还有公式的话
   * @param result
   * @returns {array}
   */
  fixFormulasLoop : function(result) {

    var countBracketsPre = 0,//括号的数量
      countBracketsPost = 0,
      // 操作
      flag = 0, //如果是1表示已经进入函数范围，0则不是
      temp = '',
      replaces = [], //存储需要替换的下标和替换内容
      pullAts = [], //下标后面到结束的一些下标
      start = 0,
      //
      i, reg;

    for (i = 0; i < result.length; i++) {

      if(flag === 1) {

        if('(' === result[i]) {
          countBracketsPre++;
        }
        if(')' === result[i]) {
          countBracketsPost++;
        }

        pullAts.push(i);

        //加入之前的string，然后删除自己
        temp += result[i];

        if(countBracketsPre === countBracketsPost) {

          replaces.push({
            start : start,
            formula : temp
          });
          //重新初始化一下
          temp = '';
          flag = 0;
          countBracketsPre = 0;
          countBracketsPost = 0;
          //start = 0;
          //length = 0;
        }
      } else {

        reg = new RegExp(/^\w+\(/);

        if(reg.test(result[i]) &&
          _.last(result[i]) !== ')' &&
          this.countMatches(result[i], '(') !== this.countMatches(result[i], ')')) {
          //如果是"word("开头的，我们就认定为是一个公式函数的开头，还有不能以)结束，
          flag = 1;
          countBracketsPre = this.countMatches(result[i], '(');
          temp += result[i];
          start = i;
        }
      }
    }

    for(i = 0; i < replaces.length; i++) {
      result[replaces[i].start] = replaces[i].formula;
    }

    _.pullAt(result, pullAts);


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
      temp = [],
      flag = 0,
      i;
    for (i = 0; i < infixArray.length; i++) {
      //把括号修复一下，就是之前的切割会出来类似((cos(20)的字符串，其实应该是"(,(,(cos(20)"
      temp = temp.concat(this.fixBrackets(infixArray[i]));
      //把运算符添加进去
      flag += flag === 0 ? infixArray[i].length : infixArray[i].length + 1;
      if (!_.isUndefined(infix[flag])) {
        temp.push(infix[flag]);
      }
    }

    temp = this.fixFormulasLoop(_.clone(temp));

    for (i = 0; i < temp.length; i++) {
      //需要解析公式函数，等到一个完整的表达式
      result = result.concat(this.fixFormulas(temp[i]));
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

  },

  /**
   * 添加公式函数
   * @param formulas
   */
  addFormulas : function(formulas) {
   this.formulas = _.assign(this.formulas, formulas);
  },

  /**
   * 删除扩展的公式函数，改变为初始化时候的公式函数
   */
  removeFormulas : function() {
    this.formulas = _.clone(calculator_formulas);
  }


};



module.exports = Calculator;