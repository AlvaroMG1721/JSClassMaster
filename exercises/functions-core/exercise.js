// the greeter function returns a simple message. 
//
// use default parameters to fulfil the contract. The default
// greeting should be 'hi'
//
// @type greeter = (person: string, greeting?: string) => string


exports.greeter = function(greeting = 'hi', person) {
  return greeting + " " + person;
};


// logger(count, args);
// return a function that will:
//
// TODO - calls fn with arguments the returned function is provided
// TODO - report to logger with the count of calls, and the arguments
//
// @type exports.spy = (fn: Function, logger: Function) => Function
exports.spy = function(fn, logger) {
	let count = 0;
  return (...args) => {
  	fn(...args);
  	count += 1;
  	logger(args, count);
  }
};


// function testReturnHi () {
// 	return 'hi';
// }