# happycalculator ![image of travis-ci](https://travis-ci.org/billyct/happycalculator.svg)

![icon](./icon.png)


一个公式计算类库，类似计算"1+2+3" = 6 ,支持自定义的函数公式类似 "cos() sin()..." 或者那些你想用的任何函数公式,支持公式嵌套例如sqrt(sqrt(20+20)),



[ENGLISH](./README.md)

##安装


``` $ npm install --save happycalculator ```

##使用
###基本

```js
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
```js
happycalculator.calculate(sqrt(10)*20/20);
//output 100
happycalculator.calculate(sqrt(10)*20/20);
//output 100

happycalculator.addFormulas({'sqrt' : '$1 + $1'});
happycalculator.calculate(sqrt(10)*20/20);
//output 20
happycalculator.calculate(sqrt(sqrt(10))*20/20);
//output 40
happycalculator.removeFormulas();
happycalculator.calculate(sqrt(10)*20/20);
//output 20

happycalculator.addFormulas({'custom' : '$1 + $2 +$3'});
happycalculator.calculate(custom(10, 20, 30))
//output 60
happycalculator.removeFormulas();

//support formulas loop
happycalculator.calculate(sqrt(sqrt(10)));
//output 10000
happycalculator.calculate(sqrt(sqrt(2+2)));
//output 256
```

####支持简单的编程方式的运算
```js
var code = `sum = $1 + $2;
a = 2;
b = 3;
sum(a,b)+a;
a = 3;
a+b;`
calculator.parse(code);
//output ['(2+3)+2', '3+3']
calculator.calculateCode(code);
//output [7, 6]
```
这就是这个简单编程方式的所有

##API
###convert(string_infix)
返回一个被运算符(+-*/)切割了的数组,当然"("也是有所处理的，(example:a,ab,cos(20)) 这些都是可以的

###shunt(string_infix)
返回后缀表示的公式数组 [Shunting-yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)，核心代码来自 [rosettacode](https://rosettacode.org/wiki/Parsing/Shunting-yard_algorithm#JavaScript) 修改了一些些让它可以使用

###calculate(string_infix)
返回计算值

###addFormulas(formulas)
添加自定义公式函数，规则类似{'key' : '$1+$2+$3'},key(1,2,3)
默认的公式函数暂时只有sqrt : '$1*$1',还在继续

###removeFormulas()
删除所有自定义公式函数，然后你的公式将仅仅支持默认的公式函数

###parse(string_code)
返回string_code表达的公式的数组

###calculateCode(string_code)
返回解析了简单的编程的字符串后的公式的运算结果的数组





##License
MIT © billyct
