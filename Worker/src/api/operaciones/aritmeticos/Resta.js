var OperacionAritmetica = require('../OperacionAritmetica');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Caracter = require('../../operadores/Caracter');
const Decimal = require('../../operadores/Decimal');
const Entero = require('../../operadores/Entero');
const  TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;
class Resta extends OperacionAritmetica {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
    }

    operar(errores){
        //Condicion de operacion
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(this.operadorL instanceof Booleano || this.operadorR instanceof Booleano){
                this.crearError(errores, "-", "operar");
                return null;
            }
        }
        if(this.operadorL instanceof Cadena || this.operadorR instanceof Cadena){
            if(this.operadorL instanceof Cadena){
                this.crearError(errores, this.operadorL.getValor(), "operar");
            }else if(this.operadorR instanceof Cadena){
                this.crearError(errores, this.operadorR.getValor(), "operar");
            }            
        }
        //Fin de condicion
        let resultadoL = this.operadorL.tryParse(this.operadorR);
        let resultadoR = this.operadorR.tryParse(this.operadorL);
        if(resultadoL!=null){
            return resultadoL;
        }else if(resultadoR !=null){
            return resultadoR;
        }
        this.crearError(errores, "+", "parsear");
        return null;
    }

}

module.exports = Resta;