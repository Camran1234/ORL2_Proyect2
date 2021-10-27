var Instruccion = require('./Instruccion');

class While extends Instruccion{

    constructor(condicion, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.condicion = condicion;
        this.puntoInicial = "";
        this.puntoFinal = "";
    }

    setPuntoFinal(punto){
        this.puntoFinal = punto;
    }

    getPuntoFinal(){
        return this.puntoFinal;
    }

    setPuntoInicial(punto){
        this.puntoInicial = punto;
    }

    getPuntoInicial(){
        return this.puntoInicial;
    }

    getCondicion(){
        return this.condicion;
    }

}

module.exports = While;