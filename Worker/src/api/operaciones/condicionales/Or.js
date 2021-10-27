var OperacionCondicional = require('../OperacionCondicional');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Number = require('../../operadores/Number');
const Entero = require('../../operadores/Entero');
const ErrorSemantico = require('../../../error/SemanticError');
const TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;

class And extends OperacionCondicional {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
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
                if(this.operadorL instanceof Booleano && this.operadorR instanceof Booleano){
                    return new Booleano("", this.linea, this.columna, this.lenguaje);
                }else{
                    errores.push(new ErrorSemantico("Los operadores no son compatibles, en java solo puede ir un booleano en una condicional", "||", this.linea, this.columna));
                }
            }else{
                return new Entero("", this.linea, this.columna, this.lenguaje);
            }
        }else{
            errores.push(new ErrorSemantico("Los operadores no son compatibles, numericos con numericos unicamente", "OR", this.linea, this.columna));
        }
        return null;
        //Fin de condicion
        
    }

    generarExpresion( tablaTipos, instruccion){
        let cadena = "";
        let operadorL = null;
        let operadorR = null;
        let resultadoL = "";
        let resultadoR = "";
        let operacion = "";
        const Operacion = require('../Operacion');
        if(this.operadorL instanceof Operacion && this.operadorR instanceof Operacion){
            operadorL = this.operadorL.generarExpresion( tablaTipos, instruccion);
            resultadoL = this.operadorL.getNombre();
            operadorR = this.operadorR.generarExpresion( tablaTipos, instruccion);
            resultadoR = this.operadorR.getNombre();
            cadena += operadorL;
            cadena += operadorR;
        }else if(this.operadorL instanceof Operacion && !(this.operadorR instanceof Operacion)){
            operadorL = this.operadorL.generarExpresion( tablaTipos , instruccion);
            cadena += operadorL;
            operadorR = this.operadorR;
            cadena += operadorR.codigo3D();
            resultadoL = this.operadorL.getNombre();
            resultadoR = this.operadorR.parse(this.operadorL.getTipo(), tablaTipos);
        }else if(!(this.operadorL instanceof Operacion) && this.operadorR instanceof Operacion){
            operadorL = this.operadorL;
            cadena += operadorL.codigo3D();
            operadorR = this.operadorR.generarExpresion( tablaTipos, instruccion);
            cadena += operadorR;
            resultadoL = this.operadorL.parse(this.operadorR.getTipo(), tablaTipos);
            resultadoR = this.operadorR.getNombre();
        }else if(!(this.operadorL instanceof Operacion) && !(this.operadorR instanceof Operacion)){
            operadorL = this.operadorL;// Valor comun puede ser una instancia BOoleano, Entero, etc
            operadorR = this.operadorR;//Estos solo son valores comunes
            cadena += operadorL.codigo3D();
            cadena += operadorR.codigo3D();
            resultadoL = this.operadorL.parse(this.operadorR, tablaTipos);
            resultadoR = this.operadorR.parse(this.operadorL, tablaTipos);
        }
        //Operar
        //operacion = resultadoL + this.operador+resultadoR;

        let tName = tablaTipos.drawT();
        tablaTipos.addT();
        
        let etVerdadero = tablaTipos.drawEt();
        tablaTipos.addEt();
        let etFalso = tablaTipos.drawEt();
        tablaTipos.addEt();
        let etSalida = tablaTipos.drawEt();
        tablaTipos.addEt();

        cadena = tName+"= 0;\n";
        cadena += "if "+resultadoL+" > 0 goto "+etVerdadero+";\n";
        cadena += "goto "+etFalso+";\n";

        cadena += etVerdadero+":\n";
        cadena += tName +"= 1 ;\n";
        cadena += "goto "+etSalida+";\n";

        cadena += etFalso+":\n";
        cadena += "if "+resultadoR+" > 0 goto "+etVerdadero+";\n";
        cadena += "goto "+etSalida+";\n";
        
        cadena += etSalida+":\n";

        this.setNombre(tName);        
        this.setOperacionFinal(operacion);
        return cadena;
    }
}

module.exports = And;