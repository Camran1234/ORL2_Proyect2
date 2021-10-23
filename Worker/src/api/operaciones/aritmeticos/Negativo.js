var OperacionAritmetica = require('../OperacionAritmetica');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Caracter = require('../../operadores/Caracter');
const Decimal = require('../../operadores/Decimal');
const Entero = require('../../operadores/Entero');
const ErrorSemantico = require('../../../error/SemanticError');
const  TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;
class Negativo extends OperacionAritmetica {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
    }

    operar(errores){
        //Condicion de operacion
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(this.operadorL instanceof Booleano){
                this.crearError(errores, "-", "aplicar unario");
                return null;
            }
        }
        if(this.operadorL instanceof Cadena ){
            if(this.operadorL instanceof Cadena){
                this.crearError(errores, this.operadorL.getValor(), "operar");
            }       
        }
        return this.operadorL;
    }

}

module.exports = Negativo;