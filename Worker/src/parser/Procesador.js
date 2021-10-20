var TIPO_INSTRUCCION = require('../api/Instrucciones').TIPO_INSTRUCCION;

var ErrorSemantico = require('../error/SemanticError');
const Asignacion = require();

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
        ast.array.forEach(instruccion => {
            if(this.procesarEstado(estado, instruccion)){
                if(instruccion.rol == TIPO_INSTRUCCION.DECLARACION){
                    this.procesarDeclaracion(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.INCLUDE){
                    this.procesarInclude(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.FUNCION){
                    this.procesarFuncion(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.MAIN){
                    this.procesarMain(instruccion, ambito, paqueteria);
                }else if (instruccion.rol == TIPO_INSTRUCCION.CONSTRUCTOR){
                    this.procesarConstructor(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CLASE){
                    this.procesarClase(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ASIGNACION_O){
                    this.procesarAsignacion(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.VARIABLE){
                    this.procesarVariable(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.IF){
                    this.procesarIf(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.ELSE){
                    this.procesarElse(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.SWITCH){
                    this.procesarSwitch(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.FOR){
                    this.procesarFor(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.WHILE){
                    this.procesarWhile(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.DO){
                    this.procesarDo(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CLEAN){
                    this.procesarClean(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.GETCH){
                    this.procesarGetch(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.IMPRIMIR){
                    this.procesarImprimir(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.CONTINUE){
                    this.procesarContinue(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.BREAK){
                    this.procesarBreak(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.RETURN){
                    this.procesarReturn(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.METODO){
                    this.procesarMetodo(instruccion, ambito, paqueteria);
                }else if(instruccion.rol == TIPO_INSTRUCCION.SCAN){
                    this.procesarScan(instruccion)
                }
            }
            
        });
    }

    procesarDeclaracion(instruccion, ambito, paqueteria){
        
    }

    procesarInclude(instruccion, ambito, paqueteria){

    }

    procesarFuncion(instruccion, ambito, paqueteria){

    }

    procesarMain(instruccion, ambito,estado){

    }

    procesarConstructor(instruccion, ambito, paqueteria){

    }

    procesarClase(instruccion, ambito, paqueteria){

    }

    procesarAsignacion(instruccion, ambito, paqueteria){

    }

    procesarVariable(instruccion, ambito, paqueteria){

    }

    procesarIf(instruccion, ambito, paqueteria){

    }

    procesarElse(instruccion, ambito, paqueteria){

    }

    procesarSwitch(instruccion, ambito, paqueteria){

    }

    procesarFor(instruccion, ambito, paqueteria){

    }

    procesarWhile(instruccion, ambito, paqueteria){

    }

    procesarDo(instruccion, ambito, paqueteria){

    }

    procesarClean(instruccion, ambito, paqueteria){

    }

    procesarGetch(instruccion, ambito, paqueteria){

    }

    procesarImprimir(instruccion, ambito, paqueteria){

    }

    procesarContinue(instruccion, ambito, paqueteria){

    }

    procesarBreak(instruccion, ambito, paqueteria){
        
    }

    procesarReturn(instruccion, ambito, paqueteria){

    }

    procesarMetodo(instruccion, ambito, paqueteria){

    }

    procesarScan(instruccion, ambito, paqueteria){

    }
    
}

module.exports = Procesador;