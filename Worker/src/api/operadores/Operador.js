const TIPO_EXPRESION = require("../Instrucciones").TIPO_EXPRESION;
const TIPO_DATO = require("../Instrucciones").TIPO_DATO;
const TIPO_VALOR = require('../Instrucciones').TIPO_VALOR;
const TIPO_LENGUAJE = require('../Instrucciones').TIPO_LENGUAJE;
const TIPO_INSTRUCCION = require('../Instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('../Instrucciones').TIPO_OPERACION;
const Booleano = require('../operadores/Booleano');
const Cadena = require('../operadores/Cadena');
const Caracter = require('../operadores/Caracter');
const Decimal = require('../operadores/Decimal');
const Entero = require('../operadores/Entero');
const Object = require('../operadores/Object');
const ProcesadorTipos = require('../ProcesadorTipos');
//Operadores
//Aritmeticos
const Suma = require('../operaciones/aritmeticos/Suma');
const Resta = require('../operaciones/aritmeticos/Resta');
const Multiplicacion = require('../operaciones/aritmeticos/Multiplicacion');
const Division = require('../operaciones/aritmeticos/Division');
const Mod  = require('../operaciones/aritmeticos/Mod');
const Pow = require('../operaciones/aritmeticos/Pow');
const Negativo = require('../operaciones/aritmeticos/Negativo');
//Comparativos
const Comparacion = require('../operaciones/comparaciones/Comparacion');
const Diferente = require('../operaciones/comparaciones/Diferente');
const Mayor = require('../operaciones/comparaciones/Mayor');
const MayorIgual = require('../operaciones/comparaciones/MayorIgual');
const Menor = require('../operaciones/comparaciones/Menor');
const MenorIgual = require('../operaciones/comparaciones/MenorIgual');
//Condicionales
const And = require('../operaciones/condicionales/And');
const Or = require('../operaciones/condicionales/Or');
const Not = require('../operaciones/condicionales/Not');


var ErrorSemantico = require('../../error/SemanticError');
class Operador{

    constructor(){

    }

    /**
     * Usar este
     * @param {*} operacion 
     * @param {*} ambito 
     * @param {*} tablaTipos 
     * @param {*} errores 
     * @returns 
     */
    procesarOperaciones(operacion, ambito, tablaTipos, errores){
        console.log("PROCESANDO OPERACIONES");
        if(operacion.rol == TIPO_EXPRESION.OPERACION){
            return this.procesarOperacion(operacion, ambito, tablaTipos, errores);
        }else if(operacion.rol == TIPO_EXPRESION.VALOR){
            return this.procesarValor(operacion, ambito, tablaTipos, errores, operacion.lenguaje);
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
            resultadoR = this.procesarValor(operadorR, ambito, tablaTipos, errores, lenguaje);
        }
        if(resultadoL == null){
            return null;
        }else if(resultadoR == null){
            return null;
        }
        console.log("OPERACION");
        console.log(operacion);
        let operador = this.crearTipo(operacion.operador, resultadoL, resultadoR, operacion.linea, operacion.columna, operacion.lenguaje);
        if(operador == null){
            return null;
        }
        return operador.operar(errores);
    }

    /**
     * Devuelve instancias del tipo de la clase
     * @param {*} parametros 
     * @param {*} ambito 
     * @param {*} tablaTipos 
     * @param {*} errores 
     * @returns 
     */
    calcularParametros(parametros, ambito, tablaTipos, errores){
        let arreglo = [];
        for(let index= 0; index<parametros.length; index++){
            let astExp = parametros[index];
            let tipoFinal = this.procesarOperaciones(astExp, ambito, tablaTipos, errores);
            if(tipoFinal!=null){
                arreglo.push(tipoFinal);
            }
        }
        return arreglo;
    }

    compararParametros(id, parametrosL, parametrosR,linea, columna, errores){
        if(parametrosL.length == parametrosR.length){
            let flag=false;
            for(let index=0; index<parametrosL.length; index++){
                if((parametrosL[index] instanceof parametrosR[index]) == false){
                    errores.push(new ErrorSemantico("Tipos no compatibles "+parametrosL.type(), id, linea, columna));
                    flag=true;
                }
            }
            if(flag){
                return true;
            }
            return false;
        }else{
            errores.push(new ErrorSemantico("Se esperaba que la cantidad de parametros fuera la misma", id,linea, columna ));
        }

        return true;
    }


    convertirParametros_tipo(parametros){
        let arreglo = [];
        for(let index=0; index<parametros.length; index++){
            let parametro = parametros[index];
            arreglo.push(this.convertirParametro(parametro.tipo));
        }   
        return arreglo;
    }

    convertirParametro(parametro){
        if(parametro == TIPO_VALOR.ENTERO || parametro == TIPO_DATO.INT){
            return Entero;
        }else if(parametro == TIPO_VALOR.DECIMAL || parametro == TIPO_DATO.FLOAT){
            return Decimal;
        }else if(parametro == TIPO_VALOR.CARACTER || parametro == TIPO_DATO.CHAR){
            return Caracter;
        }else if(parametro == TIPO_VALOR.CADENA || parametro == TIPO_DATO.STRING){
            return Cadena;
        }else if(parametro == TIPO_VALOR.BOOLEAN || parametro == TIPO_DATO.BOOLEAN){
            return Booleano;
        }else if(parametro == TIPO_VALOR.ANY || parametro == TIPO_DATO.ANY){
            return Object;
        }
        return null;
    }

    convertirArregloObjeto_Parametro(parametros){
        let array=[];
        for(let index=0; index<parametros.length; index++){
            let parametro = parametros[index];
            let answer = this.convertirObjeto_Tipo(parametro);
            array.push(answer);
        }
        return array;
    }

    procesarValor(operacion, ambito, tablaTipos, errores, lenguaje){
        let valor = operacion.valor;
        let magnitud = operacion.magnitud;
        let tipo = operacion.tipo;
        let paqueteria = "";
        if(ambito!=null){
            paqueteria = ambito.getPaqueteria();
        }
        let simbolo = null;
        let flag = false;
        if(tipo == TIPO_VALOR.IDENTIFICADOR ||
            tipo == TIPO_VALOR.PUNTERO_IDENTIFICADOR){
            flag=true;
            //Buscar localmente
            simbolo = tablaTipos.buscarP(valor, ambito, TIPO_INSTRUCCION.DECLARACION, lenguaje, paqueteria);
            tablaTipos.imprimirSimbolos();
            
        }else if(tipo == TIPO_VALOR.THIS_IDENTIFICADOR){
            //Buscar globalmente en la clase
            flag=true;
            let newAmbito = ambito.ambitoEnClase();
            if(newAmbito!=null){
                simbolo = tablaTipos.buscarP(valor, newAmbito, TIPO_INSTRUCCION.DECLARACION, lenguaje, paqueteria);
            }
            if(simbolo == null){
                console.log("Simbolo %s No encontrado"), valor;
                console.error(newAmbito);
            }
        }else if(tipo == TIPO_VALOR.METODO){
            //Manejo de metodos
            flag=true;

            let metodo = valor;
            let idMetodo = metodo.id;
            let parametrosMetodo = metodo.parametros;
            let newParametros = this.calcularParametros(parametrosMetodo);    
            newParametros = this.convertirArregloObjeto_Parametro(newParametros);
            let lenguajeMetodo = metodo.lenguaje;
            let paqueteria = "";
            if(ambito!=null){
                paqueteria = ambito.getPaqueteria();
            }
            if(lenguajeMetodo == TIPO_LENGUAJE.C){
                let cadenas = idMetodo.split(".");
                if(cadenas[0] == "PY"){ 
                    let identificadorMetodo = cadenas[1];
                    simbolo = tablaTipos.buscarFuncion(identificadorMetodo, null, TIPO_INSTRUCCION.FUNCION,newParametros )
                }else if(cadenas[0] == "JAVA"){
                    let identificadorVar = cadenas[1];
                    let identificadorMetodo = cadenas[2];
                    let simboloVar = tablaTipos.buscarP(identificadorVar, ambito, TIPO_INSTRUCCION.DECLARACION, lenguaje, paqueteria);
                    if(simboloVar!=null){
                        let newAmbito = simboloVar.getTipo();
                        if(newAmbito!=null){
                            simbolo = tablaTipos.buscarFuncion(identificadorMetodo, newAmbito, TIPO_INSTRUCCION.FUNCION, newParametros);
                        }
                    }else{
                        errores.push(new ErrorSemantico("No se encontro la variable en el contexto actual",identificadorVar, instruccion.linea, instruccion.columna ));
                    }
                }
            }else{
                //Java y Python
                simbolo = tablaTipos.buscarFuncion(idMetodo, ambito, TIPO_INSTRUCCION.FUNCION, newParametros);
            }
        }
        
        console.log("BUSCANDO VALOR EN PROCESAR VALOR");
        console.log(operacion);
        console.log(simbolo);
        console.log("FIN................");
        if(flag){
            if(simbolo!=null){
                if(simbolo.getEsArreglo()){
                    if(magnitud == null ){
                        errores.push(new ErrorSemantico("No se indico la magnitud del arreglo", valor, operacion.linea, operacion.columna));
                    }else if(magnitud.length == 0){
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

    generarValorVacioSegunTipo(tipo, errores, lenguaje){    
        if(tipo == TIPO_VALOR.DECIMAL || tipo == TIPO_DATO.FLOAT){
            return new Decimal(undefined, undefined, undefined, undefined);
        }else if(tipo == TIPO_VALOR.ENTERO || tipo == TIPO_DATO.INT){
            return new Entero(undefined, undefined, undefined, undefined);
        }else if(tipo == TIPO_VALOR.CADENA || tipo == TIPO_DATO.STRING){
            return new Cadena(undefined, undefined, undefined, undefined);
        }else if(tipo == TIPO_VALOR.CARACTER || tipo == TIPO_DATO.CHAR){
            return new Caracter(undefined, undefined, undefined, undefined);
        }else if(tipo == TIPO_VALOR.BOOLEAN || tipo == TIPO_DATO.BOOLEAN){
            if(lenguaje == TIPO_LENGUAJE.JAVA){
                return new Booleano(undefined, undefined, undefined, undefined);
            }else{
                return new Entero(undefined, undefined, undefined, undefined);
            }
        }else if(tipo == TIPO_VALOR.ANY){
            return new Object(undefined, undefined, undefined, undefined);
        }else if(tipo == TIPO_INSTRUCCION.GETCH){
            return new Entero(undefined, undefined, undefined, undefined);
        }else{
            errores.push(new ErrorSemantico("El valor indicado no se puede operar, solo se permiten valores primitivos",operacion.valor,operacion.linea, operacion.columna ));
        }
        return null;    
    }

    generarValorSegunTipo(operacion, tipo, errores){
        if(tipo == TIPO_VALOR.DECIMAL || tipo == TIPO_DATO.FLOAT){
            return new Decimal(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
        }else if(tipo == TIPO_VALOR.ENTERO || tipo == TIPO_DATO.INT){
            return new Entero(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
        }else if(tipo == TIPO_VALOR.CADENA || tipo == TIPO_DATO.STRING){
            return new Cadena(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
        }else if(tipo == TIPO_VALOR.CARACTER || tipo == TIPO_DATO.CHAR){
            return new Caracter(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
        }else if(tipo == TIPO_VALOR.BOOLEAN || tipo == TIPO_DATO.BOOLEAN){
            if(operacion.lenguaje == TIPO_LENGUAJE.JAVA){
                return new Booleano(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
            }else{
                return new Entero(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
            }
        }else if(tipo == TIPO_VALOR.ANY){
            return new Object(operacion.valor, operacion.linea, operacion.columna, lenguaje);
        }else if(tipo == TIPO_INSTRUCCION.GETCH){
            return new Entero(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
        }else{
            errores.push(new ErrorSemantico("El valor indicado no se puede operar, solo se permiten valores primitivos",operacion.valor,operacion.linea, operacion.columna ));
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

    convertirObjeto_Tipo(tipo){
        if(tipo instanceof Booleano){
            return TIPO_DATO.BOOLEAN;
        }else if(tipo instanceof Caracter){
            return TIPO_DATO.CHAR;
        }else if(tipo instanceof Entero){
            return TIPO_DATO.INT;
        }else if(tipo instanceof Decimal){
            return TIPO_DATO.FLOAT;
        }else if(tipo instanceof String){
            return TIPO_DATO.STRING;
        }else if(tipo instanceof Object){
            return TIPO_DATO.ANY;
        }
        return null;
    }

}

module.exports = Operador;