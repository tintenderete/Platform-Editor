


App.main = function(){
	
	
	var current_mode = new App.Editor(),
		current_map = [];

		document.getElementById('switch').onclick = function(evt){

    		if(current_mode.name === "Editor"){
    			current_mode = new App.Game(current_map);
    		}
    		else{
    			current_mode.stop_loop();
    			current_mode = new App.Editor(current_map);
    		}
		};
		
	return {
		set_current_map: function(map){
			current_map = map;
		},
		get_current_mode: function(){
			return current_mode;
		}
	}

}();

