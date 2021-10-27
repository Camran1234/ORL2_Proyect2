const TIPO_DATO = require('./Instrucciones').TIPO_DATO;
const TIPO_VALOR = require('./Instrucciones').TIPO_VALOR;

function compararTipos(tipoL, tipoR, errores){

}

function convertirVariable(tipoIdentificador){
    let resultado = tipoIdentificador;
    if(tipoIdentificador == TIPO_DATO.INT){
        resultado = TIPO_VALOR.ENTERO;
    }else if(tipoIdentificador == TIPO_DATO.FLOAT){
        resultado = TIPO_VALOR.DECIMAL;
    }else if(tipoIdentificador == TIPO_DATO.CHAR){
        resultado = TIPO_VALOR.CARACTER;
    }else if(tipoIdentificador == TIPO_DATO.STRING){
        resultado = TIPO_VALOR.CADENA;
    }else if(tipoIdentificador == TIPO_DATO.BOOLEAN){
        resultado = TIPO_VALOR.BOOLEAN;
    }else if(tipoIdentificador == TIPO_DATO.VOID){
        resultado = null;
    }else if(tipoIdentificador == TIPO_DATO.ANY){
        resultado = TIPO_VALOR.ANY;
    }
    return resultado;
}

function procesarAsignacion(id, expresion, tablaTipos,errores){

}

module.exports = {
    compararTipos,
    procesarAsignacion,
    convertirVariable
};