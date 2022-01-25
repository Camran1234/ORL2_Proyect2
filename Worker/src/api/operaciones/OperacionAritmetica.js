const Booleano = require('../operadores/Booleano');
const Cadena = require('../operadores/Cadena');
const Decimal = require('../operadores/Decimal');
const ParametroHelper = require('../../safe/ParametroHelper');
var Operacion = require('./Operacion');
const Caracter = require('../operadores/Caracter');
const Any = require('../operadores/Any');

class OperacionAritmetica extends Operacion {

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

    generarExpresion( tablaTipos, instruccion){
        let cadena = "";
        let operadorL = null;
        let operadorR = null;
        let resultadoL = "";
        let resultadoR = "";
        let operacion = "";
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
            cadena += operadorR.codigo3D(tablaTipos);
            resultadoL = this.operadorL.getNombre();
            resultadoR = this.operadorR.parse(this.operadorL.getTipo(), tablaTipos);
        }else if(!(this.operadorL instanceof Operacion) && this.operadorR instanceof Operacion){
            operadorL = this.operadorL;
            cadena += operadorL.codigo3D(tablaTipos);
            operadorR = this.operadorR.generarExpresion( tablaTipos, instruccion);
            cadena += operadorR;
            resultadoL = this.operadorL.parse(this.operadorR.getTipo(), tablaTipos);
            resultadoR = this.operadorR.getNombre();
        }else if(!(this.operadorL instanceof Operacion) && !(this.operadorR instanceof Operacion)){
            operadorL = this.operadorL;// Valor comun puede ser una instancia BOoleano, Entero, etc
            operadorR = this.operadorR;//Estos solo son valores comunes
            cadena += operadorL.codigo3D(tablaTipos);
            cadena += operadorR.codigo3D(tablaTipos);
            resultadoL = this.operadorL.parse(this.operadorR, tablaTipos);
            resultadoR = this.operadorR.parse(this.operadorL, tablaTipos);
        }
        //Operar
        operacion = resultadoL + this.operador+resultadoR;
        
        if(tablaTipos.isCompiler()){
            //Do something
            if(operadorL.getTipo() instanceof Cadena && operadorR.getTipo() instanceof Cadena()
            || operadorL.getTipo() == Cadena && operadorR.getTipo() == Cadena()){
                cadena += "char *"+tablaTipos.drawT()+";\n";
                operacion = "concat("+resultadoL+", "+resultadoR+")";
                cadena += tablaTipos.drawT() + " = "+operacion+";\n";
                this.setNombre(tablaTipos.drawT());
                this.setOperacionFinal(operacion);
                tablaTipos.inscribirT();
                tablaTipos.addT();
            }else if(!(operadorL.getTipo() instanceof Cadena) && operadorR.getTipo() instanceof Cadena
            || !(operadorL.getTipo() == Cadena) && operadorR.getTipo() == Cadena){
                let nombre = resultadoL;
                
                if(operadorL.getTipo() instanceof Any
                || operadorL.getTipo() == "ANY"
                || operadorL.getTipo() == Any){ 
                    let aux = "*((unsigned int *)"+nombre+".puntero)";
                    let auxType = nombre+".type"
                    if(operadorL instanceof Operacion){
                        aux = nombre;
                        auxType = 4;
                    }
                    tablaTipos.agregarTexto("char *"+tablaTipos.drawT()+";\n");
                    cadena += "if ("+auxType+" == 0){\n";
                    cadena += tablaTipos.drawT()+" = concat(convertInt_String("+aux+"), "+resultadoR+");\n";
                    cadena += "}else if("+auxType+" == 1){\n";
                    cadena += tablaTipos.drawT() + " = concat(convertFloat_String("+aux+"), "+resultadoR+");\n";
                    cadena += "}else if("+auxType+" == 2){\n";
                    cadena += tablaTipos.drawT() + " = concat(convertChar_String("+aux+"), "+resultadoR+");\n";
                    cadena += "}else if("+auxType+" == 3){\n";
                    cadena += tablaTipos.drawT() + " = concat("+aux+", "+resultadoR+");\n";
                    cadena += "} else{\n";
                    cadena += tablaTipos.drawT() + " = concat("+aux+", "+resultadoR+");\n";
                    cadena += "}\n";
                    operacion = tablaTipos.drawT()+" = concat("+aux+", "+resultadoR+");\n";
                }else if(operadorL.getTipo() instanceof Caracter
                || operadorL.getTipo() == "CARACTER"
                || operadorL.getTipo() == Caracter){
                    tablaTipos.agregarTexto("char *"+tablaTipos.drawT()+";\n");
                    resultadoL = "convertChar_String("+resultadoL+")";
                    operacion = "concat("+resultadoL+", "+resultadoR+")";
                    cadena += tablaTipos.drawT()+" = "+operacion+";\n";
                }else if(operadorL.getTipo() instanceof Booleano || operadorL.getTipo() instanceof Entero
                || operadorL.getTipo() == "BOOLEAN"
                || operadorL.getTipo() == "ENTERO"
                || operadorL.getTipo() == Booleano
                || operadorL.getTipo() == Entero){
                    tablaTipos.agregarTexto("char *"+tablaTipos.drawT()+ ";\n");
                    resultadoL = "convertInt_String("+resultadoL+")";
                    operacion = "concat("+resultadoL+", "+resultadoR+")";
                    cadena += tablaTipos.drawT() + " = "+operacion + ";\n";
                }else if(operadorL.getTipo() instanceof Decimal
                || operadorL.getTipo() == Decimal
                || operadorL.getTipo() == 'DECIMAL'){
                    tablaTipos.agregarTexto("char *"+tablaTipos.drawT()+";\n");
                    resultadoL = "convertFloat_String("+resultadoL+")";
                    operacion = "concat("+resultadoL+", "+resultadoR+")";
                    cadena += tablaTipos.drawT() + " = "+operacion+ ";\n";
                }

                this.setNombre(tablaTipos.drawT());
                this.setOperacionFinal(operacion);
                tablaTipos.inscribirT();
                tablaTipos.addT();
            }else if(operadorL.getTipo() instanceof Cadena && !(operadorR.getTipo() instanceof Cadena)
            || operadorL.getTipo() == Cadena && !(operadorR.getTipo() == Cadena)){
                let nombre = resultadoR;
                
                if(operadorR.getTipo() instanceof Any
                || operadorR.getTipo() == "ANY"
                || operadorR.getTipo() == Any){ 
                    let aux = "*((unsigned int *)"+nombre+".puntero)";
                    let auxType = nombre+".type"
                    if(operadorR instanceof Operacion){
                        aux = nombre;
                        auxType = 4;
                    }
                    tablaTipos.agregarTexto("char *"+tablaTipos.drawT()+";\n");
                    cadena += "if ("+auxType+" == 0){\n";
                    cadena += tablaTipos.drawT()+" = concat("+resultadoL+", convertInt_String("+aux+"));\n";
                    cadena += "}else if("+auxType+" == 1){\n";
                    cadena += tablaTipos.drawT()+" = concat("+resultadoL+", convertFloat_String("+aux+"));\n";
                    cadena += "}else if("+auxType+" == 2){\n";
                    cadena += tablaTipos.drawT()+" = concat("+resultadoL+", convertChar_String("+aux+"));\n";
                    cadena += "}else if("+auxType+" == 3){\n";
                    cadena += tablaTipos.drawT() + " = concat("+resultadoL+", "+aux+");\n";
                    cadena += "} else{\n";
                    cadena += tablaTipos.drawT() + " = concat("+resultadoL+", "+aux+");\n";
                    cadena += "}\n";
                    cadena += tablaTipos.drawT() + " = concat("+resultadoL+", "+aux+");\n";
                }else if(operadorR.getTipo() instanceof Caracter
                || operadorR.getTipo() == "CARACTER"
                || operadorR.getTipo() == Caracter){
                    tablaTipos.agregarTexto("char *"+tablaTipos.drawT()+";\n");
                    resultadoR = "convertChar_String("+resultadoR+")";
                    operacion = "concat("+resultadoL+", "+resultadoR+")";
                    cadena += tablaTipos.drawT()+" = "+operacion+";\n";
                }else if(operadorR.getTipo() instanceof Booleano || operadorR.getTipo() instanceof Entero
                || operadorR.getTipo() == "BOOLEAN"
                || operadorR.getTipo() == "ENTERO"
                || operadorR.getTipo() == Booleano
                || operadorR.getTipo() == Entero){
                    tablaTipos.agregarTexto("char *"+tablaTipos.drawT()+ ";\n");
                    resultadoR = "convertInt_String("+resultadoR+")";
                    operacion = "concat("+resultadoL+", "+resultadoR+")";
                    cadena += tablaTipos.drawT() + " = "+operacion + ";\n";
                }else if(operadorR.getTipo() instanceof Decimal
                || operadorR.getTipo() == "DECIMAL"
                || operadorR.getTipo() == Decimal){
                    tablaTipos.agregarTexto("char *"+tablaTipos.drawT()+";\n");
                    resultadoR = "convertFloat_String("+resultadoR+")";
                    operacion = "concat("+resultadoL+", "+resultadoR+")";
                    cadena += tablaTipos.drawT() + " = "+operacion+ ";\n";
                }

                this.setNombre(tablaTipos.drawT());
                this.setOperacionFinal(operacion);
                tablaTipos.inscribirT();
                tablaTipos.addT();
            }else if(!(operadorL.getTipo() instanceof Cadena) && !(operadorR.getTipo() instanceof Cadena)
            ||!(operadorL.getTipo() == Cadena) && !(operadorR.getTipo() == Cadena)){
                let parametroHelper = new ParametroHelper();
                cadena += parametroHelper.stablishCuarteto(operadorL, resultadoL);
                resultadoL = parametroHelper.getResultado();
                cadena += parametroHelper.stablishCuarteto(operadorR, resultadoR);
                resultadoR = parametroHelper.getResultado();
                tablaTipos.agregarTexto("int "+tablaTipos.drawT()+";\n");
                operacion = resultadoL + this.operador + resultadoR;
                cadena += tablaTipos.drawT() + " = "+operacion+";\n";
                this.setNombre(tablaTipos.drawT());
                this.setOperacionFinal(operacion);
                tablaTipos.inscribirT();
                tablaTipos.addT();
            }
            
        }else{
            cadena += tablaTipos.drawT()+" = "+operacion +";\n";
            this.setNombre(tablaTipos.drawT());
            tablaTipos.addT();
            this.setOperacionFinal(operacion);
        }
        return cadena;
    }    

}

module.exports = OperacionAritmetica;