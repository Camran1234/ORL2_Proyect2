const TIPO_INSTRUCCION = require('./Instrucciones').TIPO_INSTRUCCION;
const TIPO_DATO = require('./Instrucciones').TIPO_DATO;
const TIPO_VALOR = require('./Instrucciones').TIPO_VALOR;
const TIPO_VISIBILIDAD = require('./Instrucciones').TIPO_VISIBILIDAD;
const TIPO_OPERACION = require('./Instrucciones').TIPO_OPERACION;
const TIPO_EXPRESION = require('./Instrucciones').TIPO_EXPRESION;
var ErrorSemantico = require('../error/SemanticError');
var ProcesadorTipos = require('./ProcesadorTipos');
var Operador = require('./operadores/Operador');

class ProcesadorOperacion{
    constructor(){
        
    }

    procesarOperacion(expresion, ambito, tablaTipos, errores){
        expresion.array.forEach(operacion => {
            if(operacion.rol == TIPO_EXPRESION.OPERACION){
                return this.procesarExpresion(operacion, ambito, tablaTipos, errores);
            }else if(operacion.rol == TIPO_EXPRESION.VALOR){
                return this.procesarValor(operacion, ambito, tablaTipos, errores);
            }
        });
    }

    procesarImprimir(parametros, tablaTipos, errores, lenguaje){

    }

    procesarExpresion(expresion, ambito, tablaTipo, errores){
        let operadorL;
        let operadorR;
        if(expresion.operadorL == TIPO_EXPRESION.OPERACION && expresion.operadorR == TIPO_EXPRESION.OPERACION){
            operadorL = this.procesarExpresion(expresion.operadorL);
            operadorR = this.procesarExpresion(expresion.operadorR);            
        }else if(expresion.operadorL == TIPO_EXPRESION.OPERACION && expresion.operadorR == TIPO_EXPRESION.VALOR){
            operadorL = this.procesarExpresion(expresion.operadorL);
            operadorR = this.procesarValor(expresion.operadorR, ambito, tablaTipo);
        }else if(expresion.operadorL == TIPO_EXPRESION.VALOR && expresion.operadorR == TIPO_EXPRESION.OPERACION){
            operadorL = this.procesarValor(expresion.operadorL, ambito, tablaTipo);
            operadorR = this.procesarExpresion(expresion.operadorR);
        }else if(expresion.operadorL == TIPO_EXPRESION.VALOR && expresion.operadorR == TIPO_EXPRESION.VALOR){
            operadorL = this.procesarValor(expresion.operadorL, ambito, tablaTipo);
            operadorR = this.procesarValor(expresion.operadorR, ambito, tablaTipo);
        }
        if(operadorL == null){
            errores.push(new ErrorSemantico("El operando es tipo void en un contexto de operaciones", expresion.operadorL.id,
            expresion.operadorL.linea, expresion.operadorL.columna));
        }else if(operadorR == null){
            errores.push(new ErrorSemantico("El operando es tipo void en un contexto de operaciones", expresion.operadorR.id,
            expresion.operadorR.linea, expresion.operadorR.columna));
        }else{
            return Operador.operar(operador, operadorL, operadorR, expresion.lenguaje);
        }
    }

    procesarValor(valor, ambito, tablaTipos){
        let resultado =null;
        let tipo = valor.tipo;
        let id = valor.id;

        if(tipo == TIPO_VALOR.IDENTIFICADOR){
            resultado = tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.DECLARACION);
        }else if(tipo == TIPO_VALOR.PUNTERO_IDENTIFICADOR){
            resultado = tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.DECLARACION);
        }else if(tipo == TIPO_VALOR.THIS_IDENTIFICADOR){
            resultado = tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.THIS_IDENTIFICADOR)
        }else if(tipo == TIPO_VALOR.METODO){
            resultado = tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.METODO);
        }
            
        return ProcesadorTipos.convertirVariable(resultado);;        
    }

}


module.exports = ProcesadorOperacion;