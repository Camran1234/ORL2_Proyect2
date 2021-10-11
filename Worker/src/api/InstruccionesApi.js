var TIPO_INSTRUCCION = require('./Instrucciones').TIPO_INSTRUCCION;
var TIPO_SWITCH = require('./Instrucciones').TIPO_SWITCH;
var TIPO_VISIBILIDAD = require('./Instrucciones'.TIPO_VISIBILIDAD);
var TIPO_ENTRADA = require('./Instrucciones').TIPO_ENTRADA;
function nuevaOperacion(operadorL, operadorR, operador){
    return{
        operadorL: operadorL,
        operadorR: operadorR,
        operador: operador
    }
}

const instrucionesApi = {

    /**
     *  Genera una operacion Binaria entre dos expresiones
     * @param {*} operadorL 
     * @param {*} operadorR 
     * @param {*} operador 
     * @returns 
     */
    operacionAritmetica: function(operadorL, operadorR, operador){
        return nuevaOperacion(operadorL, operadorR, operador);
    },

    /**
     * Genera una operacion Unaria de la expresion
     * @param {*} operadorL 
     * @param {*} operador 
     * @returns 
     */
    operacionUnaria: function(operadorL, operador){
        return nuevaOperacion(operadorL, undefined, operador);
    },

    /**
     *  Genera una literal de la expresion puede ser de tipo un identificador, int, float...
     * @param {*} valor 
     * @param {*} tipo 
     * @returns 
     */
    nuevoValor: function(valor, tipo){
        return {
            valor: valor,
            tipo: tipo
        }
    },

    /**
     * Genera un nuevo parametro para indicarle a la funcion
     * @param {*} id
     * @param {*} tipo 
     */
    nuevoParametro: function(id, tipo){
        return {
            id: id,
            tipo: tipo
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
    nuevaClase: function(id, instrucciones, paqueteria){
        return {
            id: id,
            rol: TIPO_INSTRUCCION.CLASE,
            instrucciones: instrucciones,
            paqueteria: paqueteria
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
    nuevaFuncion: function(id, instrucciones, parametros){
        return {
            id:id,
            rol: TIPO_INSTRUCCION.FUNCION,
            instrucciones: instrucciones,
            parametros: parametros
        }
    },
    /**
     * Genera una una nueva declaracion
     * @param {*} identificador 
     * @param {*} tipo 
     */
    nuevaDeclaracion: function (id, tipo) {
        return {
            id:id,
            rol:TIPO_INSTRUCCION.DECLARACION,
            tipo:tipo
        }
    },
    /**
     * Genera una nueva asignacion para agregarle la expresion al id
     * @param {*} id 
     * @param {*} expresion 
     * @returns 
     */
    nuevaAsignacion: function(id, expresion){
        return {
            id: id,
            rol:TIPO_INSTRUCCION.ASIGNACION,
            expresion: expresion
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
    nuevaAsignacion_O: function(id, operador, expresion){
        return {
            id:id,
            rol:TIPO_INSTRUCCION.ASIGNACION_O,
            operador: operador,
            expresion: expresion
        }
    },

    /**
     * Genera un nuevo if
     * @param {*} expresion 
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoIf: function(expresion, instrucciones){
        return {
            condicion: expresion,
            instrucciones: instrucciones,
            rol:TIPO_INSTRUCCION.IF
        }
    },
    /**
     * Genera un nuevo else con la expresion logica e instrucciones
     * Sin embargo el if_father es el if del que viene 
     * @param {*} expresion 
     * @param {*} instrucciones 
     * @param {*} if_father 
     */
    nuevoElse: function(expresion, instrucciones, if_father){
        return {
            condicion:expresion,
            instrucciones:instrucciones,
            if:if_father,
            rol: TIPO_INSTRUCCION.ELSE
        }
    },

    /**
     * Genera una nueva instruccion switch con un id que sera la variable a tomar en cuenta, 
     * Genera una nueva serie de instrucciones en base a los casos
     * @param {*} id 
     * @param {*} cases 
     * @returns 
     */
    nuevoSwitch:function(id, cases){
        return {
            id: id,
            cases:cases,
            rol:TIPO_INSTRUCCION.SWITCH
        }
    },

    /**
     * Genera un nuevo caso para switch
     * @param {*} expresion 
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoCase: function(expresion, instrucciones){
        return {
            condicion:expresion,
            instrucciones: instrucciones,
            rol: TIPO_SWITCH.CASE
        }
    },
    /**
     * Genera un caso default
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoDefault: function(instrucciones){
        return{
            instrucciones:instrucciones,
            rol: TIPO_SWITCH.DEFAULT
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
    nuevoFor: function(valor_inicial, expresion, accion_post, instrucciones){
        return{
            valor_inicial:valor_inicial,
            condicion: expresion,
            accion_post: accion_post,
            instrucciones:instrucciones,
            rol: TIPO_INSTRUCCION.FOR
        }
    },

    /**
     * Genera un nuevo while, donde expresion es la condicion, e instrucciones las instrucciones
     * que seguira hasta que la condicion sea correcta
     * @param {*} expresion 
     * @param {*} instrucciones 
     * @returns 
     */
    nuevoWhile: function(expresion, instrucciones){
        return{
            condicion: expresion,
            instrucciones:instrucciones,
            rol: TIPO_INSTRUCCION.WHILE
        }
    },
    /**
     * Genera un nuevo Do , donde instrucciones los pasos que seguira, y la condicion
     * del while por el cual esta restringido
     * @param {*} instrucciones 
     * @param {*} while_ 
     * @returns 
     */
    nuevoDoWhile: function(instrucciones, condicion){
        return{
            instrucciones: instrucciones,
            condicion:condicion, 
            rol:TIPO_INSTRUCCION.DO
        }
    },
    /**
     * 
     * @param {*} parametros 
     * @returns 
     */
    nuevoImprimir: function(parametros){
        return{
            parametros:parametros,
            rol:TIPO_INSTRUCCION.IMPRIMIR
        }
    },


}