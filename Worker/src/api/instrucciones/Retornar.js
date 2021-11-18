var Instruccion = require('./Instruccion');

class Retornar extends Instruccion{

    constructor(valor, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones)
        this.valor = valor;
    }

    getValor(){
        return this.valor;
    }

    isFromMain(){
        let ambit = this.ambitoEnMain();
        if (ambit !=null){
            return true;
        }
        return false;
    }

}

module.exports = Retornar;