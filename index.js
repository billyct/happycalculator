var calculator = require('./libs/calculator');
console.log(calculator.calculate('sqrt(sqrt(2+2))').toString());
module.exports = calculator;