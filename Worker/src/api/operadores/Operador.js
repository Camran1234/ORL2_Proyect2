const TIPO_EXPRESION = require("../Instrucciones").TIPO_EXPRESION;
const TIPO_DATO = require("../Instrucciones").TIPO_DATO;
const TIPO_VALOR = require('../Instrucciones').TIPO_VALOR;
const TIPO_LENGUAJE = require('../Instrucciones').TIPO_LENGUAJE;
const Booleano = require('../operadores/Booleano');
const Cadena = require('../operadores/Cadena');
const Caracter = require('../operadores/Caracter');
const Decimal = require('../operadores/Decimal');
const Entero = require('../operadores/Entero');
const Object = require('../operadores/Object');
const ProcesadorTipos = require('../ProcesadorTipos');

var ErrorSemantico = require('../../error/SemanticError');
class Operador{

    constructor(){

    }

    procesarOperaciones(operacion, ambito, tablaTipos, errores){
        if(operacion.rol == TIPO_EXPRESION.OPERACION){
            return this.procesarOperacion(operacion, ambito, tablaTipos, errores);
        }else if(operacion.rol == TIPO_EXPRESION.VALOR){
            return this.procesarValor(expresion, ambito, tablaTipos, errores);
        }

    }

    procesarOperacion(operacion, ambito, tablaTipos, errores){
        let operadorL = operacion.operadorL;
        let operadorR = operacion.operadorR;
        let lenguaje = operacion.lenguaje;
        let resultadoL=null;
        let resultadoR = null;
        if(operadorL.rol == TIPO_EXPRESION.OPERACION && operadorR.rol == TIPO_EXPRESION.OPERACION){
            resultadoL = this.procesarOperacion(operadorL, ambito, tablaTipos, errores);
            resultadoR = this.procesarOperacion(operadorR, ambito, tablaTipos, errores);
        }else if(operadorL.rol == TIPO_EXPRESION.OPERACION && operadorR.rol == TIPO_EXPRESION.VALOR){
            resultadoL = this.procesarOperacion(operadorL, ambito, tablaTipos, errores);
            resultadoR = this.procesarValor(operadorR, ambito, tablaTipos, errores, lenguaje);
        }else if(operadorL.rol == TIPO_EXPRESION.VALOR && operadorR.rol == TIPO_EXPRESION.OPERACION){
            resultadoL = this.procesarValor(operadorL, ambito, tablaTipos, errores, lenguaje);
            resultadoR = this.procesarOperacion(operadorR, ambito, tablaTipos, errores);
        }else if(operadorL.rol ==TIPO_EXPRESION.VALOR && operadorR.rol == TIPO_EXPRESION.VALOR){
            resultadoL = this.procesarValor(operadorL, ambito, tablaTipos, errores, lenguaje);
            resultadoR = this.procesarValor(operadorR, ambito, tablaTi, errores, lenguaje);
        }
        if(resultadoL == null){
            return null;
        }else if(resultadoR == null){
            return null;
        }
        let operador = this.crearTipo(operacion.operador, resultadoL, resultadoR, operacion.linea, operacion.columna, operacion.lenguaje);
        return operador.operar(errores);
    }

    procesarValor(operacion, ambito, tablaTipos, errores, lenguaje){
        let valor = operacion.valor;
        let magnitud = operacion.magnitud;
        let tipo = operacion.tipo;
        let simbolo = null;
        let flag = false;
        if(tipo == TIPO_VALOR.IDENTIFICADOR ||
            tipo == TIPO_VALOR.PUNTERO_IDENTIFICADOR){
            flag=true;
            //Buscar localmente
            simbolo = tablaTipos.buscar(valor, ambito, TIPO_INSTRUCCION.DECLARACION, lenguaje);
        }else if(tipo == TIPO_VALOR.THIS_IDENTIFICADOR){
            //Buscar globalmente en la clase
            flag=true;
            let newAmbito = ambito.ambitoEnClase();
            if(newAmbito!=null){
                simbolo = tablaTipos.buscar(valor, newAmbito, TIPO_INSTRUCCION.DECLARACION, lenguaje);
            }
        }else if(tipo == TIPO_VALOR.METODO){
            flag=true;
            simbolo = tablaTipos.buscar(valor, ambito, TIPO_INSTRUCCION.METODO, lenguaje);
        }
        
        if(flag){
            if(simbolo!=null){
                if(simbolo.getEsArreglo()){
                    if(magnitud == null || magnitud.length == 0){
                        errores.push(new ErrorSemantico("No se indico la magnitud del arreglo", valor, operacion.linea, operacion.columna));
                    }
                }else{
                    tipo = ProcesadorTipos.convertirVariable(simbolo.getTipo());
                }
            }else{
                errores.push(new ErrorSemantico("El simbolo no existe", valor, operacion.linea, operacion.columna));
            }
        }
        
        return this.generarValorSegunTipo(operacion, tipo, errores);
    }

    generarValorSegunTipo(operacion, tipo, errores){
        if(tipo == TIPO_VALOR.DECIMAL){
            return new Decimal(operacion.valor, operacion.linea, operacion.coluna, operacion.lenguaje);
        }else if(tipo == TIPO_VALOR.ENTERO){
            return new Entero(operacion.valor, operacion.linea, operacion.coluna, operacion.lenguaje);
        }else if(tipo == TIPO_VALOR.CADENA){
            return new Cadena(operacion.valor, operacion.linea, operacion.coluna, operacion.lenguaje);
        }else if(tipo == TIPO_VALOR.CARACTER){
            return new Caracter(operacion.valor, operacion.linea, operacion.coluna, operacion.lenguaje);
        }else if(tipo == TIPO_VALOR.BOOLEAN){
            if(operacion.lenguaje == TIPO_LENGUAJE.JAVA){
                return new Booleano(operacion.valor, operacion.linea, operacion.coluna, operacion.lenguaje);
            }else{
                return new Entero(operacion.valor, operacion.linea, operacion.coluna, operacion.lenguaje);
            }
        }else if(tipo == TIPO_VALOR.ANY){
            return new Object(valor, operacion.linea, operacion.columna, lenguaje);
        }else{
            errores.push(new ErrorSemantico("El valor indicado no se puede operar, no debe ser void",operacion.valor,operacion.linea, operacion.columna ));
        }
        return null;
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

}

module.exports = Operador;