var Instruccion = require('./Instruccion');

class For extends Instruccion{

    constructor(valor_inicial, condicion, accion_post, instrucciones, lenguaje, linea, columna, paqueteria, ambito){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.valor_inicial = valor_inicial;
        this.condicion = condicion;
        this.accion_post = accion_post;
    }

    getValorInicial(){
        return this.valor_inicial;
    }

    getCondicion(){
        return this.condicion;
    }

    getAccionPost(){
        return this.accion_post;
    }

}

module.exports = For;