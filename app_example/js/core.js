var Core = (function(){

	var _callback = 0;
	var _vars = {
        dateActual: new Date(),
    };
	var _cacheObject = {};
	var _inProgressObject = {};

	window.addEventListener('jsonp_callback', function(){
		if( !(arguments[0].detail in _inProgressObject) )
			return;
		for(var i = 0; i < _inProgressObject[arguments[0].detail].length; i++){
			_inProgressObject[arguments[0].detail][i].resolveSuccess(_cacheObject[arguments[0].detail]);
		}
		delete _inProgressObject[arguments[0].detail];
    });

	//Construct
	var Core = function(){

	};

	Core.prototype = {
		/*
		* @return values => Object
		*
		* @param variable => String
		* @return value => String
		*
		* @param variable => String
		* @param value => String
		*/
		coreVars: function(){
			if(arguments[0]===undefined){
				return _vars;
			}else if(arguments[1]===undefined){
				return _vars[arguments[0]];
			}else{
				_vars[arguments[0]] = arguments[1];
			}
		},
		/*
		* @param url => String
		* @param callback => function(data)
		*/
		jsonp: function(){

			var q = new Promise;
			var args = arguments;

			if (args[0] in _cacheObject) {
				q.resolveSuccess(_cacheObject[args[0]]);
                return q;
			}else if(args[0] in _inProgressObject){
				_inProgressObject[args[0]].push(q);
				return q;
			}

			var callbackName = 'jsonp_callback_' + _callback;
			_inProgressObject[args[0]] = [];
			_callback++;

			var script = document.createElement('script');
            script.src = args[0] + (args[0].indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
            script.async = true;

            var self = this;
            window[callbackName] = function() {
                _cacheObject[args[0]] = arguments[0];
                document.body.removeChild(script);
            		q.resolveSuccess(arguments[0]);
            //Evento para evitar peticiones iguales simultáneas
            	self.fireEvent('jsonp_callback', args[0]);
            };
            script.onerror = function(){
                document.querySelector('[src="'+script.src+'"]') && document.body.removeChild(script);
                delete _inProgressObject[args[0]];
                q.resolveError();
            };

            document.body.appendChild(script);

	        return q;
		},
		/*
		* @param url => String
		*/
		get: function(){
			var q = new Promise;
			var req = new XMLHttpRequest();

			req.open("GET", arguments[0], true);
			req.send();

			req.onload = function(){
				if(req.status >= 200 && req.status < 400){
					q.resolveSuccess(req.response);
				}else{
					q.resolveError({
						status: req.status,
						statusText: req.statusText,
						responseURL: req.responseURL
					});
				}
			};

			return q;
		},
		/*
		* @param name => String
		* @param data => String|Array|Object
		* @param element @optional => Node Element
		*/
		fireEvent : function () {
			var evt = document.createEvent("CustomEvent");
			evt.initCustomEvent(arguments[0], false, false, arguments[1]);
			(arguments[2] && arguments[2].dispatchEvent(evt)) || window.dispatchEvent(evt);
		},
		/*
		* @param name => String
		* @param value => String
		* @param days => Int
		*/
		setCookie: function(){
			var exdate=new Date();

	    exdate.setDate(exdate.getDate() + arguments[2]);

	    var c_value = escape(arguments[1]) + ((arguments[2]==null) ? "" : "; expires="+exdate.toUTCString());

	    document.cookie=arguments[0] + "=" + c_value;
		},
		/*
		* @param name => String
		* @returns String
		*/
		getCookie: function(){
			var search = arguments[0] + "="
		    var cookie = "";

		    if (document.cookie.length > 0) {
		        offset = document.cookie.indexOf(search)

		        if (offset != -1) {
			        offset += search.length
			        end = document.cookie.indexOf(";", offset);

		        if (end == -1) end = document.cookie.length;
		          cookie=unescape(document.cookie.substring(offset, end))

		        }
		    }
		    return cookie;
		},
		/*
		* @param name => String
		* @returns String
		*/
		getParam: function(){
			var vars = window.location.search.substring(1).split("&");
			var params = {};
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if (arguments[0] && (pair[0] == arguments[0])) {
					return pair[1];
				}
				params[pair[0]] = pair[1];
			}
			return arguments[0]===undefined && params;
		},
		/*
		* @param name => String
		* @returns String
		*/
		getHash: function(){
			return window.location.hash.substring(1) || undefined;
		},
		/*
		* @param functions => Array
		*/
		populateAPI: function(){
			var args = arguments;
			for (var i in args[0]) {
                (function (i) {
                    var self = this;
                    self[i] = function () {
                        var q = new Promise;
                        var url = args[0][i]['url'];
                        var jIndex = 0;
                        for(j in args[0][i]['parameters']){
                        if((arguments[jIndex] || args[0][i]['parameters'][j])){
                            url += (url.indexOf('?') === -1 ? '?' : '&') + j + '=' + encodeURIComponent(
                                arguments[jIndex] ||
                                (args[0][i]['parameters'][j] instanceof Function && args[0][i]['parameters'][j].call(this) ) ||
                                args[0][i]['parameters'][j]
                            );
                        }
                        jIndex++;
                        }
                        self.jsonp(url).then(function(){

                            if(arguments[0].success !== false)
                                q.resolveSuccess(arguments[0]);
                            else
                                q.resolveError(arguments[0]);

                        }, q.resolveError);

                        return q;
                    }
                }.call(this, i));
    	    }
		}
	};

	return Core;

})();
