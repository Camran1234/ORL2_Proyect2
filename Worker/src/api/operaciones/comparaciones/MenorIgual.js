var OperacionComparacion = require('../OperacionComparacion');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Number = require('../../operadores/Number');
const Entero = require('../../operadores/Entero');
const ErrorSemantico = require('../../../error/SemanticError');
const TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;

class MenorIgual extends OperacionComparacion {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
        this.operador = "<=";
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

    operar(errores){
        //Condicion de operacion
        if(this.operadorL instanceof Number && this.operadorR instanceof Number){
            if(this.lenguaje == TIPO_LENGUAJE.JAVA){
                if(this.operadorL instanceof Booleano || this.operadorL instanceof Booleano){
                    errores.push(new ErrorSemantico("Los operadores no pueden ser booleanos", "<=", this.linea, this.columna));
                }else{
                    return new Booleano("", this.linea, this.columna, this.lenguaje);
                }
            }else{
                return new Entero("", this.linea, this.columna, this.lenguaje);
            }
        }else{
            errores.push(new ErrorSemantico("Los operadores no son compatibles, numericos con numericos", "<=", this.linea, this.columna));
        }
        return null;
        //Fin de condicion        
    }
}

module.exports = MenorIgual;