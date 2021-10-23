var Variable = require('./Variable');

class AsignacionClase extends Variable{

    constructor(id,parametros,tipo, linea, columna, lenguaje, ambito, paqueteria){
        super(null, null, linea, columna, lenguaje, ambito, paqueteria, null);
        this.id = id;
        this.parametros = parametros;
        this.tipo = tipo;
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