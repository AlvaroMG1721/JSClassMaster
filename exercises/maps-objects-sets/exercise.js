// TODO function passed to incoming will be called
// a number of times with different event strings
//
// return the number of times an event has been
// called on each event
//
//
// try ES5 and ES6 implementations
//
exports.getCount = function(incoming) {

	var newMap = new Map;

  incoming(function(event) {
  	;
  	if (!newMap.has(event)) {
  		newMap.set(event, 0);
  	}
  	newMap.set(event, newMap.get(event)+1);
  	// console.log('event', event);

    // TODO
    return newMap.get(event);
  })
  
};

// TODO function passed to incoming will be called
// a number of times with different event/ip combinations
//
// return the unique set of IPs for each event on each event,
// as maps or arrays
//
// try ES5 and ES6 implementations
//
exports.getIpSets = function(incoming) {


  incoming(function(event, ip) {

    // TODO
    return [];
  })
};

