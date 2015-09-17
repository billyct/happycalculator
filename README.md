# happycalculator ![image of travis-ci](https://travis-ci.org/billyct/happycalculator.svg)
calculator for natural formula like "1+2+3" for result 6 

[中文](https://github.com/billyct/happycalculator/blob/master/readme_zh.md)

##Install
``` $ npm install --save happycalculator ```

##Usage
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

##API
###convert(string_infix)
return an array that split with "+-*/",and if the string with values(example:a,ab,cos(20)) also that will be ok

###shunt(string_infix)
return an array postinfx that with the [Shunting-yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) converted,the core code was written from [rosettacode](https://rosettacode.org/wiki/Parsing/Shunting-yard_algorithm#JavaScript) and i change some code for the project

###calculate(string_infix)
return the num calculated

###TODO
* support custom calculate function like "cos() sin()..." and also what you like to custom


##License
MIT © billyct
