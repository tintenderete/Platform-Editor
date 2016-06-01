App.Game = {};


App.Game = function(_map){
	// FULL SCREEN
		var fullscreen = function(){
			var el = document.getElementById('main');

			if(el.webkitRequestFullScreen) {
				el.webkitRequestFullScreen();
			}
			else {
				el.mozRequestFullScreen();
			}            
		};
	var pressing = [],
		current_map, 
		//mouse, 
		map_config, entities,
		grid,
		logic, paint,
		start_game,
		player = {};
		loop_door = true;

	var _load = function(call_back){
		
		/* Editamos nombre del modo para poder diferenciarlo */
		this.name = "Game";
		/* Le pasamos el mapa que queremos crear */
		current_map = _map;
		/* Creamos el objeto raton para poder pasar datos entre los modelos canvas */
		//mouse = new App.mouse();

						/********************* 
						*				    *
						**********************/

		/* - Array de entidades : */
		map_config = {
			columns: App.Game.config.map.columns,
			rows: App.Game.config.map.rows,
			blockSize: App.Game.config.map.blockSize
		};
		entities = map_blocks.set_map_blocks(
			map_config ,
			current_map,
			true);
		/* Guardamos el raton junto al resto de entidades para poder detectar colisiones */
		//entities.push(mouse);
		/* Creamos y configuramos el grid del Blocks para detectar colisiones */
		grid = new App.grid();
		grid.config({
			cellSize: App.Game.config.grid.cellSize ,
			canvas_w: App.Game.config.grid.canvas_w  ,
			canvas_h: App.Game.config.grid.canvas_h
		});
			/////////////

		App.main_Canvas.set_entities(entities);
		App.main_Canvas.clean_canvas();
		App.main_Canvas.draw();	
			////////////
						/********************* 
						*	    PLAYER 		 *
						**********************/			
		/* Puntero para poder acceder directamente a el */
		player = function(p){
			var aux;
			for (var i = 0; i < entities.length; i++) {
				if(entities[i].type === "verde"){
					aux = entities[i];

				};
			};
			return aux;
		}();
		player.pos_ini = {x: player.x, y:player.y};
		

		
						/********************* 
						*	    EVENTS 		 *
						**********************/
		 
			
	 
		/////
		var loop_switch = function() {  
	    	loop_door = true;
		};
		var onkeydown = function(evt){
			loop_switch();
            pressing[evt.keyCode] = true;
		};
		var onkeyup = function(evt){
			pressing[evt.keyCode] = false;
		}
		App.main_Canvas.remove_allEvents();
		App.block_Canvas.remove_allEvents();
		App.main_Canvas.set_event("onkeydown", onkeydown);
		App.main_Canvas.set_event("onkeyup", onkeyup);

						/********************* 
						*	   LOGIC LOOP 	 *
						**********************/
		
		///// Actual useless
		var range_between_point = function(point1 , point2){
			var dx, dy, p1, p2;
			p1 = point1;
			p2 = point2;
			dx = p1.x - p2.x;
			dy = p1.y - p2.y;
			return (Math.sqrt(dx * dx + dy * dy))
		};
		////
		var what_voronoi_section = function(obj1, obj2){
			var one = obj1, 
				alter = obj2;
			//console.log(obj1, obj2);
	       	if(alter != null && one != null){
	            return(one.last_pos.x<alter.x+alter.w&&
	                one.last_pos.x+one.width>alter.x&&
	                one.last_pos.y<alter.y+alter.h&&
	                one.last_pos.y+one.height>alter.y);
	        }
		};
		
		
		
		var what_side_collision = function(object1, object2){
			var result;
			var sizes = ["up", "right", "down", "left"],
				corners = ["up_left", "up_right", "down_right", "down_left"];
			//console.log(object1, object2)
			var obj1 = object1,
				obj2 = object2;
			/*
				Si el objeto no se puede mover tendra un voronoi fijo, por lo que no 
				hace falta aztualizarlo, 
				en cambio:
			*/
			if(object2.move){
				obj2.voronoi = grid.voronoi.set(obj2);
			};
			/*
				Se busca en que area(X) se encontraba el obj1 antes de colisionar con obj 2
					  X
					X H X
					  X
			*/
			var aux;
			for (var i = 0; i < sizes.length; i++) {
				aux = what_voronoi_section(obj1, obj2.voronoi[sizes[i]]);
				//console.log( "detectados:" ,sizes[i]); 	
				if(aux){
					result = sizes[i]; 
					break
				}
			};
			/* 
				Caso hipotetico en que colsionen perfectamente en diagonal
				se comprueba las esquinas(X) 
					
					X X
					 H
					X X
			*/
			if(!result){
				//console.log("----------------alter-----------------");
				aux = false;
				if(object2.move){
					obj2.voronoi_corners = grid.voronoi.set_corners(obj2);
				};
				for (var i = 0; i < corners.length; i++) {
					aux = what_voronoi_section(obj1, obj2.voronoi_corners[corners[i]]);
					if(aux){
						result = corners[i];
						return
					}
				};
				//REsolucion de caso hipotetico
				switch(result){
					case "up_left":
						result = "up"
						break;
					case "up_right":
						result = "up"
						break;
					case "down_right":
						result = "down"
						break;
					case "down_left":
						result = "down"
						break;
				}	
			};
			//console.log(result);
			return result
		};
		var function_controlCollision = function(list){
			var side, entities_on_collision = []; 
			for (var i = 0; i < list.length; i++) {
				if(list[i].move){
					entities_on_collision = [];
					for (var j = 0; j < list.length; j++) {
						if(list[i] === list[j]){
							//No se comprueba colision con uno mismo 
						} else {
							/* ------ BROAD_PHASE --------*/
							if(grid.colision.rect_rect(list[i], list[j])){
								side = what_side_collision(list[i], list[j]);
								entities_on_collision.push({
									entitie: list[j],
									side: side
								});	
							};	
						}; //END ELSE --> if if(list[i] === list[j]
					}; // END 2º FOR
					/* ------COLISION RESOLUTION ----- */
					var ent = entities_on_collision;
					var height_total, dist, result;	 
					for (var k = 0; k < ent.length; k++) {
						if(ent[k].dead){
							player.dead();
							break;
						};
						if(list[i].collision && ent[k].entitie.collision){
							switch(ent[k].side){
								case "up":
									//console.log("-----up-----");
									height_total = list[i].height + ent[k].entitie.height;
									dist = (ent[k].entitie.y + ent[k].entitie.height) - list[i].y;
									result = height_total - dist;
									list[i].y -= result;
									// JUMP
									player.update_next_jump(true);
									break;
								case "right":
									//console.log("right");
									height_total = list[i].width + ent[k].entitie.width;
									dist = (list[i].x + list[i].width) - ent[k].entitie.x;
									result = height_total - dist;
									list[i].x += result;
									// JUMP
									player.reset_move();
									//player.update_next_jump(side);
									break;
								case "down":
									//console.log("down");
									height_total = list[i].height + ent[k].entitie.height;
									dist = (list[i].y + list[i].height) - ent[k].entitie.y;
									result = height_total - dist;
									list[i].y += result;
									//JUMP
									//player.update_next_jump(false);
									//player.reset_jump_force();
									break;
								case "left":
									//console.log("left");
									height_total = list[i].width + ent[k].entitie.width;
									dist = (ent[k].entitie.x + ent[k].entitie.width) - list[i].x;
									result = height_total - dist;
									list[i].x -= result;
									// JUMP
									player.reset_move();
									//player.update_next_jump(side);
									break;
							}// END SIWTCH
						}; // END iF colision 
					}; // ENDS FOR - COLISION RESOLUTION -
				} else { continue }; // END IF MOVE
			}; // END 1º FOR
			
			//Comprobamos si tiene alguna caja al lado para poder saltar o no lateralmente 
			var jump;
			if(player){
				for (var i = 0; i < list.length; i++) {
					jump = player.check_col_box_wall(list[i]);
					if(jump){
						player.update_next_jump(jump);
					}
				};
			};	
			
		};	// END FUNCTION function_controlCollision	

		logic = function(){
			//FPS
			FPS.update();
			//Update last_move
			for (var i = 0; i < entities.length; i++) {
				if(entities[i].move){
					entities[i].update_last_pos(); 
				}
			};
			// EVENTS 
			
			if(pressing[83]){
				player.update_jump_force();
			};

			if(pressing[78]){
				player.update_move_left();
			};
			if(pressing[77]){
				player.update_move_right();
			};
			player.update_pos();
			player.reset_jump();
			// ALL Entitities
			for (var i = 0; i < entities.length; i++) {
				if(entities[i].gravity){
					blocks.Gravity.gravity_on_object(entities[i]);
				}	
			};
			
			grid.narrow_phase(entities, function_controlCollision);


			paint();
			
			//loop_door = false;

		};
						/********************* 
						*	   LOGIC PAINT 	 *
						**********************/

		paint = function(){
			App.main_Canvas.clean_canvas();
			App.main_Canvas.draw();	
		};
		//FULL SCREEN
		//fullscreen();
		/* START GAME 
		Le doy unos segundos para que cague.
		*/
		setTimeout(call_back, 1000);
		
		
	}; /* END LOAD */

					/********************* 
					*	    LOOPS 		 *
					**********************/	
	var loop_paint, loop_logic;
	start_game = function(){
		/*
		loop_paint = setInterval(function(){
						paint();
					},App.Game.config.vel_draw);
		*/
		/*
		loop_logic = setInterval(function(){
						if(loop_door)
							logic();
						
					},App.Game.config.vel_logic);
		*/
		loop_logic = FPS.set_interval(logic);
	}

	this.stop_loop = function(){
		//clearInterval(loop_paint);
		clearInterval(loop_logic);
	};
	
	
	_load(start_game);
};

App.Game.config = function(){
	return {
		grid: {
			cellSize: 90 ,
			canvas_w: App.main_Canvas.canvas.width  ,
			canvas_h: App.main_Canvas.canvas.height
		},
		map: {
			columns: 25,
			rows: 25,
			blockSize: 30
		},
		vel_logic : 1000/50,
		vel_draw : 1000/50,
	}
}();