const Booleano = require('../operadores/Booleano');
const Cadena = require('../operadores/Cadena');
const Caracter = require('../operadores/Caracter');
const Decimal = require('../operadores/Decimal');
const Entero = require('../operadores/Entero');
const ErrorSemantico = require('../../error/SemanticError');
const TIPO_OPERACION = require('../../api/Instrucciones').TIPO_OPERACION;
const { TIPO_VALOR } = require('../../api/Instrucciones');
class Operacion{

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        this.operadorL = operadorL;
        this.operadorR = operadorR;
        this.linea = linea;
        this.columna = columna;
        this.lenguaje = lenguaje;
        this.nombre = "tnull";
        this.operacionFinal = "null";
        this.tipo = "";
        this.operador = "";
        this.lastOperacion = true;;
    }

    tipo_int(){
        if(this.tipo == "Caracter"
        || this.tipo instanceof Caracter
        || this.tipo == Caracter){
            return 2;
        }else if(this.tipo == "BOOLEAN"
        || this.tipo instanceof Booleano
        || this.tipo == Booleano){
            return 0;
        }else if(this.tipo == "ENTERO"
        || this.tipo instanceof Entero
        || this.tipo == Entero){
            return 0;
        }else if(this.tipo == "DECIMAL"
        || this.tipo instanceof Decimal
        || this.tipo == Decimal){
            return 1;
        }else if(this.tipo == "CADENA"
        || this.tipo instanceof Cadena
        || this.tipo == Cadena){
            return 3;
        }
        return 0;
    }

    incluirLastOperacion(){
        this.lastOperacion = true;
    }

    noIncluirLastOperacion(){
        this.lastOperacion = false;
    }

    getTipo(){
        return this.tipo;
    }

    setTipo(tipo){
        this.tipo = tipo;
    }

    setOperacionFinal(operacion){
        this.operacionFinal = operacion;
    }

    getOperacionFinal(){
        return this.operacionFinal;
    }

    setNombre(t){
        this.nombre = t;
    }

    getNombre(){
        return this.nombre;
    }

    crearError(errores, token, verbo){
        errores.push(new ErrorSemantico("No se puede "+verbo+" los tipos "+this.operadorL.type()+" y "+this.operadorR.type(),token, this.linea, this.columna));
    }

    drawT(t){
        return "t"+t;
    }

    drawEt(e){
        return "et"+e;
    }

    
    
    

}

module.exports = Operacion;