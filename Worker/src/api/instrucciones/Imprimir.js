var Instruccion = require('./Instruccion');

class Imprimir extends Instruccion{
    constructor(tipo, parametros, instrucciones, linea, columna, lenguaje, ambito,paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.tipo = tipo;
        this.parametros = parametros;
        this.paramsO=[];
        this.results = [];
        this.cadenas = [];
    }

    addResults(result){
        this.results.push(result);
    }

    getResults(){
        return this.results;
    }

    setCadenas(cad){
        this.cadenas = cad;
    }

    getCadenas(){
        return this.cadenas;
    }

    addParamsO(param){
        this.paramsO.push(param);
    }

    getParamsO(){
        return this.paramsO;
    }

    getTipo(){
        return this.tipo;
    }

    getParametros(){
        return this.parametros;
    }
    
}

module.exports = Imprimir;