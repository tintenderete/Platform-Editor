

	FPS = function (){
	that = {};
    // FPS máximos a los que queremos que se ejecute la aplicación.
    that.maxfps = 32;
 
    // Variables necesarias para el recuento de FPS y el cálculo del delay.
    that.frameCount = 0;
    that.currentFps = 0;
    that.drawInterval = 1 / that.maxfps * 1000;
    that.lastFps = new Date().getTime();
 
    // Variables para almacenar las referencias al elemento canvas.
    that.canvas = null;
    that.canvasCtx = null;
 
    // Método que utilizamos como constructor.
    that.set_interval = function(func)
    {
        // Inicializamos el intervalo a los FPS deseados.
 	    return setInterval(function(){func();}, that.drawInterval);    
    }
 
    that.update = function()
    {
        // Calculamos el tiempo desde el último frame.
        var thatFrame = new Date().getTime();
        var diffTime = Math.ceil((thatFrame - that.lastFps));
 
        if (diffTime >= 1000) {
            that.currentFps = that.frameCount;
            that.frameCount = 0.0;
            that.lastFps = thatFrame;
        }
 
        that.frameCount++;

        document.getElementById('FPS').innerHTML = "FPS: " + that.currentFps + "/" + that.maxfps + "";
    }
 /*
    that.draw = function (obj)
    {
        // Limpiamos el contexto del canvas.
        obj.context.clearRect(0, 0, obj.canvas.width, obj.canvas.height);
 
        // Finalmente, pintamos los FPS.
        obj.context.save();
        obj.context.fillStyle = '#000000';
        obj.context.font = 'bold 10px sans-serif';
        obj.context.fillText('FPS: ' + that.currentFps + '/' + that.maxfps, 10,15);
        obj.context.restore();
    };
    */
    return that
}();