var TIPO_INSTRUCCION = require('./Instrucciones').TIPO_INSTRUCCION;

class Cuarteto{

    constructor(){
        this.cuartetos = [];
        this.tSize=0;
        this.hSize=0;
    }

    producirDeclaracion(instruccion){

    }
    producirInclude(instruccion){

    }
    producirFuncion(instruccion){

    }
    producirMain(instruccion){        
    }
    producirConstrucor(instruccion){

    }
    producirClase(instruccion){

    }
    producirAsignacion(instruccion){

    }
    producirIf(instruccion){

    }
    producirElse(instruccion){

    }
    producirSwitch(instruccion){

    }
    producirFor(instruccion){

    }
    producirWhile(instruccion){

    }
    producirDo(instruccion){

    }
    producirClean(instruccion){

    }
    producirGetch(instruccion){

    }
    producirImprimir(instruccion){

    }
    producirContinue(instruccion){

    }
    producirBreak(instruccion){

    }
    producirReturn(instruccion){
        
    }
    producirMetodo(instruccion){

    }
    producirScan(instruccion){
        
    }

    mkCuarteto(instruccion){
        if(instruccion.rol == TIPO_INSTRUCCION.DECLARACION){

        }else if(instruccion.rol == TIPO_INSTRUCCION.INCLUDE){

        }else if(instruccion.rol == TIPO_INSTRUCCION.FUNCION){

        }else if(instruccion.rol == TIPO_INSTRUCCION.MAIN){

        }else if(instruccion.rol == TIPO_INSTRUCCION.CONSTRUCTOR){

        }else if(instruccion.rol == TIPO_INSTRUCCION.CLASE){

        }else if(instruccion.rol == TIPO_INSTRUCCION.ASIGNACION_O){

        }else if(instruccion.rol == TIPO_INSTRUCCION.IF){

        }else if(instruccion.rol == TIPO_INSTRUCCION.ELSE){

        }else if(instruccion.rol == TIPO_INSTRUCCION.SWITCH){

        }else if(instruccion.rol == TIPO_INSTRUCCION.FOR){

        }else if(instruccion.rol == TIPO_INSTRUCCION.WHILE){

        }else if(instruccion.rol == TIPO_INSTRUCCION.DO){

        }else if(instruccion.rol == TIPO_INSTRUCCION.CLEAN){
        }else if(instruccion.rol == TIPO_INSTRUCCION.GETCH){

        }else if(instruccion.rol == TIPO_INSTRUCCION.IMPRIMIR){

        }else if(instruccion.rol == TIPO_INSTRUCCION.CONTINUE){

        }else if(instruccion.rol == TIPO_INSTRUCCION.BREAK){

        }else if(instruccion.rol == TIPO_INSTRUCCION.RETURN){

        }else if(instrucicon.rol == TIPO_INSTRUCCION.METODO){

        }else if(instrucicon.rol == TIPO_INSTRUCCION.SCAN){

        }

    }


}

module.exports = Cuarteto;