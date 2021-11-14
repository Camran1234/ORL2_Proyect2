var Instruccion = require('./Instruccion');

class Main extends Instruccion{

    constructor(linea, columna,tipo, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones)
        this.tipo = tipo;
    }

    getTipo(){
        return this.tipo;
    }

    setTipo(tipo){
        this.tipo = tipo;
    }

}

module.exports = Main;