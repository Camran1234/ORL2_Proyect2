var Instruccion = require('./Instruccion');

class AsignacionClase extends Instruccion{

    constructor(id,parametros,tipo, linea, columna, lenguaje, ambito, paqueteria){
        super( linea, columna, lenguaje, ambito, paqueteria, null);
        this.id = id;
        this.parametros = parametros;
        this.tipo = tipo;
        this.constructor = null;
    }

    getConstructor(){
        return this.constructor;
    }

    setConstructor(cons){
        this.constructor = cons;
    }

    getParametros(){
        return this.parametros;
    }

    getTipo(){
        return this.tipo;
    }

    getId(){
        return this.id;
    }

    

}

module.exports = AsignacionClase;