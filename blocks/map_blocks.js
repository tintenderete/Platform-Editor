/*
Clase autoejecutada 
Esta clase tiene la propiedad de generar arrays con la informacion necesaria
para ser dibujada por la clase blocks.

set_map_blocks({
	obj:{
		columns,
		rows,
		blockSize
	},
	type: Puede ser nullo, string o array. 
		Se usa en set() y sirve para definir los tipos de blocks,
	no_one: pasando el no_one como true, elminamos todo lo elementos que son no_one
})

set(){
	obj:{
		columns,
		rows,
		blockSize
	},
	where: array donde queremos guardar la lista de elementos del grid,
	type:{
		null: guarda todos los cuadrados blancos,
		string: guarda todos los cuadrados de ese color,
		array: guarda segun indique la posicion del array
	}
}
*/


var map_blocks = function(){
	var that = {};
	/*
		Parametros de set_map_blocks:
		obj: Pasamos columns, rows, , blockSize para:
			
			- Dar coordenadas a los bloques en al funcion set().
		
		type : Podemos pasarle:
			- UN string que sea un nombre de modelo para que tdos los bloques sean iguales
			- Una lista de string(array) para que lo lea, y cree el modelo segun le diga la lista
			- Una lista de objetos (array) para que copie los modelos que al lista trae
		no_one : si es true eliminara los no_one del array
	*/
	that.set_map_blocks= function(obj, type, no_one){
		var list = [];
		set(obj, list, type, no_one);
		/* 
		Le pasamos al propio array un nuevo parametro con el blockSize
		para tenerlo siempre a mano
		*/
		list.blockSize = obj.blockSize;
		return list;
	};
	
	var set = function(obj, where, type, no_one){
		var columns, rows , numOfBlocks, blockSize, col, row, type, opc;
		opc = "no_one";
		
		if(typeof type === 'string' ){opc = type};
		columns = obj.columns;
		numOfBlocks = obj.columns * obj.rows;
		blockSize = obj.blockSize;
        col = 0;
        row = 0;

        for(var i = 0; i < numOfBlocks; i++)
        {  	var new_block;
        	if(Array.isArray(type)){
        		if(typeof type[i] === 'string'){opc = type[i]}
        		if(typeof type[i] === 'object'){opc = type[i].type}
        	};
        	if(no_one === true && opc === "no_one"){}
        	else {
        		//Editamos un nuevo bloque 
        		new_block = blocks.Block.factory({
	            	id:i, 
	            	x: (col * blockSize), 
	            	y: (row * blockSize), 
	            	type: opc,
	            	width: blockSize,
	            	height: blockSize,}, opc);
        		//Lo introducimos en el array que vamos a devolver
	            where.push(new_block);
	        }
            col++;
            if(col >= columns)
            {
                row++;
                col = 0;
            }
        }

       };

    
	
    return that

       
}();




