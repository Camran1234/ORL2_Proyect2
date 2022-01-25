

class Instruccion{
    constructor(linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        this.linea = linea;
        this.columna = columna;
        this.lenguaje = lenguaje;
        this.ambito = ambito;
        this.paqueteria = paqueteria;
        this.instrucciones = instrucciones;
        this.posMemoria = 0;
        this.tName = "";
        this.heap = false;
        this.expresionO = null;
        this.cantidadMemoria = 0;
        this.etSalida = "";
        this.cadena = "";
    }

    getCadena(){
        return this.cadena;
    }


    concatText(text){
        this.cadena += text;
    }

    getText(){
        return this.cadena;
    }

    esJava(){
        if(this.lenguaje == 'JAVA'){
            return true;
        }
        return false;

    }

    setEtSalida(t){
        this.etSalida = t;
    }

    getEtSalida(){
        return this.etSalida;
    }

    addMemoria(){
        this.cantidadMemoria++;
    }

    getMemoria(){
        return this.cantidadMemoria;
    }

    setExpresionO(expresion){
        this.expresionO = expresion;
    }

    getExpresionO(){
        return this.expresionO;
    }

    //Genera antes de la ultima expresion
    generarExpresionO(){
        let cadena= "";

        return cadena;
    }

    //Genera la ultima expresion
    generateLastExpresion(){
        let cadena = "";

        return cadena;
    }

    generarPaqueteria(){
        let paquete = this.paqueteria;
        let arreglo = paquete.split('.');
        paquete = arreglo.join('_');
        return paquete;
    }

    setTName(tName){
        this.tName = tName;
    }

    getTName(){
        
        return this.tName;
    }

    setPosMemoria(memoria){
        this.posMemoria = memoria;
    }

    setAsHeap(){
        return true;
    }

    setInstrucciones(instrucciones){
        const Constructor = require('./Constructor');
        
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

    

    perteneceAmbito(ambito){
        let retornar = false;
        if(this == ambito){
            retornar = true;
        }else{
            if(this.ambito!=null){
                retornar = this.ambito.perteneceAmbito(ambito);
            }
        }

        return retornar;
    }

    /*Devuelve el ambito de la pila */
    ambitoMayor(){
        let retornar = null;
        let Function = require('./Function');
        let Constructor = require('./Constructor');
        let Clase = require('./Clase');
        let Main = require('./Main');
        if(this instanceof Function || this instanceof Constructor ||
            this instanceof Clase || this instanceof Main){
                retornar = this;
        }else{
            if(this.ambito!=null){
                retornar = this.ambito.ambitoMayor();
            }
        }
        return retornar;
    }

    ambitoEnCiclo(){
        let retornar = null;
        let doWhile = require('./doWhile');
        let For = require('./For');
        let While = require('./While');
        if(this instanceof For || this instanceof While
            || this instanceof doWhile){
                retornar = this;
        }else{
            if(this.ambito!=null){
                retornar = this.ambito.ambitoEnCiclo();
            }
        }
        return retornar;
    }

    ambitoEnFuncion(){
        let retornar = null;
        let Function = require('./Function');
        if(this instanceof Function){
            retornar = this;
        }else{
            if(this.ambito != null){
                retornar = this.ambito.ambitoEnFuncion();
            }
        }        
        return retornar;
    }

    ambitoEnMain(){
        let retorna = null;
        let Main = require('./Main');
        if(this instanceof Main){
            retorna = this;
        }else{
            if(this.ambito!=null){
                retorna = this.ambito.ambitoEnMain();
            }
        }
        return retorna;
    }

    /**
     * Puede usarse en main tambien
     */
    ambitoEnConstructor(){
        let retornar = null;
        let Main = require('./Main');
        let Constructor = require('./Constructor');
        if(this instanceof Constructor
            || this instanceof Main){
            retornar = this;
        }else {
            if(this.ambito !=null){
                retornar = this.ambito.ambitoEnConstructor();
            }
        }
        return retornar;
    }

    ambitoEnClase(){
        let retornar = null;
        let Clase = require('./Clase');
        if(this instanceof Clase){
            retornar = this;
        }else{
            if(this.ambito != null){
                retornar = this.ambito.ambitoEnClase();
            }
        }
        
        return retornar;
    }

    

}

module.exports = Instruccion;