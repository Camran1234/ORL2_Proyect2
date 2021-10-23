var Variable = require('./Variable');

class Asignacion extends Variable{

    constructor(id, magnitud, operador, expresion, linea, columna, lenguaje, ambito, paqueteria){
        super(null, null, linea, columna, lenguaje, ambito, paqueteria, null);
        this.id = id;
        this.magnitud = magnitud;
        this.operador = operador;
        this.expresion = expresion;
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