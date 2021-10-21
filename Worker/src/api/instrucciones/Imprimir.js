var Instruccion = require('./Instruccion');

class Imprimir extends Instruccion{
    constructor(tipo, parametros, instrucciones, linea, columna, lenguaje, ambito,paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.tipo = tipo;
        this.parametros = parametros;
    }

    getTipo(){
        return this.tipo;
    }

    getParametros(){
        return this.parametros;
    }
    
}

module.exports = Imprimir;