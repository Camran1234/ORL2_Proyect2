var Instruccion = require('./Instruccion');

class For extends Instruccion{

    constructor(valor_inicial, condicion, accion_post, instrucciones, lenguaje, linea, columna, paqueteria, ambito){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.valor_inicial = valor_inicial;
        this.condicion = condicion;
        this.accion_post = accion_post;
    }

    setValorInicial(valor){
        this.valor_inicial = valor;
    }

    setCondicion(condicion){
        this.condicion = condicion;
    }

    setAccionPost(accionPost){
        this.accion_post = accionPost;
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