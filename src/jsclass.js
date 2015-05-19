/*
 * JSClass v1.0
 * Copyright (c) 2015, rndlabs
 * Released under MIT license
 */
(function(){
	var JSClass = {
		/*
		 * Private
		 * @param {String} value
		 * @return {Boolean} isUpperCase
		 */
		isUpperCase : function(value){
			return value == value.toUpperCase();
		},
		/*
		 * Private
		 * @param {Object} value
		 * @return {Boolean} isConstructor
		 */
		isConstructor : function(value){
			return value.hasOwnProperty('prototype');
		},
		/*
		 * Private
		 * @param {Object} object
		 * @param {String} key
		 * @return {Object} context;
		 */
		defineContext : function(object, key){
			return this.isUpperCase(key) && !this.isConstructor(object)? object.constructor : object;
		},
		/*
		 * Private
		 * Copy single property to an object
		 * @param {Object} target
		 * @param {Object} object
		 * @param {String} key
		 */
		xcopy : function(target, object, key){
			var context = this.defineContext(target, key);
			context[key] = object[key];
		},
		/*
		 * Private
		 * Copy all property from an object to another object
		 * @param {Object} target
		 * @param {Object} object
		 * @param {String|Array} excludes [optional]
		 * @return {Object} target
		 */
		copy : function(target, object, excludes){
			if(excludes){
				for(var key in object){
					var condition =
					typeof excludes === 'string'
					? key !== excludes
					: (typeof excludes === 'object'
						&& excludes.length > 0
						? excludes.indexOf(key) < 0
						: false);

					if(condition){
						this.xcopy(target, object, key);
					}
				}
			}
			else{
				for(var key in object){
					this.xcopy(target, object, key);
				}
			}

			return target;
		},
		/*
		 * Public
		 * @param {Object} properties
		 * @return {Function} base;
		 */
		extend : function(properties){
			var base = function(options){
				if(this.copy){
					this.copy(this, options);
				}
				if(this.init){
					this.init.apply(this, arguments);
				}
			};
			this.copy(base, this);
			this.copy(base.prototype, this.prototype);
			this.copy(base.prototype, properties);

			return base;
		}
	};

	var Class = JSClass.extend({
		/*
		 * Public
		 * @param {String} property
		 * @return {?} value of property;
		 */
		get : function(property){
			var ctx = this.constructor.defineContext(this, property);
			return ctx[property];
		},
		/*
		 * Public
		 * @param {String|Object} properties
		 * @param {?} value [optional]
		 */
		set : function(properties, value){
			if(typeof properties === 'string'){
				var ctx = this.constructor.defineContext(this, properties);
				ctx[properties] = value;
			}
			else if(typeof properties === 'object'){
				this.constructor.copy(this, properties);
			}
		}
	});

	//export module
	if(typeof window == 'undefined'){
		if(typeof exports == 'object'){
			module.exports = Class;
		}
	}
	else{
		window['JSClass'] = Class;
	}

	if ( typeof define === "function" && define.amd ) {
		define('jsclass', [], function() {
			return Class;
		});
	}
})();

/**********Array indexOf Polyfill**********/
(function(){if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(elt /*, from*/){
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0)? Math.ceil(from) : Math.floor(from);
		if (from < 0)
			from += len;

		for(; from < len; from++){
			if (from in this && this[from] === elt)
			return from;
		}
		return -1;
	};
}})();