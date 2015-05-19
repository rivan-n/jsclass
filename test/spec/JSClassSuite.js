var c = ['|', '/', '--', '\\'];
var count = 0;
var timer = setInterval(function(){
	document.getElementById('c').innerHTML = c[count++%4];
}, 70);
var suite = new Benchmark.Suite('JSClass', {
	onCycle : function(){
		var result = '<ul>';
		for(var i=-1, len=this.length;++i<len;){
			var current = this[i];
			var elapsed = current.times.elapsed;
			result += '<li>' + current.name + '<br/>' + 'Ran: ' + current.count + '<br/>' + 'Time Elapsed: ' + elapsed + 's' + '<br/>' + 'Velocity: ' + current.hz + 'hz' + '</li>';
		}
		result += '</ul>';
		clearInterval(timer);
		document.getElementById('text').innerHTML = result;
	}
})
.add('JSClass', function(){
	JSClass.extend({test:'test'});
})
.run({async:true});