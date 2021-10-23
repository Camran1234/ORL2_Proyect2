var Instruccion = require('./Instruccion');

class Metodo extends Instruccion{

    constructor(id, parametros, linea, columna, lenguaje, ambito, paqueteria, instrucciones, funcionReferencia){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones)
        this.id = id;
        this.parametros = parametros;
        this.funcionReferencia = funcionReferencia;
    }

    setParametros(parametros){
        this.parametros = parametros;
    }

    setFuncionReferencia(funcion){
        this.funcionReferencia = funcion;
    }

    setId(id){
        this.id = id;
    }

    getParametros(){
        return this.parametros;
    }

    getFuncionReferencia(){
        return this.funcionReferencia;
    }

    getId(){
        return this.id;
    }

}

module.exports = Metodo;