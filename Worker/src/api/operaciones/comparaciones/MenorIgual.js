var OperacionAritmetica = require('../OperacionAritmetica');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Number = require('../../operadores/Number');
const Entero = require('../../operadores/Entero');
const ErrorSemantico = require('../../../error/SemanticError');
const TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;

class MenorIgual extends OperacionAritmetica {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
    }

    operar(errores){
        //Condicion de operacion
        if(this.operadorL instanceof Number && this.operadorR instanceof Number){
            if(this.lenguaje == TIPO_LENGUAJE.JAVA){
                if(this.operadorL instanceof Booleano || this.operadorL instanceof Booleano){
                    errores.push(new ErrorSemantico("Los operadores no pueden ser booleanos", "<=", this.linea, this.columna));
                }else{
                    return new Booleano("", this.linea, this.columna, this.lenguaje);
                }
            }else{
                return new Entero("", this.linea, this.columna, this.lenguaje);
            }
        }else{
            errores.push(new ErrorSemantico("Los operadores no son compatibles, numericos con numericos", "<=", this.linea, this.columna));
        }
        return null;
        //Fin de condicion        
    }
}

module.exports = MenorIgual;