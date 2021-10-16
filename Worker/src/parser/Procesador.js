var TIPO_INSTRUCCION = require('../api/Instrucciones').TIPO_INSTRUCCION;
var TIPO_DATO = require('../api/Instrucciones').TIPO_DATO;
var TIPO_OPERACION = require('../api/Instrucciones').TIPO_OPERACION;
var ErrorSemantico = require('../error/SemanticError');
var Cuarteto = new require('../api/Cuarteto');
var cuarteto = new Cuarteto();

class Procesador{

    constructor(){
        var TablaTipos = require('../api/TablaTipos');
        this.tablaTipos = new TablaTipos.TablaTipos();
        this.paqueteria = "";
        //Contiene errores semanticos y sintacticos
        this.errores = [];
    }

    addSemanticError(token,descripcion, linea, columna){        
        let errorSemantico = new ErrorSemantico(descripcion, token, linea, columna);
        this.errores.push(errorSemantico);
    }

    addSyntaxError(descripcion, token, line, column){
		try{
			var errorSintactico = new ErrorSintactico(descripcion, token, line, column);
			this.errores.push(errorSintactico);
		}catch(ex){
			console.log(ex);
		}
	}

    checkEstado(instrucciones){
        let if_stmt = false;
        let if_=null;
        instrucciones.array.forEach(instruccion => {
            if(instruccion.rol == TIPO_INSTRUCCION.IF){
                if_stmt = true;
                if_ = null;
            }else if(instruccion.rol == TIPO_INSTRUCCION.ELSE){
                if(if_stmt){
                    instruccion.if = if_;       
                }if(!if_stmt){
                    this.addSyntaxError("Se esperaba un if antes", "else", instruccion.linea, instruccion.columna);
                }
            }else{
                if_stmt = false;
                if_ = null;
            }
        });
    }

    procesarEstado(estado, instruccion){
        if(estado == 2){
            if(instruccion.rol == TIPO_INSTRUCCION.BREAK){
                this.addSemanticError("break", "Se esperaba que estuviera dentro de un ciclo", instruccion.linea, instruccion.columna);
            }else if(instruccion.rol == TIPO_INSTRUCCION.CONTINUE){
                this.addSemanticError("continue", "Se esperaba que estuviera dentro de un ciclo", instruccion.linea, instruccion.columna);
            }
        }
        return true;
    }

    /**
     * Metodo para procesar el codigo semanticamente y encontrar posibles errores semanticos
     * Los factores a enviar son:
     *  -ast: Las instrucciones a seguir
     *  -paqueteria: La direccion del ast en el codigo
     *  -estado: Estado para indicar si estamos en un ciclo, funcion, y que instrucciones no aceptamos
     *      *Los valores a tomar en cuenta en estado son:
     *      *estado '0': AST GENERAL
     *      *estado '1': AST dentro de una clase
     *      *estado '2': AST dentro de una funcion
     *      *estado '3': AST dentro de un for, while, do, entre otros
     *      *estado '4': AST dentro de un case
     *      *estado '5': AST dentro de un default
     * @param {*} ast 
     * @param {*} paqueteria 
     * @param {*} estado 
     */
    procesar(ast, paqueteria, estado, ambito){
        this.paqueteria = paqueteria;
        this.checkEstado(ast);        
        ast.array.forEach(instruccion => {
            if(this.procesarEstado(estado, instruccion)){
                if(instruccion.rol == TIPO_INSTRUCCION.DECLARACION){
                    this.procesarDeclaracion(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.INCLUDE){
                    this.procesarInclude(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.FUNCION){
                    this.procesarFuncion(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.MAIN){
                    this.procesarMain(instruccion, ambito);
                }else if (instruccion.rol == TIPO_INSTRUCCION.CONSTRUCTOR){
                    this.procesarConstructor(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CLASE){
                    this.procesarClase(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ASIGNACION_O){
                    this.procesarAsignacion(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.VARIABLE){
                    this.procesarVariable(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.IF){
                    this.procesarIf(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ELSE){
                    this.procesarElse(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.SWITCH){
                    this.procesarSwitch(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.FOR){
                    this.procesarFor(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.WHILE){
                    this.procesarWhile(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.DO){
                    this.procesarDo(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CLEAN){
                    this.procesarClean(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.GETCH){
                    this.procesarGetch(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.IMPRIMIR){
                    this.procesarImprimir(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CONTINUE){
                    this.procesarContinue(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.BREAK){
                    this.procesarBreak(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.RETURN){
                    this.procesarReturn(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.METODO){
                    this.procesarMetodo(instruccion, ambito);
                }else if(instruccion.rol == TIPO_INSTRUCCION.SCAN){
                    this.procesarScan(instruccion)
                }
            }
            
        });
    }

    checkError(respuesta, instruccion){
        if(respuesta instanceof ErrorSemantico){
            this.errores.push(respuesta);
        }else{
            cuarteto.mkCuarteto(instruccion);
        }
    }

    procesarDeclaracion(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
        
        
    }

    procesarInclude(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarFuncion(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarMain(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarConstructor(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarClase(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarAsignacion(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarVariable(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarIf(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarElse(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarSwitch(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarFor(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarWhile(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarDo(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarClean(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarGetch(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarImprimir(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarContinue(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarBreak(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarReturn(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarMetodo(instruccion, ambito){
        let tablaTipos = this.tablaTipos;
        let visibilidad;
        let id ;
        let tipo;
        let longitud;
        let esArreglo;
        let rol;
        let paquete;
        let linea;
        let columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarScan(instruccion, ambito){

    }
}

module.exports = Procesador;