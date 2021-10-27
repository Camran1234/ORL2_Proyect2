var TIPO_INSTRUCCION = require('./Instrucciones').TIPO_INSTRUCCION;
var TIPO_VALOR = require('./Instrucciones').TIPO_INSTRUCCION;
var TIPO_LENGUAJE = require('./Instrucciones').TIPO_LENGUAJE;
var TIPO_SWITCH = require('./Instrucciones').TIPO_SWITCH;
var TIPO_EXPRESION = require('./Instrucciones').TIPO_EXPRESION;
var TIPO_VISIBILIDAD = require('./Instrucciones').TIPO_VISIBILIDAD;
function nuevaOperacion(operadorL, operadorR, operador, lenguaje, linea, columna){
    return{
        operadorL: operadorL,
        operadorR: operadorR,
        operador: operador,
        lenguaje:lenguaje,
        linea: linea,
        columna: columna,
        rol:TIPO_EXPRESION.OPERACION
    }
}

function newError(linea, columna, tipo, error, descripcion){
    return{
        Fila:linea,
        Columna:columna,
        Tipo_de_Error:tipo,
        Simbolo_provocador:error,
        Descripcion:descripcion
    }
}

const TIPO_ERROR = {
    errorLexico: function(token, linea, columna){
        return newError(linea, columna, "Error Lexico", token, "Lexema no reconocido");
    },
    errorSintactico: function(descripcion, token, linea, columna){
        return newError(linea, columna, "Error Sintactico", token, descripcion);
    },
    errorSemantico: function (descripcion, token, linea, columna){
        return newError(linea, columna, "Error Semantico", token, descripcion);
    }
}

const instruccionesApi = {

    /**
     *  Genera una operacion Binaria entre dos expresiones
     * @param {*} operadorL 
     * @param {*} operadorR 
     * @param {*} operador 
     * @returns 
     */
    operacionAritmetica: function(operadorL, operadorR, operador, lenguaje, linea, columna){
        let result = nuevaOperacion(operadorL, operadorR, operador, lenguaje, linea, columna);
        console.log("NUEVA OPERACION ARITMETICA");
        console.log(result);
        return result;
    },

    /**
     * Genera una operacion Unaria de la expresion
     * @param {*} operadorL 
     * @param {*} operador 
     * @returns 
     */
    operacionUnaria: function(operadorL, operador, lenguaje, linea, columna){
        return nuevaOperacion(operadorL, null, operador, lenguaje, linea, columna);
    },

    /**
     *  Genera una literal de la expresion puede ser de tipo un identificador, int, float...
     * @param {*} valor 
     * @param {*} tipo 
     * @returns 
     */
    nuevoValor: function(valor,magnitud, tipo, lenguaje,linea, columna){
        let puntero = false;
        return {
            valor: valor,
            magnitud:magnitud,
            tipo: tipo,
            puntero: puntero,
            lenguaje:lenguaje,
            linea: linea,
            columna: columna,
            rol:TIPO_EXPRESION.VALOR
        }
    }, 

    nuevoInclude: function(paqueteria, lenguaje, linea, columna) {
        return {
            paqueteria:paqueteria,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna,
            rol: TIPO_INSTRUCCION.INCLUDE
        }
    }
    ,

    /**
     * Genera un nuevo parametro para indicarle a la funcion
     * @param {*} id
     * @param {*} tipo 
     */
    nuevoParametro: function(id, tipo, puntero, lenguaje,linea, columna){
        return {
            id: id,
            tipo: tipo,
            puntero: puntero,
            lenguaje:lenguaje,
            linea: linea, 
            columna:columna
        }
    },

    /**
     * Genera una nueva clase con un nombre, unas instrucciones a seguir, y una paqueteria
     *  que es la direccion de la clase
     * @param {*} id 
     * @param {*} instrucciones 
     * @param {*} paqueteria 
     * @returns 
     */
    nuevaClase: function(visibilidad, id, idExtension, instrucciones, paqueteria, lenguaje,linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return {
            id: id,
            extension:idExtension,
            rol: TIPO_INSTRUCCION.CLASE,
            visibilidad:visibilidad,
            instrucciones: instrucciones,
            paqueteria: paqueteria,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },

    nuevoConstructor: function(visibilidad, id, instrucciones, parametros, lenguaje,linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return{
            id:id,
            rol: TIPO_INSTRUCCION.CONSTRUCTOR,
            visibilidad: visibilidad, 
            instrucciones: instrucciones,
            parametros: parametros,
            lenguaje:lenguaje,
            linea:linea, 
            columna:columna
        }
    },
    /**
     * Genera una nueva funcion con un identificador, con una serie de instrucciones a seguir,
     * y una serie de parametros que puede o no contener
     * @param {*} id 
     * @param {*} instrucciones 
     * @param {*} parametros 
     * @returns
     */
    nuevaFuncion: function(visibilidad, id, tipo, instrucciones, parametros, lenguaje,linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return {
            id:id,
            rol: TIPO_INSTRUCCION.FUNCION,
            tipo: tipo,
            instrucciones: instrucciones,
            parametros: parametros,
            visibilidad:visibilidad,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },

    nuevoMain: function(instrucciones, lenguaje, linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return {
            instrucciones: instrucciones,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna,
            rol:TIPO_INSTRUCCION.MAIN
        }
    }
    ,
    /**
     * Genera una una nueva declaracion
     * @param {*} identificador 
     * @param {*} tipo 
     */
    nuevaDeclaracion: function (visibilidad, id, magnitud,  tipo, lenguaje,linea, columna) {
        return {
            id:id,
            visibilidad:visibilidad,
            magnitud: magnitud,
            rol:TIPO_INSTRUCCION.DECLARACION,
            tipo:tipo,
            lenguaje:lenguaje,
            linea:linea, 
            columna:columna
        }
    },
    
    nuevaVariable: function(arreglo, lenguaje,linea, columna){
        return {
            rol:TIPO_INSTRUCCION.VARIABLE,
            arreglo: arreglo,
            lenguaje:lenguaje,
            linea: linea, 
            columna:columna
        }
    },

    tipoAsignacion: function (arreglo, rol){
        return {
            rol:rol,
            arreglo:arreglo
        }
    },

    nuevaAsignacionClase: function(id, parametros, tipo, lenguaje, linea, columna){
        return {
            rol: TIPO_INSTRUCCION.ASIGNACION_CLASE,
            id: id,
            visibilidad: TIPO_VISIBILIDAD.LOCAL,
            parametros: parametros,
            tipo: tipo,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },
    /**
     * Agrega una nueva asignacion pero ahora con el operador indicamos que
     * tipo de operacion especial hara como una suma, resta, por, entre otros; luego
     * agregara esa operacion al identificador
     * @param {*} id 
     * @param {*} operador 
     * @param {*} expresion 
     * @returns 
     */
    nuevaAsignacion_O: function(id,magnitud,  operador, expresion, lenguaje,linea, columna){
        return {
            id:id,
            magnitud: magnitud,
            rol:TIPO_INSTRUCCION.ASIGNACION_O,
            operador: operador,
            expresion: expresion,
            lenguaje:lenguaje,
            linea: linea,
            columna:columna
        }
    },

    /**
     * Genera un nuevo if
     * @param {*} expresion 
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoIf: function(expresion, instrucciones, lenguaje,linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return {
            condicion: expresion,
            instrucciones: instrucciones,
            rol:TIPO_INSTRUCCION.IF,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },
    /**
     * Genera un nuevo else con la expresion logica e instrucciones
     * Sin embargo el if_father es el if del que viene 
     * @param {*} expresion 
     * @param {*} instrucciones 
     * @param {*} if_father 
     */
    nuevoElse: function(expresion, instrucciones, if_father, lenguaje,linea, columna){
        if(instrucciones == null){
            instrucciones = [];
        }
        return {
            condicion:expresion,
            instrucciones:instrucciones,
            if:if_father,
            rol: TIPO_INSTRUCCION.ELSE,
            lenguaje:lenguaje,
            linea:linea, 
            columna:columna
        }
    },

    /**
     * Genera una nueva instruccion switch con un id que sera la variable a tomar en cuenta, 
     * Genera una nueva serie de instrucciones en base a los casos
     * @param {*} id 
     * @param {*} cases 
     * @returns 
     */
    nuevoSwitch:function(id, cases, lenguaje, linea, columna){
        return {
            id: id,
            cases:cases,
            rol:TIPO_INSTRUCCION.SWITCH,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },

    /**
     * Genera un nuevo caso para switch
     * @param {*} expresion 
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoCase: function(expresion, instrucciones, lenguaje, linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return {
            condicion:expresion,
            instrucciones: instrucciones,
            rol: TIPO_SWITCH.CASE,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },
    /**
     * Genera un caso default
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoDefault: function(instrucciones, lenguaje, linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return{
            instrucciones:instrucciones,
            rol: TIPO_SWITCH.DEFAULT,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },
    /**
     * Genera un nuevo ciclo for, valor inicial son las acciones iniciales,
     * La expresion es la condicion del ciclo, accion post lo que hara tras cada iteracion, e
     * instrucciones la serie de declaraciones que tomara a cabo
     * @param {*} valor_inicial 
     * @param {*} expresion 
     * @param {*} accion_post 
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoFor: function(valor_inicial, expresion, accion_post, instrucciones, lenguaje, linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        if(!Array.isArray(valor_inicial)){
            let helper = [];
            helper.push(valor_inicial);
            valor_inicial = helper;
        }
        if(!Array.isArray(accion_post)){
            let helper = [];
            helper.push(accion_post);
            accion_post = helper;
        }   
        return{
            valor_inicial:valor_inicial,
            condicion: expresion,
            accion_post: accion_post,
            instrucciones:instrucciones,
            rol: TIPO_INSTRUCCION.FOR,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },

    /**
     * Genera un nuevo while, donde expresion es la condicion, e instrucciones las instrucciones
     * que seguira hasta que la condicion sea correcta
     * @param {*} expresion 
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoWhile: function(expresion, instrucciones, lenguaje, linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return{
            condicion: expresion,
            instrucciones:instrucciones,
            rol: TIPO_INSTRUCCION.WHILE,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },
    /**
     * Genera un nuevo Do , donde instrucciones los pasos que seguira, y la condicion
     * del while por el cual esta restringido
     * @param {*} instrucciones 
     * @param {*} while_ 
     * @returns 
     */
    nuevoDoWhile: function(instrucciones, condicion, lenguaje, linea, columna){
        if(instrucciones == undefined){
            instrucciones = [];
        }
        return{
            instrucciones: instrucciones,
            condicion:condicion, 
            rol:TIPO_INSTRUCCION.DO,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },
    /**
     * 
     * @param {*} parametros 
     * @returns 
     */
    nuevoImprimir: function(parametros,tipo, lenguaje, linea, columna){
        return{
            parametros:parametros,
            tipo:tipo,
            rol:TIPO_INSTRUCCION.IMPRIMIR,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },

    nuevoScan: function(id, cadena, lenguaje, linea, columna){
        return {
            id:id,
            cadena:cadena,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna,
            rol:TIPO_INSTRUCCION.SCAN
        }
    },

    nuevoContinue: function(linea, columna){
        return{
            rol: TIPO_INSTRUCCION.CONTINUE,
            linea:linea,
            columna:columna
        }
    },

    nuevoBreak: function(linea, columna){
        return{
            rol: TIPO_INSTRUCCION.BREAK,
            linea:linea,
            columna:columna
        }
    },

    nuevoClean: function(linea, columna){
        return {
            rol : TIPO_INSTRUCCION.CLEAN,
            linea:linea, 
            columna:columna
        }
    },

    nuevoGetch: function(linea, columna){
        return{
            valor: 'scanf()',
            magnitud:[],
            tipo: TIPO_VALOR.INPUT_INT,
            puntero: false,
            lenguaje: TIPO_LENGUAJE.C,
            linea: linea,
            columna: columna,
            rol:TIPO_INSTRUCCION.GETCH
        }
    },

    nuevoReturn: function(expresion, lenguaje, linea, columna){
        return{
            rol: TIPO_INSTRUCCION.RETURN,
            expresion: expresion,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    },

    nuevoMetodo: function(id, parametros, lenguaje, linea, columna){
        return {
            rol: TIPO_INSTRUCCION.METODO,
            id:id,
            parametros:parametros,
            lenguaje:lenguaje,
            linea:linea,
            columna:columna
        }
    }
}

module.exports.instruccionesApi = instruccionesApi;
module.exports.TIPO_ERROR = TIPO_ERROR;