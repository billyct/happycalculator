# happycalculator ![image of travis-ci](https://travis-ci.org/billyct/happycalculator.svg)

![icon](./icon.png)


一个公式计算类库，类似计算"1+2+3" = 6 ,支持自定义的函数公式类似 "cos() sin()..." 或者那些你想用的任何函数公式

[ENGLISH](./README.md)

##安装


``` $ npm install --save happycalculator ```

##使用
###基本

```
var happycalculator = require('happycalculator');
var formula = '20 * ( 10 + 20 ) / 20';
happycalculator.convert(formula);
//输出: ['20', '*', '(', '10', '+', '20', ')', '/', '20']
happycalculator.shunt(formula);
//输出: [ '20', '10', '20', '+', '*', '20', '/' ]
happycalculator.calculate(formula);
//输出: 30
```
###高级
```
happycalculator.calculate(sqrt(10)*20/20);
//output 100
var formulas = {
	'sqrt' : '$1 + $1'
};
happycalculator.addFormulas(formulas);
happycalculator.calculate(sqrt(10)*20/20);
//output 20
happycalculator.calculate(sqrt(10)*20/20);
//output 40
happycalculator.removeFormulas();
happycalculator.calculate(sqrt(10)*20/20);
//output 20
```

##API
###convert(string_infix)
返回一个被运算符(+-*/)切割了的数组,当然"("也是有所处理的，(example:a,ab,cos(20)) 这些都是可以的

###shunt(string_infix)
返回后缀表示的公式数组 [Shunting-yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)，核心代码来自 [rosettacode](https://rosettacode.org/wiki/Parsing/Shunting-yard_algorithm#JavaScript) 修改了一些些让它可以使用

###calculate(string_infix)
返回计算值

###TODO
* ~~支持自定义的函数公式类似 "cos() sin()..." 或者那些你想用的任何函数公式~~
* 支持公式函数嵌套公式，类似sqrt(10+20)，可以使用


##License
MIT © billyct
