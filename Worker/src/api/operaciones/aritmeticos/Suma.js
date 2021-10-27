const  TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;
var OperacionAritmetica = require('../OperacionAritmetica');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Caracter = require('../../operadores/Caracter');
const Decimal = require('../../operadores/Decimal');
const Entero = require('../../operadores/Entero');

class Suma extends OperacionAritmetica {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
        this.operador = "+";
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
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(this.operadorL instanceof Booleano || this.operadorR instanceof Booleano){
                this.crearError(errores, "+", "operar");
                return null;
            }
        }
        //Fin de condicion
        let resultadoL = this.operadorL.tryParse(this.operadorR);
        let resultadoR = this.operadorR.tryParse(this.operadorL);
        if(resultadoL!=null){
            this.tipo = resultadoL;
            return resultadoL;
        }else if(resultadoR !=null){
            this.tipo = resultadoR;
            return resultadoR;
        }
        this.crearError(errores, "+", "parsear");
        return null;
    }

}

module.exports = Suma;