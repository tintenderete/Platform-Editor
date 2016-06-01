
/*
obj = {
	id: ,
	width: ,
	height: ,
	events: {
		mousedown: ,
		mouseup: ,
		onkeydown: ,
		onkeyup: ,
	},

}
*/

App.Canvas = function(obj){
	var events;
	var entities = [];
	
	this.id = obj.id;
	this.canvas = document.getElementById(obj.id);
	this.context = this.canvas.getContext('2d');
	

	if(!this.canvas){
		console.log("No se ha encontrado un canvas con este Id");
		return
	};

	this.canvas.width = obj.width || null;
	this.canvas.height = obj.height || null;

	if(!this.canvas.width || !this.canvas.height){
		console.log("El canvas no tiene height o width")
	};
	

	events = {
		mousedown: function(evt){} || obj.events.mousedown,
		mouseup: function(evt){} || obj.events.mouseup,
		onkeydown: function(evt){} || obj.events.onkeydown,
		onkeyup:function(evt){} || obj.events.onkeyup
	};
	
	if(events.mousedown){
		document.getElementById(this.id).addEventListener('mousedown', function(evt) {  
	    	events.mousedown(evt, this );
		}, false);
	};
	if(events.mouseup){
		document.getElementById(this.id).addEventListener('mouseup', function(evt) {  
	    	events.mouseup(evt, this);
		}, false);
	};
	if(events.onkeydown){
		document.onkeydown = function(evt) {  
	    	events.onkeydown(evt);
		};
	};
	if(events.onkeydown){
		document.onkeyup = function(evt) {
			events.onkeyup(evt);
		}
	};
	

	this.set_event = function(e, func){
		if(!events[e]){
			console.log("No se ha encontrado ningun event con ese nombre")
			return
		};
		if(typeof func !== 'function'){
			console.log("El segundo parametro debe ser una funcion");
			return
		};
		events[e] = func;
	};
 	this.remove_allEvents = function(obj){
 		events = {
			mousedown: function(evt){} || obj.mousedown,
			mouseup: function(evt){} || obj.mouseup,
			onkeydown: function(evt){} || obj.onkeydown,
			onkeyup:function(evt){} || obj.onkeyup
		};
 	};
	this.remove_event = function(e){
		if(!events[e]){
			console.log("No se ha encontrado ningun event con ese nombre")
			return
		};
		events[e] = function(){};
	};
	this.set_entities = function(e){
		entities = e;
	};
	this.get_entities = function(){
		return entities;
	};
	this.draw = function(){
		blocks.draw_blocks(this.context, entities);
		return true
	};
	/* Marco para el canvas */
    this.context.rect(0, 0, this.canvas.width, this.canvas.height);
    this.context.lineWidth = 10;
    this.context.strokeStyle = 'black';
    this.context.stroke();
    this.clean_canvas = function(){
    	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
	console.log("Canvas finalizado");
};




