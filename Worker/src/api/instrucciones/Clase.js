var Instruccion = require('./Instruccion');

class Clase extends Instruccion{
    constructor(id, instrucciones, idExtension, visibilidad, linea, columna, lenguaje, ambito,paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.id = id;
        this.idExtension = idExtension;
        this.visibilidad = visibilidad;
    }

    getId(){
        return this.id;
    }

    getIdExtension(){
        return this.idExtension;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

}

module.exports = Clase;