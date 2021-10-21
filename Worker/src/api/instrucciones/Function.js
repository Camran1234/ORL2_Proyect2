var Instruccion = require('./Instruccion');

class Function extends Instruccion{

    constructor(visibilidad, id, tipo, instrucciones, parametros, lenguaje, linea, columna, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.visibilidad = visibilidad;
        this.id = id;
        this.tipo = tipo;
        this.parametros = parametros;
    }

    getParametros(){
        return this.parametros;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

    getId(){
        return this.id;
    }

    getTipo(){
        return this.tipo;
    }

}

module.exports = Function;