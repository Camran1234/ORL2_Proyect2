const TIPO_VISIBILIDAD = {
    PUBLIC : 'PUBLIC',
    PRIVATE : 'PRIVATE',
    LOCAL : 'LOCAL',
    CONST : 'CONST'
}

const TIPO = {
    DIRECTORIO : 'DIRECTORIO',
    ARCHIVO : 'ARCHIVO'
}

const LIBRERIAS = {
    LIB_PY : 'LIB_PY',
    LIB_JAVA : 'LIB_JAVA',
    PY : 'PY',
    JAVA : 'JAVA'
}

const TIPO_LENGUAJE = {
    JAVA : 'JAVA',
    PYTHON : 'PYTHON',
    C : 'C'
}
/**
 * Para identificadores y funciones
 */
const TIPO_DATO = {
    INT : 'ENTERO',
    FLOAT : 'DECIMAL',
    CHAR : 'CARACTER',
    STRING : 'CADENA',
    BOOLEAN : 'BOOLEAN',
    VOID : 'VOID',
    ANY: 'ANY'  
}
/**
 * Para literales
 */
const TIPO_VALOR = {
    ENTERO: 'ENTERO',
    DECIMAL: 'DECIMAL',
    CADENA: 'CADENA',
    CARACTER: 'CARACTER',
    BOOLEAN: 'BOOLEAN',
    VOID: 'VOID',
    ANY: 'ANY',
    IDENTIFICADOR: 'IDENTIFICADOR',
    PUNTERO_IDENTIFICADOR: 'PUNTERO_IDENTIFICADOR',
    THIS_IDENTIFICADOR: 'THIS_IDENTIFICADOR',
    METODO: 'METODO',
    INPUT_INT: 'INPUT_INT',
    INPUT_FLOAT: 'INPUT_FLOAT',
    INPUT_CHAR: 'INPUT_CHAR',
    INPUT: 'INPUT'
}

const TIPO_PRINT = {
    PRINT: 'PRINT',
    PRINTLN: 'PRINTLN'
}

const TIPO_OPERACION = {
    //Operaciones aritmeticas
    IGUAL:'IGUAL',
    SUMA: 'SUMA',
    RESTA: 'RESTA',
    MULTIPLICACION: 'MULTIPLICACION',
    DIVISION: 'DIVISION',
    MOD: 'MOD',
    POW: 'POW',
    NEGATIVO: 'NEGATIVO',
    //Operaciones comparaciones
    MENOR: 'MENOR',
    MENOR_IGUAL: 'MENOR_IGUAL',
    MAYOR: 'MAYOR',
    MAYOR_IGUAL: 'MAYOR_IGUAL',
    DIFERENTE: 'DIFERENTE',
    COMPARACION: 'COMPARACION',
    //Operaciones de condiciones
    AND: 'AND',
    OR: 'OR',
    NOT: 'NOT',
    //Operaciones de acciones
    INCREMENTO: 'INCREMENTO',
    DECREMENTO: 'DECREMENTO',
}

const TIPO_INSTRUCCION = {
    DECLARACION : 'DECLARACION',
    INCLUDE : 'INCLUDE',
    FUNCION : 'FUNCION',
    MAIN : 'MAIN',
    CONSTRUCTOR : 'CONSTRUCTOR',
    CLASE : 'CLASE',
    ASIGNACION_CLASE: 'ASIGNACION_CLASE',
    ASIGNACION : 'ASIGNACION',
    ASIGNACION_O : 'ASIGNACION_0',
    VARIABLE : 'VARIABLE',
    IF : 'IF',
    ELSE : 'ELSE',
    SWITCH : 'SWITCH',
    FOR : 'FOR',
    WHILE : 'WHILE',
    DO : 'DO',
    CLEAN : 'CLEAN',
    GETCH : 'GETCH',
    //PENDIENTE METODO
    IMPRIMIR : 'IMPRIMIR',
    CONTINUE : 'CONTINUE',
    BREAK : 'BREAK',
    RETURN : 'RETURN',
    METODO : 'METODO',
    SCAN : 'SCAN'
}

const TIPO_SWITCH = {
    CASE : 'CASE',
    DEFAULT : 'DEFAULT'
}

const TIPO_EXPRESION = {
    OPERACION: 'OPERACION',
    VALOR: 'VALOR'
}

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_VISIBILIDAD =  TIPO_VISIBILIDAD;
module.exports.LIBRERIAS = LIBRERIAS;
module.exports.TIPO_LENGUAJE = TIPO_LENGUAJE;
module.exports.TIPO_DATO = TIPO_DATO;
module.exports.TIPO_VALOR =TIPO_VALOR ;
module.exports.TIPO_PRINT = TIPO_PRINT;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_SWITCH = TIPO_SWITCH;
module.exports.TIPO_EXPRESION = TIPO_EXPRESION;
module.exports.TIPO = TIPO;
