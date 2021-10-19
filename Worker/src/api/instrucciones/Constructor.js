var Instruccion = require('./Instruccion');

class Constructor extends Instruccion{

    constructor(id, visibilidad, instrucciones, parametros, linea, columna, lenguaje, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.id = id;
        this.visibilidad = visibilidad;
        this.parametros = parametros;
    }

    getId(){
        return this.id;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

    getParametros(){
        return this.parametros;
    }

}

module.exports = Constructor;