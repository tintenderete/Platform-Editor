
App.Editor = function(m){
	/* Editamos nombre del modo para poder diferenciarlo */
	this.name = "Editor";
	/* Creamos el objeto raton para poder pasar datos entre los modelos canvas */
	var mouse = new App.mouse();
	/* Variable que define en que canvas se ha hecho click */
	var currentCanvas;
	/* Si le pasamos un mapa crea un mapa, si no crea maap en blanco*/
	var map = m;
					/********************* 
					*	BLOCKS CANVAS    *
					**********************/

	/* Creamos y configuramos el canvas Blocks */
	/* - Array de entidades : */
	var map_blocks_config = {
		columns: 1,
		rows: blocks.get_listModels().length,
		blockSize: App.block_Canvas.canvas.width
	};
	var entities_blocks = map_blocks.set_map_blocks(
		map_blocks_config ,
		blocks.get_listModels());
	/* Guardamos el raton junto al resto de entidades para poder detectar colisiones */
	entities_blocks.push(mouse);
	/* Creamos y configuramos el grid del Blocks para detectar colisiones */
	var grid_blocks = new App.grid();
	grid_blocks.config({
		cellSize: App.block_Canvas.canvas.width ,
		canvas_w: App.block_Canvas.canvas.width  ,
		canvas_h: App.block_Canvas.canvas.height
	});
					/********************* 
					*	MAIN CANVAS    *
					**********************/
	/* Creamos y configuramos el canvas */
    var map_main_config = {
		columns: App.Game.config.map.columns,
		rows: App.Game.config.map.rows,
		blockSize: App.Game.config.map.blockSize
	};
	/* - Array de entidades : */
	var entities_main;
	if(map){
		entities_main = map_blocks.set_map_blocks(
			map_main_config,
			map);
	}else{
		entities_main = map_blocks.set_map_blocks(
			map_main_config);
	}
	/* Guardamos el raton junto al resto de entidades para poder detectar colisiones */
	entities_main.push(mouse);
	/*  Config Grid */
	var grid_main = new App.grid();
	grid_main.config({
		cellSize: App.Game.config.grid.cellSize ,
		canvas_w: App.Game.config.grid.canvas_w  ,
		canvas_h: App.Game.config.grid.canvas_h
	});
		/*------------------------------------------------------------*/

	/* 
	Coje nuestro objeto mouse.
	Busca con que objeto colisiono (Donde se hizo click)
	En funcion de en que canvas se hizo click, guarda la informacion o se la transmite al objeto
	*/
	var controlColision = function(list){
		var mouse;    
        if(!mouse){
            for (var i = 0; i < list.length; i++) {
                if(list[i].name === "mouse"){
                    mouse = list[i]; 
                }
            }
        };
        for (var i = 0; i < list.length; i++) {
            if(list[i].name !== "mouse"){
                if(currentCanvas === "blocks"){
	                if(grid_blocks.colision.rect_rect(list[i], mouse)){
	                   	mouse.set_container(list[i].type);
	                   	return	
	                }
	            }else{
	            	if(grid_main.colision.rect_rect(list[i], mouse)){
	                	list[i].type = mouse.get_container();
	                	App.main_Canvas.set_entities(entities_main);
	                	App.main_Canvas.draw();
	                	App.main.set_current_map(entities_main);
	                	return
	                }
	            }
	        
    		}
	    }
	}; 
	/* Controlador que le pasamos al modelo canvas */
	var mousedown = function(evt, t){
		currentCanvas = t.id;
		mouse.set_coors_canvas(evt, t);
		if (t.id === "blocks"){
			grid_blocks.narrow_phase(entities_blocks, controlColision);
		}else {
			grid_main.narrow_phase(entities_main, controlColision);
		}
	};
	
		///////
	App.block_Canvas.set_entities(entities_blocks);
	App.block_Canvas.draw();
	App.main_Canvas.set_entities(entities_main);
	App.main_Canvas.draw();
		//////

	App.main_Canvas.remove_allEvents();
	App.block_Canvas.remove_allEvents();
		
	App.block_Canvas.set_event("mousedown", mousedown);
	App.main_Canvas.set_event("mousedown", mousedown);



};


