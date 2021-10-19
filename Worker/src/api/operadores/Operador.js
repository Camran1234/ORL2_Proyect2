const TIPO_OPERACION = require("../Instrucciones").TIPO_OPERACION;
const TIPO_VALOR = require("../Instrucciones").TIPO_VALOR;
const TIPO_LENGUAJE = require("../Instrucciones").TIPO_LENGUAJE;

function highTipo(tipoL, tipoR){
    if(tipoL == TIPO_VALOR.CADENA || TIPO_VALOR.CADENA){
        return TIPO_VALOR.CADENA;
    }else if(tipoL == TIPO_VALOR.DECIMAL || tipoR == TIPO_VALOR.DECIMAL){
        return TIPO_VALOR.DECIMAL;
    }else if(tipoL == TIPO_VALOR.ENTERO || tipoR == TIPO_VALOR.ENTERO){
        return TIPO_VALOR.ENTERO;
    }else if(tipoL == TIPO_VALOR.CARACTER || tipoR == TIPO_VALOR.CARACTER){
        return TIPO_VALOR.CARACTER;
    }else if(tipoL == TIPO_VALOR.BOOLEAN || tipoR == TIPO_VALOR.BOOLEAN){
        return TIPO_VALOR.BOOLEAN;
    }
}



function operar(operador, tipoL, tipoR, lenguaje){
    let resultado = false;
    if(operador == TIPO_OPERACION.SUMA || operador == TIPO_OPERACION.RESTA
        || operador == TIPO_OPERACION.MULTIPLICACION || operador == TIPO_OPERACION.DIVISION
        || operador == TIPO_OPERACION.MOD || operador == TIPO_OPERACION.POW
        || operador == TIPO_OPERACION.INCREMENTO || operador == TIPO_OPERACION.DECREMENTO){
            resultado = operacionAritmetica(tipoL, tipoR, lenguaje, operador);
    }else if(operador == TIPO_OPERACION.MENOR || operador == TIPO_OPERACION.MAYOR
        || operador == TIPO_OPERACION.MENOR_IGUAL || operador == TIPO_OPERACION.MAYOR_IGUAL
        || operador == TIPO_OPERACION.DIFERENTE || operador == TIPO_OPERACION.COMPARACION){
            resultado = operacionComparaciones(tipoL, tipoR, lenguaje);
    }else if(operador == TIPO_OPERACION.AND || operador == TIPO_OPERACION.OR
        || operador == TIPO_OPERACION.NOT){
            resultado = operacionCondicion(tipoL, tipoR, lenguaje);
    }
    return resultado;
}

function operacionAritmetica(tipoL, tipoR, lenguaje, operador){
    if(tipoL == TIPO_VALOR.CADENA || tipoR == TIPO_VALOR.CADENA){
        if(operador == TIPO_OPERACION.SUMA){
            if(lenguaje == TIPO_LENGUAJE.JAVA){
                if(tipoL == TIPO_VALOR.BOOLEAN || tipoR == TIPO_VALOR.BOOLEAN){
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    if(lenguaje == TIPO_LENGUAJE.JAVA){
        if(tipoL == TIPO_VALOR.BOOLEAN || tipoR == TIPO_VALOR.BOOLEAN){
            return false;
        }
    }
    return true;
}

function operacionComparaciones(tipoL, tipoR, lenguaje){
    if(lenguaje == TIPO_LENGUAJE.JAVA){
        if(tipoL == TIPO_VALOR.BOOLEAN || tipoR == TIPO_VALOR.BOOLEAN){
            return false;
        }
    }

    if(tipoL == TIPO_VALOR.CADENA && tipoR != TIPO_VALOR.CADENA
        || tipoL != TIPO_VALOR.CADENA && tipoR ==TIPO_VALOR.CADENA){
            return false;
    }
    return true;
}

function operacionCondicion(tipoL, tipoR, lenguaje){
    if(lenguaje == TIPO_LENGUAJE.JAVA){
        if(tipoL != TIPO_VALOR.BOOLEAN || tipoR != TIPO_VALOR.BOOLEAN){
            return false;
        }
    }else{
        if(tipoL == TIPO_VALOR.CADENA || tipoR == TIPO_VALOR.CADENA){
            return false;
        }
    }
    return true;
}



//Invcar esta funcion antes de cada operacion
function tryParse(tipo, tipoEsperado, lenguaje){
    if(tipoEsperado == TIPO_VALOR.DECIMAL){
        if(tipo == TIPO_VALOR.DECIMAL){
            return true;
        }else if(tipo == TIPO_VALOR.ENTERO){
            return true;
        }else if(tipo == TIPO_VALOR.CARACTER){
            return true;
        }else if(tipo == TIPO_VALOR.CADENA){
            return false;
        }else if(tipo == TIPO_VALOR.BOOLEAN){
            if(lenguaje == TIPO_LENGUAJE.C){
                return true;
            }
            return false;
        }
    }else if(tipoEsperado == TIPO_VALOR.ENTERO){
        if(tipo == TIPO_VALOR.DECIMAL){
            return false;
        }else if(tipo == TIPO_VALOR.ENTERO){
            return true;    
        }else if(tipo == TIPO_VALOR.CARACTER){
            return true;    
        }else if(tipo == TIPO_VALOR.CADENA){
            return false;
        }else if(tipo == TIPO_VALOR.BOOLEAN){
            if(lenguaje == TIPO_LENGUAJE.C){
                return true;
            }
            return false;
        }
    }else if(tipoEsperado == TIPO_VALOR.CARACTER){
        if(tipo == TIPO_VALOR.DECIMAL){
            return false;
        }else if(tipo == TIPO_VALOR.ENTERO){
            return false;
        }else if(tipo == TIPO_VALOR.CARACTER){
            return true;
        }else if(tipo == TIPO_VALOR.CADENA){
            return false;
        }else if(tipo == TIPO_VALOR.BOOLEAN){
            if(lenguaje == TIPO_LENGUAJE.C){
                return true;
            }
            return false;
        }
    }else if(tipoEsperado == TIPO_VALOR.CADENA){
        if(tipo == TIPO_VALOR.DECIMAL){
            return true;
        }else if(tipo == TIPO_VALOR.ENTERO){
            return true;
        }else if(tipo == TIPO_VALOR.CARACTER){
            return true;
        }else if(tipo == TIPO_VALOR.CADENA){
            return true;
        }else if(tipo == TIPO_VALOR.BOOLEAN){
            if(lenguaje == TIPO_LENGUAJE.C){
                return true;
            }
            return false;
        }
    }else if(tipoEsperado == TIPO_VALOR.BOOLEAN){
        if(tipo == TIPO_VALOR.DECIMAL){
            return false;
        }else if(tipo == TIPO_VALOR.ENTERO){
            return false;
        }else if(tipo == TIPO_VALOR.CARACTER){
            return false;
        }else if(tipo == TIPO_VALOR.CADENA){
            return false;
        }else if(tipo == TIPO_VALOR.BOOLEAN){
            return false;
        }
    }
}

module.exports = {
    tryParse,
    operar,
    highTipo, 
}