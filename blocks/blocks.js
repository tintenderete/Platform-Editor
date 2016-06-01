
/*
Clase modelo. Pinta los bloques

Dibuja la informacion que traen arrays previamente configurados con la
clase grid.

draw_blocks({
	ctx : contexto del canvas,
	array: array de donde substraemos la informacion para 
		saber que y como dibujar
})

draw_model : objeto con los metodos para dibujar segun tipos,
	utilizado por la funcion draw_blocks.

lit_model : lista con todos los modelos actuales.
*/
var blocks = {};

blocks = function(){
	var config = {
			gravity: 8,
			jump: {
				trigger: true,
				available: false,
				force: 0,
				FORCE: 20,
				DECELERITY: 0.9
			},
			move: {
				left_wall_jump: 0,
				right_wall_jump: 0,
				WALL_JUMP: 9,
				FORCE: 8,
				left: 0,
				right: 0,
				DECELERITY: 0.9
			}
	};
 	var that = {};
 	var draw_model, list_model, draw_map;
 	var Block;
 	var grid = new App.grid();
 	list_model = ["no_one","wall", "bad_wall"];
 	var grid = new App.grid();
 	/*
	obj{
		name: ..,
		func: ..	
	}
 	*/
 	that.new_model= function(obj){
 		list_model.push(obj.name);
 		draw_model[obj.name] = obj.func;
 	}
 	/***************************
	*		GRAVITY           *
 	***************************/
 	that.Gravity = function(){
 		var that = {},
 			gravity = config.gravity;

 		that.gravity_on_object = function(obj){
 			obj.y += gravity;
 		};

 		return that
 	}();

 	/*
			END GRAVITY
 	*/
 	/***********************
	*		CLASE Block     *
 	************************/
 	
 	/***********************
	*		CLASE Block     *
 	************************/
	
	Block = function(){};

	Block.factory = function (obj, type) {
		var aux = function(obj){
			this.x = obj.x;
			this.y = obj.y;
			this.id = obj.id;
			this.type =  obj.type;
			this.width = obj.width;
			this.height = obj.height;
			this.pos_ini = {x: obj.x, y: obj.y};
			//test
			this.color = "#B45F04";
			this.color_original	= "#B45F04";
			//fin test
			},
			newblock;

		if(Block[type]){
			aux.prototype = new Block[type]();
		}
		
		// create a new instance
		newblock = new aux(obj);
		//Sets
		if(newblock.set){
			newblock.set();
		};
		return newblock;
		};

	/* Blocks types :  */
	 /* 
	 	- Block type Character:
	 */

	Block.verde = function(){
		/* 
		Parametros aqui definidos afectan a todos los elementos heredados a la vez, es decir
		Si cambiara a false, gravity, cambiaria el de todos los elementos qye hayan heredado 
		gravity
		*/
		
	};
	Block.verde.prototype = {
		collision: true,
		collision_box: {
			to_wall:{
				left: {x: true, y: true, width: 1, height: true},
				right: {x: true, y: true, width: 1, height: true}
			}
		},
		trigger: true,
		gravity: true,
		gravity_force: config.gravity,
		jump_: config.jump,
		move: config.move,
		last_pos: {},
		check_col_box_wall: function(alter){
			var alter = alter;
			this.collision_box.to_wall.left.x = this.x - 1;
			this.collision_box.to_wall.left.y = this.y;
			this.collision_box.to_wall.right.x = this.x + this.width;
			this.collision_box.to_wall.right.y = this.y;
			this.collision_box.to_wall.right.height = this.height;
			this.collision_box.to_wall.left.height = this.height;
			if(grid.colision.rect_rect(this.collision_box.to_wall.left, alter)){
				return "right"
			};
			if(grid.colision.rect_rect(this.collision_box.to_wall.right, alter)){
				return "left"
			};
			return false
		},
		dead: function(){
			this.x = this.pos_ini.x;
			this.y = this.pos_ini.y;
			//console.log("has muerto");
		},
		update_last_pos: function(){
			this.last_pos = {x: this.x, y: this.y};
		},
		reset_jump: function(){
			this.jump_.available = false;
		},
		update_next_jump: function(upd){
			this.jump_.available = upd;
			//console.log(this.jump_.available);
		},
		update_move_left: function(){
			this.move.left = this.move.FORCE;
			
		},
		update_move_right: function(){
			this.move.right = this.move.FORCE;
		},
		update_jump_force: function(){
			if(this.jump_.available){
				this.jump_.force = this.jump_.FORCE;
				if(this.jump_.available == "left"){
					this.move.left_wall_jump = this.move.WALL_JUMP; 
				}
				if(this.jump_.available == "right"){
					this.move.right_wall_jump = this.move.WALL_JUMP; 
				}
			}
			
		},
		update_pos: function(){
			this.x = this.x - this.move.left + this.move.right - this.move.left_wall_jump + this.move.right_wall_jump ;
			this.y = this.y - this.jump_.force;
			this.move.left *= this.move.DECELERITY;
			this.move.right *= this.move.DECELERITY;
			this.jump_.force *= this.jump_.DECELERITY;
			this.move.left_wall_jump *= this.move.DECELERITY;
			this.move.right_wall_jump *= this.move.DECELERITY;
		},
		reset_move: function(){
			this.move.right = 0;
			this.move.left = 0;
			this.move.left_wall_jump = 0;
			this.move.right_wall_jump = 0;
		},
		reset_jump_force:function(){
			this.jump_force = 0;
		}
	};
	Block.wall = function(){};
	Block.wall.prototype = {
		collision: true,
		gravity: false,
		move: false,
		voronoi: null ,
		voronoi_corners: null,
		set: function(){
			this.voronoi = grid.voronoi.set(this);
			this.voronoi_corners = grid.voronoi.set_corners(this);
		}
	};
	Block.bad_wall = function(){};
	Block.bad_wall.prototype = {
		collision: true,
		dead: true,
		gravity: false,
		move: false,
		voronoi: null ,
		voronoi_corners: null,
		set: function(){
			this.voronoi = grid.voronoi.set(this);
			this.voronoi_corners = grid.voronoi.set_corners(this);
		}
	}
	
	
	

	/*
			FIN CLASE BLOCK
 	*/

	draw_model = {
		no_one: function(ctx, obj, blockSize){
			ctx.beginPath();
	        ctx.rect(obj.x, obj.y, blockSize, blockSize);
	        ctx.fillStyle = "#2EFEF7" ; 
	        ctx.fill();
	        
	        ctx.lineWidth = 0.5;
	        ctx.strokeStyle = 'black';
	        ctx.stroke();

	        
		},
		wall: function(ctx, obj, blockSize){
			ctx.beginPath();
	        ctx.rect(obj.x, obj.y, blockSize, blockSize);
	        ctx.fillStyle = obj.color ; 
	        ctx.fill();
	        ctx.fillStyle = "#FF0040" ;
		},
		bad_wall: function(ctx, obj, blockSize){
			ctx.beginPath();
	        ctx.rect(obj.x, obj.y, obj.width, obj.height);
	        ctx.fillStyle = "#FE2EF7" ; 
	        ctx.fill();
		}
	};


	that.draw_blocks = function(ctx, arry){
		for (var i = 0; i < arry.length; i++) {
			if(arry[i].type){
				draw_model[arry[i].type](ctx, arry[i],arry.blockSize);
			}	
		};
	};
	that.get_listModels = function(){;
		return list_model;
	};
	that.Block = Block;
	return that
}();


// Nuevos modelos
blocks.new_model({
	name: "verde",
	func: function(ctx, obj, blockSize){
			ctx.beginPath();
	        ctx.rect(obj.x, obj.y, obj.width, obj.height);
	        ctx.fillStyle = "#01DF01" ; 
	        ctx.fill();
		}
});

