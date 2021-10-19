var Instruccion = require('./Instruccion');

class Main extends Instruccion{

    constructor(linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones)
    }

}

module.exports = Main;