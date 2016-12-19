var Promise = (function() {

	//construct
	var Promise = function(){

	}

	Promise.prototype = {

		resolveSuccess : function(){
			if(this.successFn){
				this.successFn(arguments[0]);
			}else{
				this.successArguments = arguments[0];
			}
		},
		resolveError : function(){
			if(this.errorFn)
				this.errorFn(arguments[0]);
		},
		then : function(){
			this.successFn = (arguments[0] || false);
			this.errorFn = (arguments[1] || false);
			// console.log(this);

			if(this.successArguments){
				var self = this;
				setTimeout( function() {
					self.successFn(self.successArguments);
				},0);
			}
		},
	}

	return Promise;
		
})();