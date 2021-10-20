const TIPO_INSTRUCCION = require('./Instrucciones').TIPO_INSTRUCCION;
const TIPO_DATO = require('./Instrucciones').TIPO_DATO;
const TIPO_VALOR = require('./Instrucciones').TIPO_VALOR;
const TIPO_VISIBILIDAD = require('./Instrucciones').TIPO_VISIBILIDAD;
const TIPO_OPERACION = require('./Instrucciones').TIPO_OPERACION;

const Booleano = require('./operadores/Booleano');
const Cadena = require('./operadores/Cadena');
const Caracter = require('./operadores/Caracter');
const Decimal = require('./operadores/Decimal');
const Entero = require('./operadores/Entero');
const Number = require('./operadores/Number');
const Object = require('./operadores/Object');

const Division = require('./operaciones/aritmeticos/Division');
const Mod = require('./operaciones/aritmeticos/Mod');
const Multiplicacion = require('./operaciones/aritmeticos/Multiplicacion');
const Negativo = require('./operaciones/aritmeticos/Negativo');
const Pow = require('./operaciones/aritmeticos/Pow');
const Resta = require('./operaciones/aritmeticos/Resta');
const Suma = require('./operaciones/aritmeticos/Suma');

const Comparacion = require('./operaciones/comparaciones/Comparacion');
const Diferente = require('./operaciones/comparaciones/Diferente');
const Mayor = require('./operaciones/comparaciones/Mayor');
const MayorIgual = require('./operaciones/comparaciones/MayorIgual');
const Menor = require('./operaciones/comparaciones/Menor');
const MenorIgual = require('./operaciones/comparaciones/MenorIgual');

const And = require('./operaciones/condicionales/And');
const Or = require('./operaciones/condicionales/Or');
const Not = require('./operaciones/condicionales/Not');

const TIPO_EXPRESION = require('./Instrucciones').TIPO_EXPRESION;
var ErrorSemantico = require('../error/SemanticError');
var ProcesadorTipos = require('./ProcesadorTipos');
var Operador = require('./operadores/Operador');

class ProcesadorOperacion{
    constructor(){
        
    }

    procesarOperacion(operacion, ambito, tablaTipos, errores){
        if(operacion.rol == TIPO_EXPRESION.OPERACION){
            return this.procesarOperacion(operacion, ambito, tablaTipos, errores);
        }else if(operacion.rol == TIPO_EXPRESION.VALOR){
            return this.procesarValor(operacion, ambito, tablaTipos, errores);
        }
    }

    crearTipo(operador, operadorL, operadorR,linea, columna, lenguaje){
        if(operador == TIPO_OPERACION.SUMA){
            return new Suma(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.RESTA){
            return new Resta(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.NEGATIVO){
            return new Negativo(operadorL, null, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.MULTIPLICACION){
            return new Multiplicacion(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.DIVISION){
            return new Division(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.MOD){
            return new Mod(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.POW){
            return new Pow(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.MENOR){
            return new Menor(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.MENOR_IGUAL){
            return new MenorIgual(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.MAYOR){
            return new Mayor(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.MAYOR_IGUAL){
            return new MayorIgual(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.COMPARACION){
            return new Comparacion(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.DIFERENTE){
            return new Diferente(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.AND){
            return new And(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.OR){
            return new Or(operadorL, operadorR, linea, columna, lenguaje);
        }else if(operador == TIPO_OPERACION.NOT){
            return new Not(operadorL, null, linea, columna, lenguaje);
        }
        return null;
    }

    procesarExpresion(expresion, ambito, tablaTipo, errores){
        let operadorL;
        let operadorR;
        if(expresion.operadorL == TIPO_EXPRESION.OPERACION && expresion.operadorR == TIPO_EXPRESION.OPERACION){
            operadorL = this.procesarExpresion(expresion.operadorL, ambito, tablaTipo, errores);
            operadorR = this.procesarExpresion(expresion.operadorR, ambito, tablaTipo, errores);            
        }else if(expresion.operadorL == TIPO_EXPRESION.OPERACION && expresion.operadorR == TIPO_EXPRESION.VALOR){
            operadorL = this.procesarExpresion(expresion.operadorL, ambito, tablaTipo, errores);
            operadorR = this.procesarValor(expresion.operadorR, ambito, tablaTipo, errores);
        }else if(expresion.operadorL == TIPO_EXPRESION.VALOR && expresion.operadorR == TIPO_EXPRESION.OPERACION){
            operadorL = this.procesarValor(expresion.operadorL, ambito, tablaTipo, errores);
            operadorR = this.procesarExpresion(expresion.operadorR, ambito, tablaTipo, errores);
        }else if(expresion.operadorL == TIPO_EXPRESION.VALOR && expresion.operadorR == TIPO_EXPRESION.VALOR){
            operadorL = this.procesarValor(expresion.operadorL, ambito, tablaTipo, errores);
            operadorR = this.procesarValor(expresion.operadorR, ambito, tablaTipo, errores);
        }
        if(operadorL == null){
            errores.push(new ErrorSemantico("El operando es tipo void en un contexto de operaciones", expresion.operadorL.id,
            expresion.operadorL.linea, expresion.operadorL.columna));
            return null;
        }else if(operadorR == null){
            errores.push(new ErrorSemantico("El operando es tipo void en un contexto de operaciones", expresion.operadorR.id,
            expresion.operadorR.linea, expresion.operadorR.columna));
            return null;
        }
        let operador = this.crearTipo(expresion.operador, expresion.operadorL, expresion.operadorR, expresion.linea, expresion.columna, expresion.lenguaje);
        return operador.operar(errores);
    }

    procesarValor(valor, ambito, tablaTipos, errores){
        let resultado =null;
        let tipo = valor.tipo;
        let id = valor.id;

        if(tipo == TIPO_VALOR.IDENTIFICADOR){
            resultado = tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.DECLARACION, lenguaje);
        }else if(tipo == TIPO_VALOR.PUNTERO_IDENTIFICADOR){
            resultado = tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.DECLARACION, lenguaje);
        }else if(tipo == TIPO_VALOR.THIS_IDENTIFICADOR){
            let newAmbito = ambitoEnClase();
            if(newAmbito!=null){
                resultado = tablaTipos.buscar(id, newAmbito, TIPO_INSTRUCCION.THIS_IDENTIFICADOR, lenguaje)
            }                
        }else if(tipo == TIPO_VALOR.METODO){
            resultado = tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.METODO, lenguaje);
        }
        if(resultado == null){
            errores.push(new ErrorSemantico("No se encontro ninguna variable en el contexto",id,valor.linea, valor.columna));
            return null;
        }else{
            tipo = resultado.getTipo();
                
        }

        return ProcesadorTipos.convertirVariable(resultado.getTipo());;        
    }

}


module.exports = ProcesadorOperacion;