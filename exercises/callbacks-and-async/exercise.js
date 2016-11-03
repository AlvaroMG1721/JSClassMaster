// TODO 
//
//   write a method that implements
//   sampling a query stream
//
//   it should listen to 'n' queries, then
//   report to cb with the following object:
//
//       {
//         queries: [],
//         cumulativeDuration: [],
//       }
//
//   it should also disconnect from the 'query' events on queryStream
//
//   cumlative duration should be in the order the queries started,
//
//   e.g this scenario would result in the following result
//
//       NAME     START    END     DURATION     CUMLATIVE DURATION
//       query 1: 0        50      50           50
//       query 2: 5        10      5            55
//       query 3: 10       60      50           105
//
//   the result:
//
//       {
//         queries: [q1,q2,q3]
//         durations: [50, 5, 10],
//       }
//
//   be careful - there's no guarantee the query which
//   starts first, will end first!
//
//   Both queryStream and queries emit events you can 
//   subscribe to via the `.on` method:
//
//       queryStream.on("query", function(query, startTime) {
//         query.on("end", function(endTime) {
//           
//         });
//       })
//
//   be sure to ignore further queries after the first `n`
//
exports.sampleQueries = function(queryStream, n, cb) {

	const queries = [];
	const endTimes = new Map;
	const startTimes = new Map;
	const durations = [];

  queryStream.on("query", queryHandler);

  function queryHandler(query, time) {
  	if (queries.length >= n) {
  		return;
  	};

  	queries.push(query);
  	startTimes.set(query.id, time);

    console.log(`start id:${query.id} time:${time}`);

    query.on("end", (endTime) => endHandler(query, endTime));

    function endHandler (query, time) {

    	console.log(`end id:${query.id} time:${time}`);

    	if (endTimes.has(query.id)) {
      	cb(Error("hard duplicate end for query"));
      }else {
      	endTimes.set(query.id, time);
      	const duration = time - startTimes.get(query.id);
      	durations.set(query.id, duration);

      };
    }

    function endTime () {
  	  if (durations.size === n) {
    		cb({
    			durations: queries.map((q) => durations.get(q.id)),
    			queries: queries
    		})
    	};
    }
  }
}

