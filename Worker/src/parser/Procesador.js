var TIPO_INSTRUCCION = require('../api/Instrucciones').TIPO_INSTRUCCION;
var TIPO_VISIBILIDAD = require('../api/Instrucciones').TIPO_VISIBILIDAD;
var TIPO_LENGUAJE = require('../api/Instrucciones').TIPO_LENGUAJE;
var TIPO_DATO = require('../api/Instrucciones').TIPO_DATO;
var TIPO_SWITCH = require('../api/Instrucciones').TIPO_SWITCH;
var TIPO_OPERACION = require('../api/Instrucciones').TIPO_OPERACION;
var TIPO_VALOR = require('../api/Instrucciones').TIPO_VALOR;
var instruccionesApi = require('../api/InstruccionesApi').instruccionesApi;
var ErrorSemantico = require('../error/SemanticError');
const Asignacion = require('../api/instrucciones/Asignacion');
const AsignacionClase = require('../api/instrucciones/AsignacionClase');
const Break = require('../api/instrucciones/Break');
const Clase = require('../api/instrucciones/Clase');
const Constructor = require('../api/instrucciones/Constructor');
const Continue = require('../api/instrucciones/Continue');
const Declaracion = require('../api/instrucciones/Declaracion');
const doWhile = require('../api/instrucciones/doWhile');
const Else = require('../api/instrucciones/Else');
const For = require('../api/instrucciones/For');
const Function = require('../api/instrucciones/Function');
const If = require('../api/instrucciones/If');
const Instruccion = require('../api/instrucciones/Instruccion');
const Main = require('../api/instrucciones/Main');
const Switch = require('../api/instrucciones/Switch');
const Variable = require('../api/instrucciones/Variable');
const While = require('../api/instrucciones/While');
const Case = require('../api/instrucciones/Case');
const Default = require('../api/instrucciones/Default');

const Operador = require('../api/operadores/Operador');
const Entero = require('../api/operadores/Entero');
const Decimal = require('../api/operadores/Decimal');
const Caracter = require('../api/operadores/Caracter');
const Cadena = require('../api/operadores/Cadena');
const Booleano = require('../api/operadores/Booleano');
const Number = require('../api/operadores/Number');
const Objeto = require('../api/operadores/Object');

const Clean = require('../api/instrucciones/Clean');
const Include = require('../api/instrucciones/Include');
const Getch = require('../api/instrucciones/Getch');
const Imprimir = require('../api/instrucciones/Imprimir');
const Retornar = require('../api/instrucciones/Retornar.js');
const Scanner = require('../api/instrucciones/Scanner');

class Procesador{

    constructor(tablaTipos){
        this.tablaTipos = tablaTipos;
        this.paqueteria = "";
        this.clase = "";
        this.errores = [];
        this.mainFounded=false;
        this.accesJava = false;
        this.accesPython = false;
    }

    constructor(){
        var TablaTipos = require('../api/TablaTipos');
        this.tablaTipos = new TablaTipos.TablaTipos();
        this.paqueteria = "";
        this.clase="";
        //Contiene errores semanticos y sintacticos
        this.errores = [];
        this.mainFounded=false;
        this.accesJava = false;
        this.accesPython = false;
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

    checkReturns(ast, returnFounded){
        let resultado = false;
        for(let index=0; index<ast.length; index++){
            let expresion = ast[index];
            if(returnFounded){
                this.addSemanticError("Se espera que una funcion solo tenga un return y no vengan mas declaraciones despues",expresion.rol, expresion.linea, expresion.columna);
            }else{
                if(expresion.rol == TIPO_INSTRUCCION.RETURN){
                    returnFounded=true;
                    return true;
                }
            }
        }
        return resultado
    }

    checkParams(parametros, linea, columna){

        for(let index=0; index<parametros.length; index++){
            if(parametros[index] == TIPO_DATO.VOID){
                this.errores.push(new ErrorSemantico("Un parametro no puede ser void", "void",linea, columna));
                return true;
            }
        }

        return false;
    }

    checkIfs(ast){
        try{
            let if_stmt = false;
            let if_ = null;
            let returnFounded=false;
            for(let index=0; index<ast.length; index++){
                let expresion = ast[index];
                if(!returnFounded){
                    if(expresion.rol == TIPO_INSTRUCCION.IF){
                        if_stmt = true;
                        if_ = expresion;
                    }else if(expresion.rol == TIPO_INSTRUCCION.ELSE){
                        if(if_stmt){
                            if(expresion.condicion == null){
                                expresion.if = if_;
                                if_stmt = false;
                                if_ = null;
                                let resultado = this.checkReturns(expresion.instrucciones, returnFounded);
                                if(!returnFounded){
                                    returnFounded = resultado;
                                }else{
                                    this.addSemanticError("Se espera que una funcion solo tenga un return", expresion.rol, expresion.linea, expresion.columna);
                                }
                            }else{                            
                                expresion.if = if_;
                            }   
                        }else{
                            this.addSyntaxError("Se necesita un if antes de un else", "else ", expresion.linea, expresion.columna);
                        }
                    }else{  
                        if_stmt = false;
                        if_ = null;
                        if(expresion.rol == TIPO_INSTRUCCION.RETURN){
                            returnFounded=true;
                        }
                    }
                }else{
                    this.addSemanticError("Se espera que una funcion solo tenga un return y no vengan mas declaraciones despues",expresion.rol, expresion.linea, expresion.columna);
                }
            }
        }catch(ex){
            console.log(ex);
        }
        
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
    procesar(ast, paqueteria, ambito){
        this.paqueteria = paqueteria;
        this.checkIfs(ast);
        let instrucciones = [];
        ast.array.forEach(instruccion => {
            let resultado = null;
                if(instruccion.rol == TIPO_INSTRUCCION.DECLARACION){
                    resultado = this.procesarDeclaracion(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.INCLUDE){
                    resultado =  this.procesarInclude(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.FUNCION){
                    resultado =  this.procesarFuncion(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.MAIN){
                    resultado =   this.procesarMain(instruccion, ambito, paqueteria);
                }else if (instruccion.rol == TIPO_INSTRUCCION.CONSTRUCTOR){
                    resultado = this.procesarConstructor(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CLASE){
                    resultado =  this.procesarClase(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ASIGNACION_CLASE) {
                    resultado = this.procesarAsignacionClase(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ASIGNACION_O){
                    resultado = this.procesarAsignacion(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.VARIABLE){
                    resultado =  this.procesarVariable(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.IF){
                    resultado = this.procesarIf(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ELSE){
                    resultado =  this.procesarElse(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.SWITCH){
                    resultado =  this.procesarSwitch(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.FOR){
                    resultado =  this.procesarFor(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.WHILE){
                    resultado = this.procesarWhile(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.DO){
                    resultado =  this.procesarDo(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CLEAN){
                    resultado =  this.procesarClean(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.GETCH){
                    resultado = this.procesarGetch(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.IMPRIMIR){
                    resultado = this.procesarImprimir(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CONTINUE){
                    resultado =  this.procesarContinue(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.BREAK){
                    resultado = this.procesarBreak(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.RETURN){
                    resultado = this.procesarReturn(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.METODO){
                    resultado = this.procesarMetodo(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.SCAN){
                    resultado =  this.procesarScan(instruccion)
                }
            if(resultado!=null){
                instrucciones.push(resultado);
            }
            
        });
        return instrucciones;
    }

    procesarLongitud(longitud){
        if(longitud!=null || longitud.length !=0){
            return true;
        }
        return false;
    }

    agregar(resultado, tipo){
        if(resultado!=null){
            if(resultado.getPaqueteria() == paqueteria){
                this.errores.push(new ErrorSemantico("Ya existe la variable en el mismo paquete", id, instruccion.linea, instruccion.columna));
            }else{
                this.tablaTipos.agregarTipos(tipo);
                return tipo.getInstruccion();
            }
        }else{
            this.tablaTipos.agregarTipo(tipo);
            return tipo.getInstruccion();
        }
        return null;
    }

    procesarDeclaracion(instruccion, ambito, paqueteria){
        let visibilidad = instruccion.visibilidad;
        let id = instruccion.id.valor;
        let tipo = instruccion.tipo;
        let longitud = instruccion.magnitud;
        let esArreglo = this.procesarLongitud(longitud);
        let rol = instruccion.rol;
        let paquete = paqueteria;
        let lenguaje = instruccion.lenguaje;
        if(lenguaje == TIPO_LENGUAJE.C){
            let auxiliarTipo = tipo.split(".");       
            if(auxiliarTipo[0] == "JAVA"){
                let identificadorClase = auxiliarTipo[1];
                let clase = this.tablaTipos.buscarClase(identificadorClase, paqueteria);
                if(clase == null){
                    clase = this.tablaTipos.buscarClase_C(identificadorClase);
                }
                tipo = clase.getInstruccion();
            }
        }
        let simbolo = new Declaracion(visibilidad, id, longitud, tipo, lenguaje, linea, columna, ambito, paqueteria);
        let newTipo = this.tablaTipos.crear(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, simbolo, lenguaje);
        let resultado = this.tablaTipos.buscar(newTipo);
        
        return this.agregar(resultado, newTipo);
    }

    procesarInclude(instruccion, ambito, paqueteria){
        let paquete = instruccion.paqueteria;
        let cadena = paquete.split(".");
        if(cadena.length>1){
            //Pendiente 
        }else if(cadena.length == 1){
            if(cadena[0] == "PY"){
                this.accesPython = true;
            }else if(cadena[0] == "JAVA"){
                this.accesJava = true;
            }else{
                this.errores.push(new ErrorSemantico("No se reconoce la indicacion del paquete", "#include "+paquete, instruccion.linea, instruccion.columna));
            }
        }
        return null;
    }

    procesarFuncion(instruccion, ambito, paqueteria){
        let visibilidad = instruccion.visibilidad;
        let id = instruccion.id;
        let tipo = instruccion.tipo;
        let longitud = instruccion.parametros;
        if(this.checkParams(longitud, instruccion.linea, instruccion.columna)){
            return null;
        }
        let esArreglo = false;
        let rol = instruccion.rol;
        let paquete = paqueteria;
        let lenguaje = instruccion.lenguaje;
        let simbolo = new Function(visibilidad, id, tipo, null, longitud, lenguaje, instruccion.linea, instruccion.columna, ambito, paqueteria);
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        let newTipo = this.tablaTipos.crear(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, simbolo, lenguaje);
        let resultado = this.tablaTipos.buscarFuncion(id, ambito, rol, longitud);
            
        return this.agregar(resultado, newTipo);
    }

    procesarMain(instruccion, ambito,paqueteria){
        if(mainFounded){
            this.errores.push(new ErrorSemantico("Solo puede existir un main por archivo","main()", instruccion.linea, instruccion.columna));
            return null;
        }
        let visibilidad = TIPO_VISIBILIDAD.PUBLIC;
        let id = "main";
        let tipo = TIPO_VALOR.VOID;
        let longitud = 1;
        let esArreglo = false;
        let rol = instruccion.rol;
        let paquete = paqueteria;
        let lenguaje = instruccion.lenguaje;
        let simbolo = new Main(instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria, null);
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        let newTipo = this.tablaTipos.crear(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, simbolo, lenguaje);
        let resultado = this.tablaTipos.buscar(newTipo);
        let finalResult = this.agregar(resultado, newTipo);
        if(finalResult !=null){
            mainFounded=true;
        }
        return finalResult;
    }

    procesarConstructor(instruccion, ambito, paqueteria){
        let visibilidad = instruccion.visibilidad;
        let id = instruccion.id;
        let tipo = TIPO_VALOR.VOID;
        let longitud = instruccion.parametros;
        if(this.checkParams(longitud, instruccion.linea, instruccion.columna)){
            return null;
        }
        let esArreglo = false;
        let rol = instruccion.rol;
        let paquete = paqueteria;
        let lenguaje = instruccion.lenguaje;
        //Comparamos que sean el mismo id
        if(id != ambito.getId()){
            this.errores.push(new ErrorSemantico("El constructor no tiene el mismo nombre de la clase", id, instruccion.linea, instruccion.columna));
            return null;
        }
        let simbolo = new Constructor(id, visibilidad, null, longitud, instruccion.linea, instruccion.columna, lenguaje, ambito, paqueteria);
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        let newTipo = this.tablaTipos.crear(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, simbolo, lenguaje);
        let resultado = this.tablaTipos.buscarFuncion(id, ambito, rol, longitud);
        return this.agregar(resultado, newTipo);
    }

    procesarClase(instruccion, ambito, paqueteria){
        let visibilidad = instruccion.visibilidad;
        let id = instruccion.id;
        let idExtension = instruccion.idExtension;
        let tipo = TIPO_VALOR.VOID;
        let longitud = 1;
        let esArreglo = false;
        let rol = instruccion.rol;
        let lenguaje = instruccion.lenguaje;
        let simbolo = new Clase(id, null, idExtension, visibilidad, instruccion.linea, instruccion.columna, lenguaje, ambito, paqueteria);
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        let newTipo = this.tablaTipos.crear(visibilidad, id, tipo, ambito, idExtension, esArreglo, rol, paquete, simbolo, lenguaje);
        let resultado = this.tablaTipos.buscar(newTipo);
        return this.agregar(resultado, newTipo);
    }

    procesarAsignacionClase(instruccion, ambito, paqueteria){
        let visibilidad = instruccion.visibilidad;
        let id = instruccion.id;
        let tipo = instruccion.tipo; //Esto es una cadena desfragmentar y encontrar el tipo
        if(tipo!=null){
            let aux = tipo.split(".");
            let nombreClase = aux[1];
            let clase = this.tablaTipos.buscarClase(nombreClase, paqueteria);
            if(clase == null){
                clase = this.tablaTipos.buscarClase_C(nombreClase);
            }
            tipo = clase.getInstruccion();
        }
        let parametros = instruccion.parametros;
        //Convertimos los parametros
        let operador = new Operador();
        //Devuelve objetos
        let newParametros = operador.calcularParametros(parametros, ambito, this.tablaTipos, this.errores);
        let rol = TIPO_INSTRUCCION.DECLARACION;
        let lenguaje = instruccion.lenguaje;
        let simbolo = new AsignacionClase(id, parametros, tipo, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria);
        //Comparacion de los parametros
        let helper = operador.convertirParametros_tipo(tipo.parametros);
        let result1 = operador.compararParametros(id,newParametros, helper, instruccion.linea, instruccion.columna,this.errores);
        if(result1){
            return null;
        }
        let resultado = this.tablaTipos.buscar(id, ambito, rol, lenguaje, paquete );

        if(resultado == null){
            let newTipo = this.tablaTipos.crear(visibilidad, id, tipo, ambito, 1, false, rol, paqueteria, simbolo, lenguaje );
            this.tablaTipos.agregarTipo(newTipo);
            return simbolo;
        }
        this.errores.push(new ErrorSemantico("Ya existe la variable", id, instruccion.linea, instruccion.columna));
        return null;
    }

    procesarAsignacion(instruccion, ambito, paqueteria){
        let visibilidad = TIPO_VISIBILIDAD.LOCAL;
        let id = instruccion.id.valor;
        let magnitud = instruccion.magnitud;
        let rol = instruccion.rol;
        let operador = instruccion.operador;
        let expresion = instruccion.expresion;
        //Comprobando el tipo de la expresion
        let simbolo = new Asignacion(id, magnitud, operador, expresion, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria);
        let newTipo = this.tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.IDENTIFICADOR, instruccion.lenguaje, paqueteria);
        let operador_ = new Operador();

        let newExpresion = expresion;
        let newValor = instruccionesApi.nuevoValor(instruccion.id, magnitud, newTipo.getTipo(), instruccion.lenguaje, instruccion.linea, instruccion.columna);
        if(operador == TIPO_OPERACION.IGUAL){
            newExpresion = expresion;
        }else if(operador == TIPO_OPERACION.SUMA){
            newExpresion = instruccionesApi.operacionAritmetica(newValor, expresion, TIPO_OPERACION.SUMA, instruccion.lenguaje, instruccion.linea, instruccion.columna);
        }else if(operador == TIPO_OPERACION.RESTA){
            newExpresion = instruccionesApi.operacionAritmetica(newValor, expresion, TIPO_OPERACION.RESTA, instruccion.lenguaje, instruccion.linea, instruccion.columna);
        }else if(operador == TIPO_OPERACION.MULTIPLICACION){
            newExpresion = instruccionesApi.operacionAritmetica(newValor, expresion, TIPO_OPERACION.MULTIPLICACION, instruccion.lenguaje, instruccion.linea, instruccion.columna);
        }else if(operador == TIPO_OPERACION.DIVISION){
            newExpresion = instruccionesApi.operacionAritmetica(newValor, expresion, TIPO_OPERACION.DIVISION, instruccion.lenguaje, instruccion.linea, instruccion.columna);
        }else if(operador == TIPO_OPERACION.MOD){
            newExpresion = instruccionesApi.operacionAritmetica(newValor, expresion, TIPO_OPERACION.MOD, instruccion.lenguaje, instruccion.linea, instruccion.columna);
        }else if(operador == TIPO_OPERACION.POW){
            newExpresion = instruccionesApi.operacionAritmetica(newValor, expresion, TIPO_OPERACION.POW, instruccion.lenguaje, instruccion.linea, instruccion.columna);
        }else if(operador == TIPO_OPERACION.INCREMENTO){
            let auxiliarValor = instruccionesApi.nuevoValor(1, null, TIPO_VALOR.ENTERO, instruccion.lenguaje, instruccion.linea, instruccion.columna);
            newExpresion = instruccionesApi.operacionAritmetica(newValor, auxiliarValor, instruccion.lenguaje, instruccion.linea, instruccion.columna)
        }else if(operador == TIPO_EXPRESION.DECREMENTO){
            let aux = instruccionesApi.nuevoValor(1, null, TIPO_VALOR.ENTERO, instruccion.lenguaje, instruccion.linea, instruccion.columna);
            let auxiliarValor = instruccionesApi.operacionUnaria(aux, TIPO_OPERACION.NEGATIVO, instruccion.lenguaje, instruccion.linea, instruccion.columna);
            newExpresion = instruccionesApi.operacionAritmetica(newValor, auxiliarValor, instruccion.lenguaje, instruccion.linea, instruccion.columna)
        }
        simbolo.setExpresion(newExpresion);
        expresion = newExpresion;
        
        if(newTipo == null){
            let tipoCreado = this.tablaTipos.crear(visibilidad, id, TIPO_VALOR.ANY, ambito, 1, false, TIPO_INSTRUCCION.DECLARACION, paqueteria, simbolo, instruccion.lenguaje);
            this.tablaTipos.agregarTipo(tipoCreado);
            if(expresion == TIPO_VALOR.INPUT){
                /*nothing*/ 
            }else{
                operador_.procesarOperaciones(expresion, ambito, this.tablaTipos, this.errores);
                return simbolo;
            }
        }else{
            if(expresion == TIPO_VALOR.INPUT_INT){
                if(newTipo.getTipo() == TIPO_VALOR.ENTERO
                || newTipo.getTipo() == TIPO_VALOR.DECIMAL){
                    /*empty*/ 
                }else{
                    this.errores.push(new ErrorSemantico("Los tipos no son compatibles", id, instruccion.linea, instruccion.columna));
                    return null;
                }
            }else if(expresion == TIPO_VALOR.INPUT_CHAR){
                if(newTipo.getTipo() == TIPO_VALOR.ENTERO
                || newTipo.getTipo() == TIPO_VALOR.DECIMAL
                || newTipo.getTipo() == TIPO_VALOR.CARACTER ){
                    /*nothing*/ 
                }else{
                    this.errores.push(new ErrorSemantico("Los tipos no son compatibles", id, instruccion.linea, instruccion.columna));
                    return null;
                }
            }else if(expresion == TIPO_VALOR.INPUT_FLOAT){
                if(newTipo.getTipo() == TIPO_VALOR.DECIMAL){
                    /*nothing*/ 
                }else{
                    this.errores.push(new ErrorSemantico("Los tipos no son compatibles", id, instruccion.linea, instruccion.columna));
                    return null;
                }
            }else{
                let resultado = operador_.procesarOperaciones(expresion, ambito, this.tablaTipos, this.errores);
                if(resultado == newTipo.getTipo()) {
                    return true;
                }
                if(newTipo.getTipo() == TIPO_VALOR.ENTERO){
                    if((resultado instanceof Entero)==false){
                        this.errores.push(new ErrorSemantico("Los tipos no son compatibles", id, instruccion.linea, instruccion.columna));
                        return null;
                    }
                }else if(newTipo.getTipo() == TIPO_VALOR.DECIMAL){
                    if((resultado instanceof Decimal)==false){
                        this.errores.push(new ErrorSemantico("Los tipos no son compatibles", id, instruccion.linea, instruccion.columna));
                        return null;
                    }
                }else if(newTipo.getTipo() == TIPO_VALOR.CARACTER){
                    if((resultado instanceof Caracter)==false){
                        this.errores.push(new ErrorSemantico("Los tipos no son compatibles", id, instruccion.linea, instruccion.columna));
                        return null;
                    }
                }else if(newTipo.getTipo() == TIPO_VALOR.CADENA){
                    if((resultado instanceof Cadena)==false){
                        this.errores.push(new ErrorSemantico("Los tipos no son compatibles", id, instruccion.linea, instruccion.columna));
                        return null;
                    }
                }else if(newTipo.getTipo() == TIPO_VALOR.BOOLEAN){
                    if((resultado instanceof Booleano)==false){
                        this.errores.push(new ErrorSemantico("Los tipos no son compatibles", id, instruccion.linea, instruccion.columna));
                        return null;
                    }
                }
                return simbolo;
            }
        }
        
        return simbolo;
    }

    procesarVariable(instruccion, ambito, paqueteria){
        let arreglo = instruccion.arreglo;
        let ast = this.procesar(arreglo, paqueteria, ambito);
        let declaraciones = [];
        let asignaciones = [];
        for(let index=0; index<ast.length; index++){
            if(ast[index] instanceof Declaracion){
                declaraciones.push(ast[index]);
            }else {
                asignaciones.push(ast[index]);
            }
        }
        let simbolo = new Variable(declaraciones, asignaciones, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria, null);
        return simbolo;
    }

    procesarIf(instruccion, ambito, paqueteria){
        let condicion = instruccion.condicion;
        let lenguaje = instruccion.lenguaje;
        let operador = new Operador();
        let resultado = operador.procesarOperaciones(condicion, ambito, this.tablaTipos, this.errores);
        let simbolo = new If(operador, instruccion.linea, instruccion.columna, lenguaje, ambito, paqueteria, null);
        if(lenguaje == TIPO_LENGUAJE.JAVA){
            if((resultado instanceof Booleano)==false){
                this.errores.push(new ErrorSemantico("Solo se permiten soluciones booleanas en java", "if", instruccion.linea, instruccion.columna));
                return null;
            }
        }else{
            if((resultado instanceof Number) == false){
                this.errores.push(new ErrorSemantico("Solo se permiten soluciones numericas", "if", instruccion.linea, instruccion.columna));
                return null;
            }
        }
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        return simbolo;
    }

    procesarElse(instruccion, ambito, paqueteria){
        let condicion = instruccion.condicion;
        let lenguaje = instruccion.lenguaje;
        let simbolo = new Else(condicion, null, instruccion.linea, instruccion.columna, lenguaje, ambito, paqueteria);
        if(condicion != null){
            let operador = new Operador();
            let resultado = operador.procesarOperaciones(condicion, ambito, this.tablaTipos, this.errores);
            if(lenguaje == TIPO_LENGUAJE.JAVA){
                if((resultado instanceof Booleano)==false){
                    this.errores.push(new ErrorSemantico("Solo se permiten soluciones booleanas en java", "else if", instruccion.linea, instruccion.columna));
                    return null;
                }
            }else{
                if((resultado instanceof Number) == false){
                    this.errores.push(new ErrorSemantico("Solo se permiten soluciones numericas", "else if", instruccion.linea, instruccion.columna));
                    return null;
                }
            }
        }
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        return simbolo;
    }

    procesarSwitch(instruccion, ambito, paqueteria){
        let id = instruccion.id;
        let cases = instruccion.cases;
        let variable = this.tablaTipos.buscar(id, ambito, TIPO_INSTRUCCION.DECLARACION, instruccion.lenguaje, paqueteria);
        if(variable!=null){
            if(variable.getTipo() == TIPO_DATO.BOOLEAN){
                this.errores.push(new ErrorSemantico("Una variable booleana no puede ir en un switch", variable.getId(), instruccion.linea, instruccion.columna));
                return null;
            }
        }
        let operador = new Operador();
        let tipo = operador.convertirParametro(variable.getTipo());
        let simbolo = new Switch(id, [],null, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria);
        let returnThen = true;
        for(let index=0; index<cases.length; index++){
            let caso = cases[index];
            let expresion = caso.condicion;
            let resultado = null;
            
            if(caso == TIPO_SWITCH.CASE){
                resultado = operador.procesarOperaciones(expresion);
                if((resultado instanceof tipo) == false){
                    this.errores.push(new ErrorSemantico("El tipo de la condicion de case no es del mismo tipo que la variable", id, instruccion.linea, instruccion.columna));
                    returnThen = false;                    
                }else{
                    let newCase = new Case(expresion, instruccion.linea, instruccion.columna, instruccion.lenguaje, simbolo, paqueteria, null);
                    let instrucciones = this.procesar(caso.instrucciones, paqueteria, newCase);
                    newCase.setInstrucciones(instrucciones);
                    simbolo.setCase(newCase);
                }
            }else if(caso == TIPO_SWITCH.DEFAULT){
                let newDefault = new Default(instruccion.linea, instruccion.columna, instruccion.lenguaje, simbolo, paqueteria, null);
                let instrucciones = this.procesar(caso.instrucciones, paqueteria, newDefault);
                newDefault.setInstrucciones(instrucciones);;
                simbolo.setDefault(newDefault);
            }else{
                return null;
            }
        }        

        if(!returnThen){
            return simbolo;
        }   
        return null;
    }

    procesarFor(instruccion, ambito, paqueteria){
        let valorInicial = instruccion.valor_inicial;
        let condicion = instruccion.condicion;
        let accionPost = instruccion.accion_post;
        let rol = instruccion.for;
        let simbolo = new For(valor_inicial, condicion, accionPost, null, instruccion.lenguaje, instruccion.linea, instruccion.columna, paqueteria, ambito);
        let operador = new Operador();
        
        let inicio = null;
        let post = null;

        if(instruccion.lenguaje == TIPO_LENGUAJE.JAVA
            || instruccion.lenguaje == TIPO_LENGUAJE.C){
            //procesando condicion
            //procesando valor inicial
            inicio = this.procesar(valorInicial, paqueteria, simbolo);
            let resultado = operador.procesarOperaciones(condicion);
            if((resultado instanceof Booleano) == false){
                this.errores.push(new ErrorSemantico("La condicion del for debe ser booleana", "for", instruccion.linea, instruccion.columna));            
                return null;
            }
            //procesando accion_post
            post = this.procesar(accionPost, paqueteria, simbolo);
        }else if(instruccion.lenguaje == TIPO_LENGUAJE.PYTHON){
            inicio = this.procesar(valorInicial, paqueteria, simbolo);
            if(Array.isArray(condicion)){
                if(condicion.length==1){
                    //Declaracion y asignacion
                    let idInit = valorInicial[0].id;
                    let expresionInit = instruccionesApi.nuevoValor(0, null, TIPO_VALOR.ENTERO, instruccion.lenguaje,
                        instruccion.linea, instruccion.columna);
                    valorInicial.push(instruccionesApi.nuevaAsignacion_O(idInit, null, TIPO_OPERACION.IGUAL,
                        expresionInit, instruccion.lenguaje, instruccion.linea, instruccion.columna));
                    inicio = this.procesar(valorInicial, paqueteria, simbolo);
                    //Condicion
                    let operadorL = instruccionesApi.nuevoValor(idInit, null, TIPO_VALOR.IDENTIFICADOR, instruccion.lenguaje,
                        instruccion.linea, instruccion.columna);
                    let operadorR = condicion[0];
                    let auxCondicion = instruccionesApi.operacionAritmetica(operadorL, operadorR, TIPO_OPERACION.MENOR, 
                        instruccion.lenguaje, instruccion.linea, instruccion.columna);                        
                    let resultado = operador.procesarOperaciones(auxCondicion);
                    if((resultado instanceof Number) == false){
                        this.errores.push(new ErrorSemantico("La condicion no es un numero", "range(", instruccion.linea, instruccion.columna));
                        return null;
                    }
                    condicion = auxCondicion;
                    post = this.procesar(accionPost, paqueteria, simbolo);
                }else if(condicion.length == 2){
                    //Declaracion y asignacion
                    let idInit = valorInicial[0].id;
                    let expresionInit = condicion[0];
                    valorInicial.push(instruccionesApi.nuevaAsignacion_O(idInit, null, TIPO_OPERACION.IGUAL,
                        expresionInit, instruccion.lenguaje, instruccion.linea, instruccion.columna));
                    inicio = this.procesar(valorInicial, paqueteria, simbolo);
                    //Condicion
                    let operadorL = instruccionesApi.nuevoValor(idInit, null, TIPO_VALOR.IDENTIFICADOR, instruccion.lenguaje,
                        instruccion.linea, instruccion.columna);
                    let operadorR = condicion[1];
                    let auxCondicion = instruccionesApi.operacionAritmetica(operadorL, operadorR, TIPO_OPERACION.MENOR, 
                        instruccion.lenguaje, instruccion.linea, instruccion.columna);                        
                    let resultado = operador.procesarOperaciones(auxCondicion);
                    if((resultado instanceof Number) == false){
                        this.errores.push(new ErrorSemantico("La condicion no es un numero", "range(", instruccion.linea, instruccion.columna));
                        return null;
                    }
                    condicion = auxCondicion;
                    post = this.procesar(accionPost, paqueteria, simbolo);
                }else if(condicion.length == 3){
                    //Declaracion y asignacion
                    let idInit = valorInicial[0].id;
                    let expresionInit = condicion[0];
                    valorInicial.push(instruccionesApi.nuevaAsignacion_O(idInit, null, TIPO_OPERACION.IGUAL,
                        expresionInit, instruccion.lenguaje, instruccion.linea, instruccion.columna));
                    inicio = this.procesar(valorInicial, paqueteria, simbolo);
                    //Condicion
                    let operadorL = instruccionesApi.nuevoValor(idInit, null, TIPO_VALOR.IDENTIFICADOR, instruccion.lenguaje,
                        instruccion.linea, instruccion.columna);
                    let operadorR = condicion[1];
                    let auxCondicion = instruccionesApi.operacionAritmetica(operadorL, operadorR, TIPO_OPERACION.MENOR, 
                        instruccion.lenguaje, instruccion.linea, instruccion.columna);                        
                    let resultado = operador.procesarOperaciones(auxCondicion);
                    if((resultado instanceof Number) == false){
                        this.errores.push(new ErrorSemantico("La condicion no es un numero", "range(", instruccion.linea, instruccion.columna));
                        return null;
                    }
                    condicion = auxCondicion;
                    accionPost = instruccionesApi.nuevaAsignacion_O(idInit, [], TIPO_OPERADOR.SUMA, condicion[2],
                        instruccion.lenguaje, instruccion.linea, instruccion.columna);
                    post = this.procesar(accionPost, paqueteria, simbolo);
                }else{
                    this.errores.push(new ErrorSemantico("Range dentro del for puede tener hasta un maximo de 3 parametros unicamente", ));
                }
            }else{
                return null;
            }
        }
        //Condiciones de simbolos
        simbolo.setValorInicial(inicio);
        simbolo.setCondicion(condicion);
        simbolo.setAccionPost(post);        
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        return simbolo;
    }

    procesarWhile(instruccion, ambito, paqueteria){
        let condicion = instruccion.condicion;
        let operador = new Operador();
        let tipoFinal = operador.procesarOperaciones(condicion, ambito, this.tablaTipos, this.errores);
        let simbolo = new While(condicion, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria, null);
        if(tipoFinal!=null){
            if(instruccion.lenguaje == TIPO_LENGUAJE.JAVA){
                if((tipoFinal instanceof Booleano) == false){
                    this.errores.push(new ErrorSemantico("La condicion del while debe ser booleana", "while", instruccion.linea, instruccion.columna));;
                    return null;
                }
            }else{
                if((tipoFinal instanceof Number) == false){
                    this.errores.push(new ErrorSemantico("La condicion del while debe ser numerica", "while", instruccion.linea, instruccion.columna));
                    return null;
                }
            }
        }
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        return simbolo;
    }

    procesarDo(instruccion, ambito, paqueteria){
        let condicion = instruccion.condicion; 
        let operador = new Operador();
        let tipoFinal = operador.procesarOperaciones(condicion, ambito, this.tablaTipos, this.errores);
        let simbolo = new doWhile(null, condicion, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria);
        if(tipoFinal!=null){
            if(instruccion.lenguaje == TIPO_LENGUAJE.JAVA){
                if((tipoFinal instanceof Booleano)){
                    this.errores.push(new ErrorSemantico("La condicion del Do while debe ser booleana", "do", instruccion.linea, instruccion.columna));
                    return null;            
                }
            }else{
                if((tipoFinal instanceof Number) == false){
                    this.errores.push(new ErrorSemantico("La condicion del Do While debe ser numerica", "do", instruccion.linea, instruccion.columna));;
                    return null;
                }
            }
        }
        let instrucciones = this.procesar(instruccion.instrucciones, paqueteria, simbolo);
        simbolo.setInstrucciones(instrucciones);
        return simbolo;
    }

    procesarClean(instruccion, ambito, paqueteria){
        return new Clean(null, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria);
    }

    procesarGetch(instruccion, ambito, paqueteria){
        return new Getch(null, instruccion.lenguaje, instruccion.linea, instruccion.columna, ambito, paquete);
    }

    procesarImprimir(instruccion, ambito, paqueteria){
        let tipo = instruccion.tipo;
        let parametros = instruccion.parametros;
        let operador = new Operador();
        let simbolo = new Imprimir(tipo, parametros, null, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria);
        if(instruccion.lenguaje == TIPO_LENGUAJE.JAVA ||
            instruccion.lenguaje == TIPO_LENGUAJE.PYTHON){
                for(let index=0; index<parametros.length; index++){
                    let resultado = operador.procesarOperaciones(parametros[index], ambito, this.tablaTipos, this.errores)
                    if(resultado == null){
                        this.errores.push(new ErrorSemantico("No se puede usar la expresion en el print", tipo, instruccion.linea, instruccion.columna));
                        return null;
                    }
                }
        }else{
            let tipoInicial = parametros[0];
            let arreglo = [];
            if(tipoInicial == TIPO_VALOR.CADENA){
                let cadena = tipoInicial.split("");
                let flag=false;
                for(let index=0; index<cadena.length; index++){
                    if(flag){
                        if(cadena[index] == "d"){
                            arreglo.push(Entero);
                        }else if(cadena[index] == "c"){
                            arreglo.push(Caracter);
                        }else if(cadena[index] == "f"){
                            arreglo.push(Decimal);
                        }
                        flag=false;
                    }
                    if(cadena[index] == "%"){
                        flag=true;
                    }
                }
                if(arreglo.length == parametros.length-1){
                    for(let index=1; index<parametros.length; index++){
                        let resultado = operador.procesarOperaciones(parametros[index], ambito, this.tablaTipos, this.errores)
                        if((resultado instanceof arreglo[index-1])==false){
                            this.errores.push(new ErrorSemantico("Se esperaba que el parametro fuera de tipo "+this.checkTipo(arreglo[index-1]), "printf", instruccion.linea, instruccion.columna));
                            return null;
                        }
                    }
                }else{
                    this.errores.push(new ErrorSemantico("La cantidad de parametros especificados en el print debe de ser igual que al numero de %param establecidos en la cadena", "printf", instruccion.linea, instruccion.columna));
                    return null;
                }
            }
        }

        return simbolo;
    }

    checkTipo(tipo){
        if(tipo instanceof String){
            return "String";
        }else if(tipo instanceof Booleano){
            return "Booleano";
        }else if(tipo instanceof Caracter){
            return "Caracter";
        }else if(tipo instanceof Entero){
            return "Entero";
        }else if(tipo instanceof Decimal){
            return "Decimal";
        }
        return "";
    }

    /*Retorna un Objeto para realizar instance of dependiendo del TIPO_DATO establecido*/
    tipoDato_tipo(tipo){
        if(tipo == TIPO_DATO.INT){
            return Entero;
        }else if(tipo == TIPO_DATO.FLOAT){
            return Decimal;
        }else if(tipo == TIPO_DATO.STRING){
            return String;
        }else if(tipo == TIPO_DATO.CHAR){
            return Caracter;
        }else if(tipo == TIPO_DATO.VOID){
            return null;
        }else if(tipo == TIPO_DATO.BOOLEAN){
            return Booleano;
        }else if(tipo == TIPO_DATO.ANY){
            return Objeto;
        }
        return null;
    }

    procesarContinue(instruccion, ambito, paqueteria){
        let ambitoCiclo = ambito.ambitoEnCiclo();
        let simbolo = new Continue(instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria);
        if(ambitoCiclo == null){
            this.errores.push(new ErrorSemantico("No se puede usar continue porque no esta dentro de un ciclo", instruccion.rol, instruccion.linea, instruccion.columna));
            return null;
        }
        return simbolo;
    }

    procesarBreak(instruccion, ambito, paqueteria){
        let ambitoCiclo = ambito.ambitoEnCiclo();
        let simbolo = new Break(instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria);
        if(ambitoCiclo == null){
            this.errores.push(new ErrorSemantico("No se puede usar continue porque no esta dentro de un ciclo", instruccion.rol, instruccion.linea, instruccion.columna));
            return null;
        }
        return simbolo;
    }

    procesarReturn(instruccion, ambito, paqueteria){
        let ambitoFuncion = ambito.ambitoEnFuncion();
        let expresion = instruccion.expresion;
        //Chequeo de tipo de retorno
        let finalType = null;
        if(ambitoFuncion!=null){
            let operador = new Operador();
            let resultado = operador.procesarOperaciones(expresion, ambito, this.tablaTipos, this.errores);
            let tipoFuncion = this.tipoDato_tipo(ambitoFuncion.getTipo());
            finalType = tipoFuncion;
            if(resultado != null){
                if(tipoFuncion==null){
                    this.errores.push(new ErrorSemantico("La funcion es void no puede devolver parametros", "return" , instruccion.linea, instruccion.columna));
                    return null;
                }
                if((resultado instanceof tipoFuncion) == false){
                    this.errores.push(new ErrorSemantico("La funcion no es compatible con el return", "return", instruccion.linea, instruccion.columna));
                    return null;
                }
            }else{
                return null;
            }            
        }else{
            this.errores.push(new ErrorSemantico("No se puede declarar un return mientras no este en una funcion", "return", instruccion.linea, instruccion.columna));
            return null;
        }
        let simbolo = new Retornar(expresion, instruccion.linea, instruccion.columna, instruccion.lenguaje, ambito, paqueteria, null);
        let nuevoTipo = this.tablaTipos.crear(TIPO_VISIBILIDAD.LOCAL, "return", finalType,ambito, 1, false, instruccion.rol, paqueteria, simbolo, instruccion.lenguaje );
        let resultado = this.tablaTipos.buscar(nuevoTipo);
        return this.agregar(resultado, nuevoTipo);
    }

    procesarMetodo(instruccion, ambito, paqueteria){

    }

    procesarScan(instruccion, ambito, paqueteria){
        let id = instruccion.id.valor;
        let cadena = instruccion.cadena;
        let variable = this.tablaTipos.buscar(id,ambito, TIPO_INSTRUCCION.DECLARACION, instruccion.lenguaje, paqueteria);
        if(variable == null){
            this.errores.push(new ErrorSemantico("La variable no existe", id, instruccion.linea, instruccion.columna));
            return null;
        }
        if(cadena == TIPO_VALOR.CADENA){
            let tipoVariable = null;
            let auxCadena = cadena.split('');
            let flag=false;

            for(let index=0; index<auxCadena.length; index++){
                if(flag){
                    if(auxCadena[index] == 'd'){
                        tipoVariable = Entero;
                        break;
                    }else if(auxCadena[index] == 'c'){
                        tipoVariable = Caracter;
                        break;
                    }else if(auxCadena[index] == 'f'){
                        tipoVariable = Decimal;
                        break;
                    }
                    flag=false;
                }
                if(auxCadena[index] == "%"){
                    flag=true;
                }               
            }
            //Comparamos la variable con el parametro encontrado
            let tipoComparacion = new Operador().generarValorVacioSegunTipo(variable.getTipo(), this.errores, instruccion.lenguaje);
            if((tipoComparacion instanceof tipoVariable) == false){
                this.errores.push(new ErrorSemantico("El tipo indicado en la cadena no es compatible", id, instruccion.linea, instruccion.columna));
                return null;
            }

        }else{
            this.errores.push("Se esperaba una literal string", "scanf", instruccion.linea, instruccion.columna);
            return null;
        }
        let simbolo = new Scanner(variable.getInstruccion(), cadena, instruccion.lenguaje, instruccion.linea, instruccion.columna, ambito, paqueteria);
        return simbolo;
    }
    
}

module.exports = Procesador;