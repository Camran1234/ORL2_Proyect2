var TIPO_INSTRUCCION = require('../api/Instrucciones').TIPO_INSTRUCCION;
var TIPO_VISIBILIDAD = require('../api/Instrucciones').TIPO_VISIBILIDAD;
var TIPO_DATO = require('../api/Instrucciones').TIPO_DATO;
var TIPO_SWITCH = require('../api/Instrucciones').TIPO_SWITCH;
var TIPO_OPERACION = require('../api/Instrucciones').TIPO_OPERACION;
var ProcesadorOperacion = require('../api/ProcesadorOperacion');
var ProcesadorTipos = require('../api/ProcesadorTipos');
var ErrorSemantico = require('../error/SemanticError');
var Cuarteto = new require('../api/Cuarteto');
var cuarteto = new Cuarteto();

class Procesador{

    constructor(tablaTipos){
        this.tablaTipos = tablaTipos;
        this.paqueteria = "";
        this.clase = "";
        this.errores = [];
    }

    constructor(){
        var TablaTipos = require('../api/TablaTipos');
        this.tablaTipos = new TablaTipos.TablaTipos();
        this.paqueteria = "";
        this.clase="";
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

    findMaxAmbit(ambito){
        let aux = ambito;
        if(aux !=null){
            if(){
                
            }
        }
        return aux;
    }

    checkEstado(instrucciones, ambito){
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
                if(instruccion.condicion == null){
                    if_stmt = false;
                    if_ = null;
                }
            }else{
                if_stmt = false;
                if_ = null;
            }
        });
    }

    foundVariable(instruccion){
        if(instruccion.rol == TIPO_INSTRUCCION.VARIABLE){
            if(instruccion.id != undefined){
                return instruccion.id.valor;
            }
        }
        return TIPO_INSTRUCCION.VARIABLE;
    }

    checkReturns(ast, estado, ambito){
        if(estado == 2){
            for(let index=0; index<ast.length; index++){
                let instruccion = ast[index];
                let returnFounded=false;
                if(instruccion.rol == TIPO_INSTRUCCION.ELSE
                    && instruccion.condicion == null){
                    if(returnFounded==true){
                        this.addSemanticError("else","No pueden existir declaraciones debajo de un return", instruccion.linea, instruccion.columna)
                    }else{
                        instrucciones = ast[index].instrucciones;
                        returnFounded = this.checkReturns(instrucciones, estado);
                    }
                }else if(instruccion.rol == TIPO_INSTRUCCION.RETURN){
                    if(returnFounded=true){
                        this.addSemanticError("return ","No puede existir declaraciones debajo de un return", instruccion.linea, instruccion.columna)
                    }else{  
                        returnFounded=true;
                    }
                }else{
                    if(returnFounded==true){
                        this.addSemanticError(foundVariable(ast[instruccion]), "No puede existir declaraciones debajo de un return", instruccion.linea, instruccion.columna);
                    }
                }
            }
            return returnFounded;
        }
        return false;
    }   

    procesarEstado(estado, instruccion){
        if(estado != 3){
            if(instruccion.rol == TIPO_INSTRUCCION.BREAK){
                this.addSemanticError("break", "Se esperaba que estuviera dentro de un ciclo", instruccion.linea, instruccion.columna);
            }else if(instruccion.rol == TIPO_INSTRUCCION.CONTINUE){
                this.addSemanticError("continue", "Se esperaba que estuviera dentro de un ciclo", instruccion.linea, instruccion.columna);
            }
        }else if(estado == 6){
            if(instruccion.rol == TIPO_INSTRUCCION.BREAK){
                this.addSemanticError("break", "Se esperaba que estuviera dentro de un ciclo", instruccion.linea, instruccion.columna);
            }else if(instruccion.rol == TIPO_INSTRUCCION.CONTINUE){
                this.addSemanticError("continue", "Se esperaba que estuviera dentro de un ciclo", instruccion.linea, instruccion.columna);
            }else if(instruccion.rol == TIPO_INSTRUCCION.RETURN){
                this.addSemanticError(instruccion.id, "No se puede agregar un return a algo que no sea una funcion", instruccion.linea, instruccion.columna);
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
     *      *estado '6': AST dentro de un constructor o main
     * @param {*} ast 
     * @param {*} paqueteria 
     * @param {*} estado 
     * @param {*} ambito
     */
    procesar(ast, paqueteria, estado, ambito){
        this.paqueteria = paqueteria;
        this.checkEstado(ast, ambito);        
        this.checkReturns(ast, estado, ambito);
        ast.array.forEach(instruccion => {
            if(this.procesarEstado(estado, instruccion)){
                if(instruccion.rol == TIPO_INSTRUCCION.DECLARACION){
                    this.procesarDeclaracion(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.INCLUDE){
                    this.procesarInclude(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.FUNCION){
                    this.procesarFuncion(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.MAIN){
                    this.procesarMain(instruccion, ambito, estado);
                }else if (instruccion.rol == TIPO_INSTRUCCION.CONSTRUCTOR){
                    this.procesarConstructor(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CLASE){
                    this.procesarClase(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ASIGNACION_O){
                    this.procesarAsignacion(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.VARIABLE){
                    this.procesarVariable(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.IF){
                    this.procesarIf(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ELSE){
                    this.procesarElse(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.SWITCH){
                    this.procesarSwitch(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.FOR){
                    this.procesarFor(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.WHILE){
                    this.procesarWhile(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.DO){
                    this.procesarDo(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CLEAN){
                    this.procesarClean(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.GETCH){
                    this.procesarGetch(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.IMPRIMIR){
                    this.procesarImprimir(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CONTINUE){
                    this.procesarContinue(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.BREAK){
                    this.procesarBreak(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.RETURN){
                    this.procesarReturn(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.METODO){
                    this.procesarMetodo(instruccion, ambito, estado);
                }else if(instruccion.rol == TIPO_INSTRUCCION.SCAN){
                    this.procesarScan(instruccion)
                }
            }
            
        });
    }

    checkError(respuesta, instruccion){
        if(respuesta !=null){
            if(respuesta instanceof ErrorSemantico){
                this.errores.push(respuesta);
                return false;
            }
        }
        return true;
    }

    procesarDeclaracion(instruccion, ambito, estado){
        let tablaTipos = this.tablaTipos;
        let visibilidad = instruccion.visibilidad;
        let id = instruccion.id;
        let tipo = instruccion.tipo;
        let longitud = instruccion.magnitud;
        let esArreglo = false;
        if(instruccion.magnitud==null){
            esArreglo = false;
        }else if(instruccion.magnitud>1){
            esArreglo = 1;
        }
        let rol = instruccion.rol;
        let paquete = this.paqueteria;
        let linea = instruccion.linea;
        let columna = instruccion.columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        this.checkError(resultado, instruccion);
    }

    procesarInclude(instruccion, ambito, estado){
        //PENDIENTE
    }

    procesarParametro(parametro, ambito, estado){
        let visibilidad = TIPO_VISIBILIDAD.LOCAL;
        let id = parametro.id;
        let tipo = parametro.tipo;
        let longitud = 1;
        let esArreglo = false;
        let rol = TIPO_INSTRUCCION.DECLARACION;
        let paquete = this.paquete;
        let linea = parametro.linea;
        let columna = parametro.columna;
        let resultado = this.tablaTipos.agregarTipo(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, linea, columna);
        return this.checkError(resultado, null)
    }

    procesarParametros(parametros, ambito, estado){
        parametros.array.forEach(parametro => {
            let resultado = this.procesarParametro(parametro, ambito, estado);
            if(resultado == false){
                return resultado;
            }
        });
    }

    procesarFuncion(instruccion, ambito, estado){
        let tablaTipos = this.tablaTipos;
        let visibilidad = instruccion.visibilidad;
        let id = instruccion.id;
        let tipo = instruccion.tipo;
        let longitud = instruccion.parametros;
        let esArreglo = false;
        let rol = instruccion.rol;
        let paquete = this.paqueteria;
        let linea = instruccion.linea;
        let columna = instruccion.columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        let parametros = instruccion.parametros;
        this.procesarParametros(parametros, ambito, estado);
        let arregloAST = instruccion.instrucciones;
        this.checkError(resultado, instruccion);
        this.procesar(arregloAST,this.paqueteria, 2, resultado);
    }

    procesarMain(instruccion, ambito, estado){
        let tablaTipos = this.tablaTipos;
        let visibilidad = TIPO_VISIBILIDAD.PUBLIC;
        let id = "";
        let tipo = TIPO_DATO.VOID;
        let longitud = 1;
        let esArreglo = false;
        let rol = instruccion.rol;
        let paquete= this.paqueteria;
        let linea = instruccion.linea;
        let columna = instruccion.columna;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        let parametros = instruccion.parametros;
        this.procesarParametros(parametros, ambito, estado);
        let arregloAST = instruccion.instrucciones;
        this.checkError(resultado, instruccion);
        this.procesar(arregloAST, this.paqueteria, 6, resultado);
        
    }

    procesarConstructor(instruccion, ambito, estado){
        let tablaTipos = this.tablaTipos;
        let visibilidad = instruccion.visibilidad;
        let id = instruccion.id;
        if(id == this.clase){
            let tipo = "";
            let longitud = instruccion.parametros;
            let esArreglo = false;
            let rol = instruccion.rol;
            let paquete = this.paquete;
            let linea = instruccion.linea;
            let columna = instruccion.columna;
            let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
                paquete, linea, columna);
            let parametros = instruccion.parametros;
            this.procesarParametros(parametros, ambito, estado);
            let arregloAST = instruccion.instrucciones;
            this.checkError(resultado, instruccion);
            this.procesar(arregloAST, this.paqueteria, 6, resultado);
        }else{
            this.addSemanticError("El constructor debe tener el mismo nombre de la clase", id, instruccion.linea, instruccion.columna);
        }
    }

    procesarClase(instruccion, ambito, estado){
        let tablaTipos = this.tablaTipos;
        let visibilidad = TIPO_VISIBILIDAD.PUBLIC;
        let id = instruccion.id;
        //Usaremos el tipo para guardar la clase extendida
        let tipo = instruccion.idExtension;
        let longitud = 1;
        let esArreglo = false;
        let rol = instruccion.rol;
        let paquete = this.paquete;
        let linea = instruccion.linea;
        let columna = instruccion.columna;
        this.clase = id;
        let resultado = tablaTipos.agregarTipo(visibilidad,id,tipo,ambito, longitud, esArreglo, rol,
            paquete, linea, columna);
        let parametros = instruccion.parametros;
        this.procesarParametros(parametros, ambito, estado);
        let arregloAST = instruccion.instrucciones;
        this.checkError(resultado, instruccion);
        this.procesar(arregloAST, this.paqueteria, 1, resultado);
        
    }

    procesarAsignacion(instruccion, ambito, estado){
        let procesador = new ProcesadorOperacion();
        let expresion = instruccion.expresion;
        procesador.procesarOperacion(expresion,ambito,this.tablaTipos, this.errores);        
    }

    procesarVariable(instruccion, ambito, estado){
        let arreglo = instruccion.arreglo;
        let paqueteria = this.paqueteria;
        this.procesar(arreglo, paqueteria, 2, ambito);
    }

    procesarIf(instruccion, ambito, estado){
        let astOperaciones = instruccion.condicion;
        let procesador = new ProcesadorOperacion();
        let resultado = procesador.procesarOperacion(astOperaciones, ambito, this.tablaTipos, this.errores)
        let astIf = instruccion.instrucciones;
        this.procesar(astIf, this.paqueteria, estado, ambito);        
    }

    procesarElse(instruccion, ambito, estado){
        let astOperaciones = instruccion.condicion;
        let procesador = new ProcesadorOperacion();
        let astElse = instruccion.instrucciones;
        let resultado = procesador.procesarOperacion(astOperaciones, ambito, this.tablaTipos, this.errores);
        this.procesar(astElse, this.paqueteria, estado, ambito);        
    }

    procesarSwitch(instruccion, ambito, estado){
        let casos = instruccion.cases;
        let id = instruccion.id;
        let simbolo = this.tablaTipos.buscar(id, ambito, this.paquete, TIPO_INSTRUCCION.DECLARACION);
        if(simbolo == null){
            this.addSemanticError( "switch("+id+")","No se encontro ningun identificador "+id, instruccion.linea, instruccion.columna);
        }else{
            if(simbolo.tipo == TIPO_DATO.BOOLEAN){
                this.addSemanticError("switch("+id+")","No se puede usar un identificador booleano en switch", instruccion.linea, instruccion.columna)
            }else{
                //Comprobamos los casos de switch
                //Comprobamos el caso
                for(let index=0; index<casos.length; index++){
                    let expresion = casos[index].condicion;
                    let procesador = new ProcesadorTipos();
                    let resultado = procesador.procesarOperacion(expresion, ambito, this.tablaTipos, this.errores);
                    let resultadoAsignacion = procesador.procesarAsignacion(id, resultado, this.tablaTipos, this.errores);
                    if(resultadoAsignacion){
                        //Ejecutamos las instrucciones
                        let instrucciones = casos[index].instrucciones;
                        if(casos[index].rol == TIPO_SWITCH.CASE){
                            this.procesar(instrucciones, this.paqueteria, 4, ambito);
                        }else if(casos[index].rol == TIPO_SWITCH.DEFAULT){
                            this.procesar(instrucciones, this.paqueteria, 5, ambito);
                        }
                    }
                }
            }
        }
        
    }

    procesarFor(instruccion, ambito, estado){
        let valor_inicial = instruccion.valor_inicial;
        let condicion = instruccion.condicion;
        let accion_post = [instruccion.accion_post];
        //Procesamos los valores iniciales
        this.procesarVariable(valor_inicial, ambito, estado);
        let procesador = new ProcesadorOperacion();
        //Procesamos la condicion
        let resultado = procesador.procesarOperacion(condicion, ambito, this.tablaTipos, this.errores);
        procesador.procesarAsignacion(TIPO_INSTRUCCION.FOR, resultado, this.tablaTipos, this.errores);
        //Procesamos la accion posterior
        this.procesar(accion_post, this.paqueteria, estado, ambito);
        let instrucciones = instruccion.instrucciones;
        this.procesar(instrucciones, this.paqueteria, 3, ambito) ;       
    }

    procesarWhile(instruccion, ambito, estado){
        let condicion = instruccion.condicion;
        let procesador = new ProcesadorOperacion();
        let resultado = procesador.procesarOperacion(condicion, ambito, this.tablaTipos, this.errores);
        procesador.procesarAsignacion(TIPO_INSTRUCCION.WHILE, resultado, this.tablaTipos, this.errores);
        let instrucciones = instruccion.instrucciones;
        this.procesar(instrucciones, this.paqueteria, 3, ambito)
    }

    procesarDo(instruccion, ambito, estado){
        let condicion = instruccion.condicion;
        let procesador = new ProcesadorOperacion();
        let resultado = procesador.procesarOperacion(condicion, ambito, this.tablaTipos, this.errores);
        procesador.procesarAsignacion(TIPO_INSTRUCCION.DO, resultado, this.tablaTipos, this.errores);
        let instrucciones = instruccion.instrucciones;
        this.procesar(instrucciones, this.paqueteria, 3, ambito)
    }

    procesarClean(instruccion, ambito, estado){
        /*Do nothing*/ 
    }

    procesarGetch(instruccion, ambito, estado){
        /*Do nothing*/ 
    }

    procesarImprimir(instruccion, ambito, estado){
        let parametros = instruccion.parametros;
        let procesador = new ProcesadorOperacion();
        procesador.procesarImprimir(parametros, this.tablaTipos, this.errores, instruccion.lenguaje);
    }

    procesarContinue(instruccion, ambito, estado){
        if(estado != 3){
            this.addSemanticError("continue","Se esperaba que estuviera dentro de un ciclo", instruccion.linea, instruccion.columna);
        }
    }

    procesarBreak(instruccion, ambito, estado){
        if(estado != 3){
            this.addSemanticError("continue","Se esperaba que estuviera dentro de un ciclo", instruccion.linea, instruccion.columna);
        }
    }

    procesarReturn(instruccion, ambito, estado){
        let procesador = new ProcesadorOperacion();
        let condicion = instruccion.expresion;
        let resultado = procesador.procesarOperacion(condicion, ambito, this.tablaTipos, this.errores);
        procesador.procesarReturn(ambito, resultado, this.tablaTipos, this.errores);
    }

    procesarMetodo(instruccion, ambito, estado){
        let procesadorTipos = new ProcesadorTipos();
        let id = instruccion.id;
        let parametros = instruccion.parametros;
        procesadorTipos.procesarMetodo(id, parametros, ambito, this.tablaTipos);
    }

    //existen dos tipos los inputs y los scans
    procesarScan(instruccion, ambito, estado){
        let procesador = new ProcesadorTipos();
        let cadena = instruccion.cadena.toString();
        let id = instruccion.id;
        let resultado = this.tablaTipos.buscar(id, ambito, this.paquete, TIPO_INSTRUCCION.DECLARACION);
        let metodo = null;
        let auxiliar = cadena.split('');
        let flag = false;
        let founded=false;
        let yyFunction = function(param, paramInstruccion, errores, SemanticErrorV, val){
            if(param == true){
                let error = new SemanticErrorV("Ya existe mas de un tipo de asignacion en el scanner en la cadena",val. paramInstruccion.linea, paramInstruccion.columna);                
                errores.push(error);
                return false;
            }
            return true;
        };
        //Examinamos la cadena
        for(let index=0; index<auxiliar.length; index++){
            if(auxiliar[index] == '%'){
                flag = true;
            }else if(flag){
                if(auxiliar[index] == 'd'){
                    if(yyFunction(founded, instruccion, this.errores, ErrorSemantico,"%d")){
                        metodo = TIPO_DATO.INT;
                    }
                }else if(auxiliar[index] == 'c'){
                    if(yyFunction(founded, instruccion, this.errores, ErrorSemantico, "%c")){
                        metodo = TIPO_DATO.CHAR;
                    }                    
                }else if(auxilair[index] == 'f'){
                    if(yyFunction(founded, instruccion, this.errores, ErrorSemantico, "%f")){
                        metodo = TIPO_DATO.FLOAT;
                    }
                }else{
                    flag = false;
                }
            }
        }
        if(metodo!=null){
            procesador.compararTipos(resultado.tipo, metodo, this.errores);
        }
        
    }
}

module.exports = Procesador;