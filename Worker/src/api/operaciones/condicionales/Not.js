var OperacionCondicional = require('../OperacionCondicional');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Caracter = require('../../operadores/Caracter');
const Decimal = require('../../operadores/Decimal');
const Entero = require('../../operadores/Entero');
const Number = require('../../operadores/Number');
const Any = require('../../operadores/Any');
const ErrorSemantico = require('../../../error/SemanticError');
const  TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;
const ParametroHelper = require('../../../safe/ParametroHelper');
class Negativo extends OperacionCondicional {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
    }

    tipo_int(){
        return super.tipo_int();
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

        if(tablaTipos.isCompiler()){
            let parametroHelper = new ParametroHelper();
            cadena += parametroHelper.stablishCuarteto(operadorL, resultadoL);
            resultadoL = parametroHelper.getResultado();
            //Operar
            operacion = this.operador+resultadoL;

            let tName = tablaTipos.drawT();
            tablaTipos.addT();
            let etVer = tablaTipos.drawEt();
            tablaTipos.addEt();
            let etFalsa = tablaTipos.drawEt();
            tablaTipos.addEt();
            let etSalida = tablaTipos.drawEt();
            tablaTipos.addEt();

            cadena += "if ("+resultadoL+" > 0) goto "+etVer+";\n";
            cadena += "goto "+etFalsa+";\n";
            
            cadena += etVer+":\n"; // verdadero
            cadena += tName+ " = 0 \n" ;
            cadena += "goto "+etSalida+";\n";

            cadena += etFalsa+":\n";
            cadena += tName + " = 1\n";
            cadena += "goto "+etSalida+";\n";

            cadena += etSalida+":\n";

            this.setNombre(tName);
            this.setOperacionFinal(operacion);
        }else{
            //Operar
            operacion = this.operador+resultadoL;

            let tName = tablaTipos.drawT();
            tablaTipos.addT();
            let etVer = tablaTipos.drawEt();
            tablaTipos.addEt();
            let etFalsa = tablaTipos.drawEt();
            tablaTipos.addEt();
            let etSalida = tablaTipos.drawEt();
            tablaTipos.addEt();

            cadena += "if ("+resultadoL+" > 0) goto "+etVer+";\n";
            cadena += "goto "+etFalsa+";\n";
            
            cadena += etVer+":\n"; // verdadero
            cadena += tName+ " = 0 \n" ;
            cadena += "goto "+etSalida+";\n";

            cadena += etFalsa+":\n";
            cadena += tName + " = 1\n";
            cadena += "goto "+etSalida+";\n";

            cadena += etSalida+":\n";

            this.setNombre(tName);
            this.setOperacionFinal(operacion);
        }
        return cadena;
    }

    operar(errores){
        //Condicion de operacion
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(this.operadorL instanceof Booleano){
                return new Booleano("", this.linea, this.columna, this.lenguaje);
            }else{
                errores.push(new ErrorSemantico("Los operadores no son compatibles, booleanos unicamente", "!", this.linea, this.columna));
            }
        }else{
            if(this.operadorL instanceof Number){
                let answer = new Entero("", this.linea, this.columna, this.lenguaje);
                this.tipo = answer;
                return answer;
            }else if(this.operadorL instanceof Any ){
                this.tipo = this.operadorL;
                return this.operadorL;
            }else{
                errores.push(new ErrorSemantico("Los operadores no son compatibles, unicamente se permiten numericos", "!", this.linea, this.columna));
            }
        }
        return null;
    }

}

module.exports = Negativo;