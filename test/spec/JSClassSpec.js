describe('JSClass', function(){
	var JSClass;

	beforeEach(function(){
		var context = typeof window == 'undefined' &&  typeof exports == 'object'? exports : window;
		JSClass = context.JSClass;
	});

	it('should be exist', function(){
		expect(JSClass).toBeDefined();
		expect(typeof JSClass).toEqual('function');
		expect(JSClass.hasOwnProperty('prototype')).toBeTruthy();
	});

	it('should be able to check a string in uppercase or not', function(){
		var scenario = [
			'SOME_STATIC_VARIABLE',
			'some_static_variable',
			'Some_Static_Variable'
		]

		expect(JSClass.isUpperCase(scenario[0])).toBeTruthy();
		expect(JSClass.isUpperCase(scenario[1])).toBeFalsy();
		expect(JSClass.isUpperCase(scenario[2])).toBeFalsy();
	});

	it('should be able to check an object is constructor or not', function(){
		var scenario = [
			function(){},
			(function(){}).prototype,
			new (function(){})(),
			{},
			[],
			's',
			2,
			true
		]

		expect(JSClass.isConstructor(scenario[0])).toBeTruthy();
		expect(JSClass.isConstructor(scenario[1])).toBeFalsy();
		expect(JSClass.isConstructor(scenario[2])).toBeFalsy();
		expect(JSClass.isConstructor(scenario[3])).toBeFalsy();
		expect(JSClass.isConstructor(scenario[4])).toBeFalsy();
		expect(JSClass.isConstructor(scenario[5])).toBeFalsy();
		expect(JSClass.isConstructor(scenario[6])).toBeFalsy();
		expect(JSClass.isConstructor(scenario[7])).toBeFalsy();
	});

	it('should be able to get correct context', function(){
		var object = (function(){}).prototype;
		var scenario = [
			'SOME_STATIC_VARIABLE',
			'some_static_variable',
			'Some_Static_Variable'
		]

		expect((JSClass.defineContext(object, scenario[0])).hasOwnProperty('prototype')).toBeTruthy();
		expect((JSClass.defineContext(object, scenario[1])).hasOwnProperty('prototype')).toBeFalsy();
		expect((JSClass.defineContext(object, scenario[2])).hasOwnProperty('prototype')).toBeFalsy();
	});

	describe('when copying single property', function(){
		var target;
		var properties;

		beforeEach(function(){
			target = (function(){}).prototype;
			properties = {
				SOME_STATIC_VARIABLE : 5,
				init : function(){}
			};
		});

		it('should be able to copy static variable', function(){
			JSClass.xcopy(target, properties, 'SOME_STATIC_VARIABLE');
			expect(target.constructor.SOME_STATIC_VARIABLE).toEqual(properties.SOME_STATIC_VARIABLE);
		});

		it('should be able to copy variable', function(){
			JSClass.xcopy(target, properties, 'init');
			expect(target.init).toEqual(properties.init);
		});
	});

	describe('when copying properties', function(){
		var target;
		var properties;

		beforeEach(function(){
			target = (function(){}).prototype;
			properties = {
				SOME_STATIC_VARIABLE : 5,
				init : function(){},
				other : 'o',
			};
		});

		it('should be able to copy object', function(){
			JSClass.copy(target, properties);
			expect(target.constructor.SOME_STATIC_VARIABLE).toEqual(properties.SOME_STATIC_VARIABLE);
			expect(target.init).toEqual(properties.init);
			expect(target.other).toEqual(properties.other);
		});

		it('should be able to copy object exclude single string', function(){
			JSClass.copy(target, properties, 'other');
			expect(target.constructor.SOME_STATIC_VARIABLE).toEqual(properties.SOME_STATIC_VARIABLE);
			expect(target.init).toEqual(properties.init);
			expect(target.other).toBeUndefined();
		});

		it('should be able to copy object exclude multiple string', function(){
			JSClass.copy(target, properties, ['init','other']);
			expect(target.constructor.SOME_STATIC_VARIABLE).toEqual(properties.SOME_STATIC_VARIABLE);
			expect(target.init).toBeUndefined();
			expect(target.other).toBeUndefined();
		});
	});

	describe('when extending attribute', function(){
		var properties;
		var SomeClass;
		var SomeOtherClass;
		var someObj;
		var someObj2;
		var someOtherObj;
		var someOtherObj2;

		beforeEach(function(){
			properties = {
				SOME_STATIC_VARIABLE : 5,
				init : function(){},
				other : 'o',
			};
			SomeClass = JSClass.extend(properties);
			SomeOtherClass = SomeClass.extend({
				SOME_STATIC_VARIABLE : 'A',
				other : 'x'
			});
			someObj = new SomeClass();
			someObj2 = new SomeClass();
			someOtherObj = new SomeOtherClass();
			someOtherObj2 = new SomeOtherClass();
		});

		it('should be able to extend properties', function(){
			expect(SomeClass.SOME_STATIC_VARIABLE).toEqual(properties.SOME_STATIC_VARIABLE);
			expect(SomeClass.prototype.init).toEqual(properties.init);
			expect(SomeClass.prototype.other).toEqual(properties.other);
			expect(someObj.constructor.SOME_STATIC_VARIABLE).toEqual(properties.SOME_STATIC_VARIABLE);
			expect(someObj.init).toEqual(properties.init);
			expect(someObj.other).toEqual(properties.other);
		});

		it('should be able to get properties', function(){
			expect(someObj.get('SOME_STATIC_VARIABLE')).toEqual(properties.SOME_STATIC_VARIABLE);
			expect(someObj.get('other')).toEqual(properties.other);
		});

		it('should be able to set properties', function(){
			someObj.set('other', 'x');
			expect(someObj.get('other')).toEqual('x');
			someObj.set({other:'y'});
			expect(someObj.get('other')).toEqual('y');
			someObj.set('SOME_STATIC_VARIABLE', 3);
			expect(someObj.get('SOME_STATIC_VARIABLE')).toEqual(3);
			someObj.set({SOME_STATIC_VARIABLE : 4});
			expect(someObj.get('SOME_STATIC_VARIABLE')).toEqual(4);
		});

		it('should be able to override properties', function(){
			expect(someObj.constructor.SOME_STATIC_VARIABLE).toEqual(5);
			expect(someOtherObj.constructor.SOME_STATIC_VARIABLE).toEqual('A');

			expect(someObj.other).toEqual('o');
			expect(someOtherObj.other).toEqual('x');
		});

		it('should be able to have static properties', function(){
			expect(SomeClass.SOME_STATIC_VARIABLE).toEqual(5);
			expect(someObj.constructor.SOME_STATIC_VARIABLE).toEqual(5);
			expect(someObj2.constructor.SOME_STATIC_VARIABLE).toEqual(5);

			someObj.set('SOME_STATIC_VARIABLE', 3);

			expect(SomeClass.SOME_STATIC_VARIABLE).toEqual(3);
			expect(someObj.constructor.SOME_STATIC_VARIABLE).toEqual(3);
			expect(someObj2.constructor.SOME_STATIC_VARIABLE).toEqual(3);

			expect(SomeOtherClass.SOME_STATIC_VARIABLE).toEqual('A');
			expect(someOtherObj.constructor.SOME_STATIC_VARIABLE).toEqual('A');
			expect(someOtherObj2.constructor.SOME_STATIC_VARIABLE).toEqual('A');

			SomeOtherClass.prototype.set('SOME_STATIC_VARIABLE', 'B');

			expect(SomeOtherClass.SOME_STATIC_VARIABLE).toEqual('B');
			expect(someOtherObj.constructor.SOME_STATIC_VARIABLE).toEqual('B');
			expect(someOtherObj2.constructor.SOME_STATIC_VARIABLE).toEqual('B');
		});

		it('should be able to prototype properties', function(){
			expect(someObj.other).toEqual('o');
			expect(someObj2.other).toEqual('o');

			someObj.set('other', 's1');
			someObj2.set('other', 's2');

			expect(someObj.other).toEqual('s1');
			expect(someObj2.other).toEqual('s2');

			expect(someOtherObj.other).toEqual('x');
			expect(someOtherObj2.other).toEqual('x');

			someOtherObj.set('other', 's3');
			someOtherObj2.set('other', 's4');

			expect(someOtherObj.other).toEqual('s3');
			expect(someOtherObj2.other).toEqual('s4');
		});
	});
});