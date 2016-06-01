

App.mouse = function(){
	

	var container = "";
	this.name = "mouse";
	this.x;
	this.y;
	this.width = 1;
	this.height = 1;
	this.set_container = function(e){
		container = e;
	};

	this.get_container = function(){
		return container;
	};

	this.set_coors = function(evt) {
		this.x = evt.pageX - canvas.offsetLeft;	
		this.y = evt.pageY - canvas.offsetTop;
		console.log(this.x, this.y);
	};
	this.set_coors_canvas = function(evt, canvas) {
		var rect = canvas.getBoundingClientRect();
		this.x = evt.clientX - rect.left;	
		this.y = evt.clientY - rect.top;
		//console.log("c: ", this.x, this.y);
	};
	

	
};

