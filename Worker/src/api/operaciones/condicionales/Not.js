var OperacionAritmetica = require('../OperacionAritmetica');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Caracter = require('../../operadores/Caracter');
const Decimal = require('../../operadores/Decimal');
const Entero = require('../../operadores/Entero');
const Number = require('../../operadores/Number');
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
                return new Booleano("", this.linea, this.columna, this.lenguaje);
            }else{
                errores.push(new ErrorSemantico("Los operadores no son compatibles, booleanos unicamente", "!", this.linea, this.columna));
            }
        }else{
            if(this.operadorL instanceof Number){
                return new Entero("", this.linea, this.columna, this.lenguaje);
            }else{
                errores.push(new ErrorSemantico("Los operadores no son compatibles, unicamente se permiten numericos", "!", this.linea, this.columna));
            }
        }
        return null;
    }

}

module.exports = Negativo;