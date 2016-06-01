/*

Clase que crea un grid configurable que indica que elementos de un array estan 
compatiendo una misma celda del grid. Para poder ses tratados celda por celda.

*/

App.grid = function(){

	var cellSize = 50,
		canvas_w = 500,
		canvas_h = 500,
		boxGrid,
		Cell;

	Cell = function(name){
		this.name = name;
		this.entities = [];
	};

	
	/*
	Check coordenadas
	*/
	var grid_column = function(x){
		return Math.floor(x / cellSize)
	};
	var grid_row = function(y){
		return Math.floor(y / cellSize)
	};
	/*
	Creamos el array de Cells --> boxGrid
	Cada elemento es un objeto Cell con el nombre de la celda 
	y un array para guardar los objetos que en esten posicionados en las 
	coordenadas correspondientes a esa Cell
	[
	00 10 20
	01 11 21
	02 12 22
	03 13 23
	]
	*/

	var do_boxGrid = function(){
		var arr = [],
			num_x, num_y;
		num_x = canvas_w / cellSize;
		num_y = canvas_h / cellSize;
		for (var i = 0; i < num_x; i++) {
			for (var j = 0; j < num_y; j++) {
				arr.push(new Cell("" + i + ""+ "," + "" + j + ""));
			};
		};
		boxGrid = arr
		return boxGrid
	};
	do_boxGrid();

	/*
	get_cells():
	Comprueba la coordenada de cada esquina del objeto (cuadrado), para saber de que celda 
	ocupa algun espacio

	'0'____'1'
	|		|
	|		|
	|		|
	|_______|
	'3'     '2'
	
	*/
	var get_cell = function(obj, list){
		var x, y, w, h, cell_x, cell_y, arr, aux;
		arr = [];
		x = obj.x;
		y = obj.y;
		w = obj.width;
		h = obj.height;
		/*0*/
		cell_x = grid_column(x);
		cell_y = grid_row(y);
		aux = "" + cell_x + ""+ "," + "" + cell_y + "";
		push_to_cell(obj, aux, list);
		/*1*/
		cell_x = grid_column((x + w));
		cell_y = grid_row(y);
		aux = "" + cell_x + ""+ "," + "" + cell_y + "";
		push_to_cell(obj, aux, list);
		/*2*/
		cell_x = grid_column(x + w);
		cell_y = grid_row((y + h));
		aux = "" + cell_x + ""+ "," + "" + cell_y + "";
		push_to_cell(obj, aux, list);
		/*3*/
		cell_x = grid_column(x);
		cell_y = grid_row((y + h));
		aux = "" + cell_x + ""+ "," + "" + cell_y + "";
		push_to_cell(obj, aux, list);
		
	};

	var push_to_cell = function(obj, coor, list){
		var that = false;
		/* 
		OPcion para asegurar que al guardar uno se sale de la funcion es meter todo
		 en if(that === false) y el if final como else.
		 
		 -Otra mejoria seria crear de nuevo el modelo de cajas contenedoras por zonas
		 creando un objeto con propiedades como nombre las coordenadas y dentro de ellas un array
		 para guardar las entidades que esten en el area.
		 ej: 
		 array{
			01 : [entitadades a colisionar]
		 }
		 elminariamos el primer for e if, buscando directamente en el segundo
		 for en la lista caja_nueva_idea[coor] en el seg. 
		 Pensar para hacerlo en el siguiente for.

		*/
		for (var i = 0; i < list.length; i++) {
			if(list[i].name === coor){
				for (var j = 0; j < list[i].entities.length; j++) {
					if(list[i].entities[j] === obj){
						that = true;
						return
					}
				};
				if(!that){
					list[i].entities.push(obj);
				}
			}
		};

	};
	/*
	narrow_phase(): 
		Recive una lista de objetos con {x,y,w,h}, y una funcion controlador (opcional).
		1- get_cell():
			- Se comprueba en que celda esta cada elemento .
			2- push_to_cell():
			- Se guardan dentro de nuestro array boxGrid en su celda correspondiente.
		3- narrow_phase():
			- Se comprueba que celda tiene mas de un elemento.
			- Se pasa el controlador en cada casilla que tenga mas de un elemento.(opcional)
				El controlador revice en cada iteracion lo objetos de cada una de las celdas.
	*/

	this.narrow_phase = function(list, function_controlCollision){
		//console.log("narrow_phase");
		for (var i = 0; i < list.length; i++) {
			get_cell(list[i], boxGrid);
		};
		for (var i = 0; i < boxGrid.length; i++) {
			if(boxGrid[i].entities.length > 1){
				if(function_controlCollision){
					function_controlCollision(boxGrid[i].entities);
				}
			} 
			boxGrid[i].entities = [];
			boxGrid[i].length = 0;
		};
		
		
	};

	this.config = function(obj){
		cellSize = obj.cellSize;
		canvas_w = obj.canvas_w;
		canvas_h = obj.canvas_h;
		do_boxGrid();
	};
	
	
	

};

App.grid.prototype = {
	colision: {
		rect_rect: function(one , alter){
	       	if(alter != null && one != null){
	            return(one.x<alter.x+alter.width&&
	                one.x+one.width>alter.x&&
	                one.y<alter.y+alter.height&&
	                one.y+one.height>alter.y);
	        }
		}
	},
	voronoi: {
		set: function(obj){
			var center, voronoi;
			center = {}, voronoi = {};
			center.x = obj.x + (obj.width * 0.5);
			center.y = obj.y + (obj.height * 0.5);
			voronoi.center = center;
			voronoi.up = {x: obj.x, y: obj.y - obj.height, w: obj.width, h: obj.height};
			voronoi.right = {x: obj.x + obj.width , y: obj.y, w: obj.width, h: obj.height};
			voronoi.down = {x: obj.x, y: obj.y + obj.height, w: obj.width, h: obj.height};
			voronoi.left = {x: obj.x - obj.width , y: obj.y, w: obj.width, h: obj.height};
			return voronoi
		},
		set_corners: function(obj){
			var voronoi = {};
			voronoi.up_left = {x: obj.x - obj.width, y: obj.y - obj.height, w: obj.width, h: obj.height};
			voronoi.up_right = {x: obj.x + obj.width, y: obj.y - obj.height, w: obj.width, h: obj.height};
			voronoi.down_left = {x: obj.x + obj.width, y: obj.y + obj.height, w: obj.width, h: obj.height};
			voronoi.down_right = {x: obj.x - obj.width, y: obj.y + obj.height, w: obj.width, h: obj.height};
			return voronoi
		}
		
	}
}

