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
const Any = require("../operadores/Any");
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
//
const instruccionesApi = require('../InstruccionesApi').instruccionesApi;

var ErrorSemantico = require('../../error/SemanticError');
class Operador{

    constructor(){
        this.codigo3D = "";
        this.operacion = null;
        this.opcion = 0;
        this.paramsO = [];
    }

    getParamsO(){
        return this.paramsO;
    }

    getOperacion(){
        return this.operacion;
    }

    getCodigo3D(){
        return this.codigo3D;
    }

    /**
     * Devuelve objeto ya sea 
     * @param {*} operacion 
     * @param {*} ambito 
     * @param {*} tablaTipos 
     * @param {*} errores 
     * @returns 
     */
    procesarOperaciones(operacion, ambito, tablaTipos, errores){
        
        this.paramsO = [];
        if(Array.isArray(operacion)){
            let ast = [];
            for(let index=0; index<operacion.length; index++){
                let operador = new Operador();
                ast.push(operador.procesar(operacion[index], ambito, tablaTipos, errores));
                this.paramsO.push(operador.getOperacion());
                this.operacion = operador.getOperacion();
            }
            if(ast.length>1){
                return ast;
            }else{
                return ast[0];
                
            }
        }else{
            let operador = new Operador();
            let aux = operador.procesar(operacion, ambito, tablaTipos, errores);
            this.paramsO.push(operador.getOperacion());
            this.operacion = operador.getOperacion();
            return aux;
        }
        

    }

    procesar(operacion, ambito, tablaTipos, errores){
        if(operacion.rol == TIPO_EXPRESION.OPERACION){
            return this.procesarOperacion(operacion, ambito, tablaTipos, errores);
        }else if(operacion.rol == TIPO_EXPRESION.VALOR){
            let resultado = this.procesarValor(operacion, ambito, tablaTipos, errores, operacion.lenguaje);
            this.operacion = resultado;
            return resultado;
        }
    }


    procesarOperacion(operacion, ambito, tablaTipos, errores){
        let operadorL = operacion.operadorL;
        let operadorR = operacion.operadorR;
        let lenguaje = operacion.lenguaje;
        let resultadoL=null;
        let resultadoR = null;
        
        if(operadorR!=null){
            if(operadorL.rol == TIPO_EXPRESION.OPERACION && operadorR.rol == TIPO_EXPRESION.OPERACION){
                let newOperadorL = new Operador();
                let newOperadorR = new Operador();
                resultadoL = newOperadorL.procesarOperacion(operadorL, ambito, tablaTipos, errores);
                resultadoR = newOperadorR.procesarOperacion(operadorR, ambito, tablaTipos, errores);
                //Operar siemre al final
                this.operacion = this.crearTipo(operacion.operador, newOperadorL.getOperacion(), newOperadorR.getOperacion(), operacion.linea, operacion.columna, operacion.lenguaje);
            }else if(operadorL.rol == TIPO_EXPRESION.OPERACION && operadorR.rol == TIPO_EXPRESION.VALOR){
                let newOperadorL = new Operador();
                resultadoL = newOperadorL.procesarOperacion(operadorL, ambito, tablaTipos, errores);
                resultadoR = this.procesarValor(operadorR, ambito, tablaTipos, errores, lenguaje);
                this.operacion = this.crearTipo(operacion.operador, newOperadorL.getOperacion(), resultadoR, operacion.linea, operacion.columna, operacion.lenguaje);
            }else if(operadorL.rol == TIPO_EXPRESION.VALOR && operadorR.rol == TIPO_EXPRESION.OPERACION){
                let newOperadorR = new Operador();
                resultadoL = this.procesarValor(operadorL, ambito, tablaTipos, errores, lenguaje);
                resultadoR = newOperadorR.procesarOperacion(operadorR, ambito, tablaTipos, errores);
                //operando
                this.operacion = this.crearTipo(operacion.operador, resultadoL,newOperadorR.getOperacion(), operacion.linea, operacion.columna, operacion.lenguaje );
            }else if(operadorL.rol ==TIPO_EXPRESION.VALOR && operadorR.rol == TIPO_EXPRESION.VALOR){
                resultadoL = this.procesarValor(operadorL, ambito, tablaTipos, errores, lenguaje);
                resultadoR = this.procesarValor(operadorR, ambito, tablaTipos, errores, lenguaje);
                this.operacion = this.crearTipo(operacion.operador, resultadoL, resultadoR, operacion.linea, operacion.columna);
            }
            if(resultadoL == null){
                return null;
            }else if(resultadoR == null){
                return null;
            }
        }else{
            if(operadorL.rol == TIPO_EXPRESION.OPERACION){
                let newOperadorL = new Operador();
                resultadoL = newOperadorL.procesarOperacion(operadorL, ambito, tablaTipos, errores);
                this.operacion = this.crearTipo(operacion.operador, newOperadorL.getOperacion(), null, operacion.linea, operacion.columna, operacion.lenguaje);
            }else if(operadorL.rol == TIPO_EXPRESION.VALOR){
                resultadoL = this.procesarValor(operadorL, ambito, tablaTipos, errores, lenguaje);
                this.operacion = this.crearTipo(operacion.operador, resultadoL, null, operacion.linea, operacion.columna);
            }
        }

        
        let operador = this.crearTipo(operacion.operador, resultadoL, resultadoR, operacion.linea, operacion.columna, operacion.lenguaje);
        if(operador == null){
            return null;
        }
        let resultadoOperador = operador.operar(errores);
        this.operacion.setTipo(resultadoOperador);
        return resultadoOperador;
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
        if(parametros!=null){
            for(let index= 0; index<parametros.length; index++){
                let astExp = parametros[index];
                let tipoFinal = this.procesarOperaciones(astExp, ambito, tablaTipos, errores);
                if(tipoFinal!=null){
                    arreglo.push(tipoFinal);
                }
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
            return Any;
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

    convertirTIPODATO_Parametro(parametros){
        let arreglo = [];
        for(let index=0; index< parametros.length; index++){
            arreglo.push(instruccionesApi.nuevoParametro("", parametros[index], false, "", 0,0));
        }
        return arreglo;
    }

    procesarValor(operacion, ambito, tablaTipos, errores, lenguaje){
        let valor = operacion.valor;
        let magnitud = operacion.magnitud;
        let tipo = operacion.tipo;
        let paqueteria = "";
        if(ambito!=null){
            paqueteria = ambito.getPaqueteria();
        }
        //1 para identificador, 2 para puntero, 3 para this, 4 para metodo
        let opcion = 0;
        let simbolo = null;
        let flag = false;
        const Metodo = require('../instrucciones/Metodo');
        let metodoInstruccion = null;
        let magnitudO = [];

        if(tipo == TIPO_VALOR.IDENTIFICADOR ||
            tipo == TIPO_VALOR.PUNTERO_IDENTIFICADOR){
            flag=true;
            //Buscar localmente
            simbolo = tablaTipos.buscarP(valor, ambito, TIPO_INSTRUCCION.DECLARACION, lenguaje, paqueteria);//La declaracion
            if(tipo == TIPO_VALOR.IDENTIFICADOR){
                opcion = 1;
            }else{
                opcion = 2;
            }
            if(simbolo!=null){
                metodoInstruccion = simbolo.getInstruccion();
                //Proceso para encontrar las coordenadas
                let operador = new Operador();
                operador.calcularParametros(magnitud, ambito, tablaTipos, errores);
                magnitudO = operador.getParamsO();
            }
        }else if(tipo == TIPO_VALOR.THIS_IDENTIFICADOR){
            //Buscar globalmente en la clase
            opcion = 3;
            flag=true;
            let newAmbito = ambito.ambitoEnClase();
            if(newAmbito!=null){
                simbolo = tablaTipos.buscarP(valor, newAmbito, TIPO_INSTRUCCION.DECLARACION, lenguaje, paqueteria);
                if(simbolo!=null){
                    metodoInstruccion = simbolo.getInstruccion();
                    let operador = new Operador();
                    operador.calcularParametros(magnitud, ambito, tablaTipos, errores);
                    magnitudO = operador.getParamsO();
                }
            }
        }else if(tipo == TIPO_VALOR.METODO){
            //Manejo de metodos
            flag=true;

            let metodo = valor;
            let idMetodo = metodo.id;
            let parametrosMetodo = metodo.parametros;
            let operadorNuevo = new Operador();
            let newParametros = operadorNuevo.calcularParametros(parametrosMetodo, ambito, tablaTipos, errores);    
            newParametros = operadorNuevo.convertirArregloObjeto_Parametro(newParametros);
            newParametros = operadorNuevo.convertirTIPODATO_Parametro(newParametros);
            let lenguajeMetodo = metodo.lenguaje;
            let paqueteria = "";
            metodoInstruccion = new Metodo(idMetodo, newParametros, operacion.linea, operacion.columna, operacion.lenguaje, ambito, paqueteria, null, null);
            metodoInstruccion.setParametrosO(operadorNuevo.getParamsO);//arreglo de los objetos generados correctamente
            if(ambito!=null){
                paqueteria = ambito.getPaqueteria();
            }
            if(lenguajeMetodo == TIPO_LENGUAJE.C){
                let cadenas = idMetodo.split(".");
                if(cadenas[0] == "PY"){ 
                    let identificadorMetodo = cadenas[1];
                    simbolo = tablaTipos.buscarFuncion(identificadorMetodo, null, TIPO_INSTRUCCION.FUNCION,newParametros )
                    opcion = 4;
                    metodoInstruccion.setId(identificadorMetodo);
                    if(simbolo!=null){
                        metodoInstruccion.setFuncionReferencia(simbolo.getInstruccion());
                    }
                }else if(cadenas[0] == "JAVA"){
                    opcion = 5;
                    let identificadorVar = cadenas[1];
                    let identificadorMetodo = cadenas[2];
                    let simboloVar = tablaTipos.buscarP(identificadorVar, ambito, TIPO_INSTRUCCION.DECLARACION, lenguaje, paqueteria);
                    if(simboloVar!=null){
                        let newAmbito = simboloVar.getTipo();
                        metodoInstruccion.setVariableReferencia(simboloVar.getInstruccion());
                        if(newAmbito!=null){
                            simbolo = tablaTipos.buscarFuncion(identificadorMetodo, newAmbito, TIPO_INSTRUCCION.FUNCION, newParametros);
                            if(simbolo!=null){
                                metodoInstruccion.setFuncionReferencia(simbolo.getInstruccion());
                                metodoInstruccion.setId(identificadorMetodo);
                            }
                        }
                    }else{
                        errores.push(new ErrorSemantico("No se encontro la variable en el contexto actual",identificadorVar, instruccion.linea, instruccion.columna ));
                    }
                }
            }else{
                //Java y Python
                opcion = 4;
                simbolo = tablaTipos.buscarFuncion(idMetodo, ambito, TIPO_INSTRUCCION.FUNCION, newParametros);
                if(simbolo!=null){
                    metodoInstruccion.setFuncionReferencia(simbolo.getInstruccion());
                }
            }
        }
        let instruccion = metodoInstruccion;
        if(flag){
            if(simbolo!=null){
                if(simbolo.getEsArreglo()){
                    if(magnitud == null ){
                        errores.push(new ErrorSemantico("No se indico la magnitud del arreglo", valor, operacion.linea, operacion.columna));
                    }else if(magnitud.length == 0){
                        errores.push(new ErrorSemantico("No se indico la magnitud del arreglo", valor, operacion.linea, operacion.columna));
                    }
                }                    
                tipo = ProcesadorTipos.convertirVariable(simbolo.getTipo());
            }else{
                errores.push(new ErrorSemantico("El simbolo no existe", valor, operacion.linea, operacion.columna));
            }
        }        
        return this.generarValorSegunTipo_(operacion, tipo, errores,instruccion, opcion, magnitudO );
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
            return new Any(undefined, undefined, undefined, undefined);
        }else if(tipo == TIPO_INSTRUCCION.GETCH){
            return new Entero(undefined, undefined, undefined, undefined);
        }else{
            errores.push(new ErrorSemantico("El valor indicado no se puede operar, solo se permiten valores primitivos",operacion.valor,operacion.linea, operacion.columna ));
        }
        return null;    
    }

    generarValorSegunTipo_(operacion, tipo, errores, instruccion, estado, magnitudO){
        if(tipo == TIPO_VALOR.DECIMAL || tipo == TIPO_DATO.FLOAT
            || tipo == TIPO_VALOR.INPUT_FLOAT){
            let decimal = new Decimal(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
            decimal.setInstruccion(instruccion);
            decimal.setEstado(estado);
            decimal.setParamsO(magnitudO);
            return decimal;
        }else if(tipo == TIPO_VALOR.ENTERO || tipo == TIPO_DATO.INT
            || tipo == TIPO_VALOR.INPUT_INT){
            let entero = new Entero(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
            entero.setInstruccion(instruccion);
            entero.setEstado(estado);
            entero.setParamsO(magnitudO);
            return entero;
        }else if(tipo == TIPO_VALOR.CADENA || tipo == TIPO_DATO.STRING){
            let cadena = new Cadena(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
            cadena.setInstruccion(instruccion);
            cadena.setEstado(estado);
            cadena.setParamsO(magnitudO);
            return cadena;
        }else if(tipo == TIPO_VALOR.CARACTER || tipo == TIPO_DATO.CHAR
            || tipo == TIPO_VALOR.INPUT_CHAR){
            let caracter = new Caracter(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
            caracter.setInstruccion(instruccion);
            caracter.setEstado(estado);
            caracter.setParamsO(magnitudO);
            return caracter;
        }else if(tipo == TIPO_VALOR.BOOLEAN || tipo == TIPO_DATO.BOOLEAN){
            if(operacion.lenguaje == TIPO_LENGUAJE.JAVA){
                let boleano = new Booleano(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
                boleano.setInstruccion(instruccion);
                boleano.setEstado(estado);
                boleano.setParamsO(magnitudO);
                return boleano;
            }else{
                let entero = new Entero(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
                entero.setInstruccion(instruccion);
                entero.setEstado(estado);
                entero.setParamsO(magnitudO);
                return entero;
            }
        }else if(tipo == TIPO_VALOR.ANY || tipo == TIPO_VALOR.INPUT){
            let objeto = new Any(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
            objeto.setInstruccion(instruccion);
            objeto.setEstado(estado);
            objeto.setParamsO(magnitudO);
            return objeto;
        }else if(tipo == TIPO_INSTRUCCION.GETCH){
            let entero = new Entero(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
            entero.setInstruccion(instruccion);
            entero.setEstado(estado);
            entero.setParamsO(magnitudO);
            return entero;
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
            return new Any(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
        }else if(tipo == TIPO_INSTRUCCION.GETCH){
            return new Entero(operacion.valor, operacion.linea, operacion.columna, operacion.lenguaje);
        }else{
            errores.push(new ErrorSemantico("El valor indicado no se puede operar, solo se permiten valores primitivos",operacion.valor,operacion.linea, operacion.columna ));
        }
        return null;
    }

    crearTipo(operador, operadorL, operadorR,linea, columna, lenguaje){
        //Operador L y operadorR son objetos con valores
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
        }else if( tipo instanceof Any){
            return TIPO_DATO.ANY;
        }
        return null;
    }

}

module.exports = Operador;