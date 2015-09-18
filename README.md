# happycalculator ![image of travis-ci](https://travis-ci.org/billyct/happycalculator.svg)
![icon](./icon.png)


calculator for natural formula like "1+2+3" for result 6,support custom function like sqrt(20) also whatever you want

[中文](https://github.com/billyct/happycalculator/blob/master/readme_zh.md)

##Install


``` $ npm install --save happycalculator ```

##Usage
###base

```
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
```
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
```

##API
###convert(string_infix)
return an array that split with "+-*/",and if the string with values(example:a,ab,cos(20)) also that will be ok

###shunt(string_infix)
return an array postinfx that with the [Shunting-yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) converted,the core code was written from [rosettacode](https://rosettacode.org/wiki/Parsing/Shunting-yard_algorithm#JavaScript) and i change some code for the project

###calculate(string_infix)
return the num calculated

###addFormulas(formulas)
add custom formulas to the calculator,and the formula rule is looks like that{'key' => '$1+$2+$3'},key(1,2,3),default formula function has sqrt:'$1*$1' right now,its working on

##TODO
* ~~support custom calculate function like "cos() sin()..." and also what you like to custom~~
* support for calculator formula loop with formulas,like sqrt(10+20)


##License
MIT © billyct
