var OperacionAritmetica = require('../OperacionAritmetica');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Caracter = require('../../operadores/Caracter');
const Decimal = require('../../operadores/Decimal');
const Entero = require('../../operadores/Entero');
const ErrorSemantico = require('../../../error/SemanticError');
const  TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;
class Negativo extends OperacionAritmetica {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
        this.operador = "-";
    }

    incluirLastOperacion(){
        return super.incluirLastOperacion();
     }
 
     noIncluirLastOperacion(){
         return super.noIncluirLastOperacion();
     }
 
     getTipo(){
         return super.getTipo();
     }
 
     setTipo(tipo){
         return super.setTipo(tipo)
     }
 
     setOperacionFinal(operacion){
         return  super.setOperacionFinal(operacion);
     }
 
     getOperacionFinal(){
         return  super.getOperacionFinal();
     }
 
     setNombre(t){
         return super.setNombre(t);
     }
 
     getNombre(){
         return  super.getNombre();
     }
 
     crearError(errores, token, verbo){
         return super.crearError(errores, token, verbo);
     }
 
     drawT(t){
         return  super.drawT(t);
     }
 
     drawEt(e){
         return super.drawEt(e);
     }

    generarExpresion(tablaTipos){
        let cadena = "";
        let operadorL = null;
        let resultadoL = "";
        let operacion = "";
        const Operacion = require('../Operacion');
        if(this.operadorL instanceof Operacion){
            operadorL = this.operadorL.generarExpresion(tablaTipos);
            resultadoL = this.operadorL.getNombre();
            cadena += operadorL;
        }else if(!(this.operadorL instanceof Operacion)){
            operadorL = this.operadorL;
            cadena += operadorL.codigo3D(tablaTipos);
            resultadoL = this.operadorL.parse(null,null);            
        }        
        //Operar
        operacion = this.operador+resultadoL;
        
        cadena += tablaTipos.drawT()+" = "+operacion +";\n";
        this.setNombre(tablaTipos.drawT());
        tablaTipos.addT();
        
        this.setOperacionFinal(operacion);
        return cadena;
    }

    operar(errores){
        //Condicion de operacion
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(this.operadorL instanceof Booleano){
                this.crearError(errores, "-", "aplicar unario");
                return null;
            }
        }
        if(this.operadorL instanceof Cadena ){
            if(this.operadorL instanceof Cadena){
                this.crearError(errores, this.operadorL.getValor(), "operar");
            }       
        }
        this.tipo = this.operadorL;
        return this.operadorL;
    }

}

module.exports = Negativo;