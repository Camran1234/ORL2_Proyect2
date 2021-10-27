var Instruccion = require('./Instruccion');
var Variable = require('./Variable');

class Declaracion extends Instruccion{

    constructor(visibilidad, id, magnitud, tipo, lenguaje, linea, columna, ambito, paqueteria){
        super( linea, columna, lenguaje, ambito, paqueteria, null);
        this.visibilidad = visibilidad;
        this.id = id;
        this.magnitud = magnitud;
        this.tipo = tipo;
        this.asignado = 0;
        this.magnitudO = [];
        this.esArreglo = false;
        this.puntero = false;
    }

    getVariableReferencia(){
        return this;
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

    addAsignacion(){
        if(this.asignado >= 1){
            return false;
        }
        this.asignado++;
        return true;
    }

    setTipo(tipo){
        this.tipo = tipo;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

    getId(){
        return this.id;
    }

    getMagnitud(){
        return this.magnitud;
    }

    getTipo(){
        return this.tipo;
    }

}

module.exports = Declaracion;