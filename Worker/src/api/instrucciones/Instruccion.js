var Break = require('./Break');
var Clase = require('./Clase');
var Continue = require('./Continue');
var doWhile = require('./doWhile');
var Else = require('./Else');
var For = require('./For');
var Function = require('./Function');
var If = require('./If');
var Main = require('./Main');
var Switch = require('./Switch');
var While = require('./While');
var Constructor = require('./Constructor');

class Instruccion{
    constructor(linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        this.linea = linea;
        this.columna = columna;
        this.lenguaje = lenguaje;
        this.ambito = ambito;
        this.paqueteria = paqueteria;
        this.instrucciones = instrucciones;
    }

    setInstrucciones(instrucciones){
        this.instrucciones = instrucciones;
    }

    getLinea(){
        return this.linea;
    }

    getColumna(){
        return this.columna;
    }

    getLenguaje(){
        return this.lenguaje;
    }

    getAmbito(){
        return this.ambito;
    }

    getPaqueteria(){
        return this.paqueteria;
    }


    getInstrucciones(){
        return this.instrucciones;
    }

    

    ambitoEnCiclo(){
        let retornar = null;
        if(this.ambito != null){
            if(this.ambito instanceof For || this.ambito instanceof While
                || this.ambito instanceof doWhile){
                    retornar = this.ambito;
            }else{
                retornar = this.ambito.ambitoEnCiclo();
            }
        }
        return retornar;
    }

    ambitoEnFuncion(){
        let retornar = null;
        if(this.ambito != null){
            if(this.ambito instanceof Function){
                    retornar = this.ambito;
            }else{
                retornar = this.ambito.ambitoEnFuncion();
            }
        }
        return retornar;
    }

    /**
     * Puede usarse en main tambien
     */
    ambitoEnConstructor(){
        let retornar = null;
        if(this.ambito !=null){
            if(this.ambito instanceof Constructor
                || this.ambito instanceof Main){
                retornar = this.ambito;
            }else {
                retornar = this.ambito.ambitoEnConstructor();
            }
        }
    }

    ambitoEnClase(){
        let retornar = null;
        if(this.ambito != null){
            if(this.ambito instanceof Clase){
                    retornar = this.ambito;
            }else{
                retornar = this.ambito.ambitoEnClase();
            }
        }
        return retornar;
    }

    

}

module.exports = Instruccion;