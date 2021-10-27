var Instruccion = require('./Instruccion');

class Getch extends Instruccion{

    constructor(instrucciones, lenguaje, linea, columna, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
    }
    

}

module.exports = Getch;