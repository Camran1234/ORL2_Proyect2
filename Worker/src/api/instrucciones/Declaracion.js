var Instruccion = require('./Instruccion');
var Variable = require('./Variable');

class Declaracion extends Variable{

    constructor(visibilidad, id, magnitud, tipo, lenguaje, linea, columna, ambito, paqueteria){
        super(null, null, linea, columna, lenguaje, ambito, paqueteria, null);
        this.visibilidad = visibilidad;
        this.id = id;
        this.magnitud = magnitud;
        this.tipo = tipo;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

    getId(){
        return this.id;
    }

    getMagnitud(){
        return this.magnitud;
    }

    getTipo(){
        return this.tipo;
    }

}

module.exports = Declaracion;