var Instruccion = require('./Instruccion');

class Asignacion extends Instruccion{

    constructor(id, magnitud, operador, expresion, linea, columna, lenguaje, ambito, paqueteria){
        super( linea, columna, lenguaje, ambito, paqueteria, null);
        this.id = id;
        this.magnitud = magnitud;
        this.operador = operador;
        this.expresion = expresion;
        this.variableReferencia = null;
        this.magnitudO = [];
        this.esArreglo = false;
        this.puntero = false;
        this.scan = false;
        this.declaracion = null;
    }

    getDeclaracion(){
        if(this.declaracion == null){
            return this;
        }
        return this.declaracion;
    }

    setDeclaracion(declaracion){
        this.declaracion = declaracion;
    }

    setScan(){
        this.scan = true;
    }

    isScan(){
        return this.scan;
    }

    setPuntero(puntero){
        this.puntero = puntero;
    }

    getPuntero(){
        return this.puntero;
    }

    isArray(){
        return this.esArreglo;
    }

    setMagnitudO(magnitud){
        this.magnitudO = magnitud;
        if(magnitud.length>0){
            this.esArreglo = true;
        }
    }

    getMagnitudO(){
        return this.magnitudO;
    }
    

    setVariableReferencia(variable){
        this.variableReferencia = variable;
    }

    getVariableReferencia(){
        return this.variableReferencia;
    }

    setExpresion(expresion){
        this.expresion = expresion;
    }

    getId(){
        return this.id;
    }

    getMagnitud(){
        return this.magnitud;
    }

    getOperador(){
        return this.operador;
    }

    getExpresion(){
        return this.expresion;
    }

}

module.exports = Asignacion;