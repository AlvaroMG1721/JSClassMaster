var Utils = (function(){

    /*
    * @Polyfill for bind.
    */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
        };
    }
	
    var Utils = function(){

		//for(i in fn){
		//	this[i] = fn[i];
		//}

    };

    Utils.prototype = {
        /*
        * @param url => String
        * @param params => String
        * @param hash => String
        *
        * @return url => String
        */
        urlNormalizer: function(){
            var hashRegex = /\#[^\?]*/g;
            var paramRegex = /\?[^\#]*/g;
            var urlRegex = /[^(\#)|(\?)]*/g;
            var hash = hashRegex.exec(arguments[0]) || '';
            var param = paramRegex.exec(arguments[0]) || '';
            var url = urlRegex.exec(arguments[0]) || '';

            var newParam = '';
            var newHash = arguments[2] || '';

            if(arguments[1]){
                if(param[0]){
                    newParam = '&'+arguments[1];
                }else{
                    newParam = '?'+arguments[1];
                }
            }

            return (url[0] || '') + (param[0] || '') + newParam + (hash[0] || '') +newHash ;
        },
        /*
        * @param {string|array} keyRoute
        * @param {object} scope
        *
        * @return {string} value
        */
        loadKey: function(){
            if(arguments[0] === undefined || arguments[1] === undefined){ 
                console.error("utils.loadKey ERROR: You need to provide two arguments utils.loadKey(keyRoute, scope)", arguments);
                return '';
            }
            var scope = arguments[1];
            var keyRoute = arguments[0];
            if(typeof arguments[0] == 'string'){
                var keyRoute = [arguments[0]];
                if(~arguments[0].indexOf('.')) keyRoute = arguments[0].split('.');
            }
            
            if(scope[keyRoute[0]] === undefined){
                console.error("Key "+keyRoute[0]+" is undefined in the object ", scope);
                return '';
            }else if(keyRoute.length === 1){
                return scope[keyRoute[0]];
            }else{
                scope = scope[keyRoute[0]];
                keyRoute.shift();
                return this.loadKey(keyRoute, scope);
            }

        },

        /*
        * @param {string} html
        * @param {object} scope
        *	
        * @param {string} html
        */
        compile: function(){
            if(arguments[0] === undefined || arguments[1] === undefined){ 
                console.error("utils.compile ERROR: You need to provide two arguments utils.compile(html, scope)", arguments);
                return arguments[0];
            }
            var html = arguments[0];
            var scope = arguments[1];
            var regEx = /\[\[(.*?[\s\S])\]\]/g;
            var value = '';

            while((betweenBrackets = regEx.exec(html)) !== null) {
                try{
                    var evaluate = betweenBrackets[1].trim();
                    var re = /(\b[^\s\|\&\(\)]+\b)/g;
                    while((b = re.exec(betweenBrackets[1].trim())) !== null){
                        evaluate = evaluate.replace(new RegExp(b[0], 'g'), 'scope.'+b[0]);
                    }
                    value = eval(evaluate);
                }catch(e){
                    console.error("Eval error:", e);
                    value = this.loadKey(betweenBrackets[1].trim(), scope);
                }
                html = html.replace(new RegExp(this.escapeRegExp(betweenBrackets[0]), 'g'), value);
            }

            if(html.match(regEx)){
                html = this.compile(html, arguments[1]);
            }

            return html;
        },
        escapeRegExp: function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }

	};

    return Utils;

})();




