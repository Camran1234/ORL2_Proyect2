var Instruccion = require('./Instruccion');

class doWhile extends Instruccion{

    constructor(instrucciones, condicion, linea, columna, lenguaje, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.condicion = condicion;
        this.puntoInicial = "";
        this.puntoFinal = "";
    }

    setPuntoInicial(punto){
        this.puntoInicial = punto;
    }

    getPuntoInicial(){
        return this.puntoInicial;
    }

    setPuntoFinal(punto){
        this.puntoFinal = punto;
    }

    getPuntoFinal(){
        return this.puntoFinal;
    }

    getCondicion(){
        return this.condicion;
    }

}

module.exports = doWhile;