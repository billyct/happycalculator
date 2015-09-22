# happycalculator ![image of travis-ci](https://travis-ci.org/billyct/happycalculator.svg)
![icon](./icon.png)


calculator for natural formula like "1+2+3" for result 6,support custom function like sqrt(20) also whatever you want,support formulas loop,  like sqrt(sqrt(20+20))



[中文](https://github.com/billyct/happycalculator/blob/master/readme_zh.md)

##Install


``` $ npm install --save happycalculator ```


or bower


``` $ bower install --save happycalculator ``` and it will apply happycalculator global to you

##Usage
###base

```js
var happycalculator = require('happycalculator');
var formula = '20 * ( 10 + 20 ) / 20';
happycalculator.convert(formula);
//output: ['20', '*', '(', '10', '+', '20', ')', '/', '20']
happycalculator.shunt(formula);
//output: [ '20', '10', '20', '+', '*', '20', '/' ]
happycalculator.calculate(formula);
//output: 30
```
###advance
```js
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

//support formulas loop
happycalculator.calculate(sqrt(sqrt(10)));
//output 10000
happycalculator.calculate(sqrt(sqrt(2+2)));
//output 256
```

####support simple code
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
and that's all simple code support right now

##API
###convert(string_infix)
return an array that split with "+-*/",and if the string with values(example:a,ab,cos(20)) also that will be ok

###shunt(string_infix)
return an array postinfx that with the [Shunting-yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) converted,the core code was written from [rosettacode](https://rosettacode.org/wiki/Parsing/Shunting-yard_algorithm#JavaScript) and i change some code for the project

###calculate(string_infix)
return the num calculated

###addFormulas(formulas)
add custom formulas to the calculator,and the formula rule is looks like that{'key' => '$1+$2+$3'},key(1,2,3),default formula function has sqrt:'$1*$1' right now,its working on

###removeFormulas()
remove all custom formulas you add in and defaults to the default project supported formulas

###parse(string_code)
return array of string_code parsed


###calculateCode(string_code)
return array of the result calculated by the string_code parsed 




##License
MIT © billyct
