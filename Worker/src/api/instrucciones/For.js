var Instruccion = require('./Instruccion');

class For extends Instruccion{

    constructor(valor_inicial, condicion, accion_post, instrucciones, lenguaje, linea, columna, paqueteria, ambito){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.valor_inicial = valor_inicial;
        this.condicion = condicion;
        this.accion_post = accion_post;
        this.puntoInicial = "";
        this.puntoFinal = "";
    }

    setValorInicial(valor){
        this.valor_inicial = valor;
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