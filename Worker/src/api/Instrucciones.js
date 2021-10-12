const TIPO_VISIBILIDAD = {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}

const LIBRERIAS = {
    LIB_PY = 'LIB_PY',
    LIB_JAVA = 'LIB_JAVA',
    PY = 'PY',
    JAVA = 'JAVA'
}

const TIPO_LENGUAJE = {
    JAVA = 'JAVA',
    PYTHON = 'PYTHON',
    C = 'C'
}
/**
 * Para identificadores y funciones
 */
const TIPO_DATO = {
    INT = 'INT',
    FLOAT = 'FLOAT',
    CHAR = 'CHAR',
    STRING = 'STRING',
    BOOLEAN = 'BOOLEAN',
    VOID = 'VOID',
    ANY= 'ANY'  
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
    IDENTIFICADOR: 'IDENTIFICADOR',
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
    DECLARACION = 'DECLARACION',
    FUNCION = 'FUNCION',
    CLASE = 'CLASE',
    ASIGNACION = 'ASIGNACION',
    ASIGNACION_O = 'ASIGNACION_0',
    IF = 'IF',
    ELSE = 'ELSE',
    SWITCH = 'SWITCH',
    FOR = 'FOR',
    WHILE = 'WHILE',
    DO = 'DO',
    //PENDIENTE METODO
    IMPRIMIR = 'IMPRIMIR',
    CONTINUE = 'CONTINUE',
    BREAK = 'BREAK',
    RETURN = 'RETURN',
    METODO = 'METODO'
}

const TIPO_SWITCH = {
    CASE = 'CASE',
    DEFAULT = 'DEFAULT'
}

