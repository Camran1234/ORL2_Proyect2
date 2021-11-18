const Cadena = require('../operadores/Cadena');
var Operacion = require('./Operacion');

class OperacionAritmetica extends Operacion {

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
            if(operadorL.getTipo() instanceof Cadena || operadorR.getTipo() instanceof Cadena){
                //Strings

                if ((operadorL.getTipo() instanceof Cadena)==false){
                    //number to string
                    let helper = resultadoL.split("");
                    if(helper[0]=="t"){
                        resultadoL = "(*((float *)"+resultadoL+"))";
                    }
                    resultadoL = "convertNumber_String("+resultadoL+")";
                }else{
                    if(helper[0]=="t"){
                        resultadoL = "*((char **)"+resultadoL+")";
                    }
                }
                //,.........
                if ((operadorR.getTipo() instanceof Cadena)==false){
                    //number to string
                    let helper = resultadoR.split("");
                    if(helper[0]=="t"){
                        resultadoR = "(*((float *)"+resultadoR+"))";
                    }
                    resultadoR = "convertNumber_String("+resultadoR+")";
                }else{
                    //Es cadena
                    if(helper[0]=="t"){
                        resultadoR = "*((char **)"+resultadoL+")";
                    }
                }
                operacion = "concat("+resultadoL+", "+resultadoR+")";
                cadena += "char *"+tablaTipos.drawS() +" = "+operacion+";\n";
                this.setNombre(tablaTipos.drawS());
                tablaTipos.addS();
                this.setOperacionFinal(operacion);
            }else{
                let helper = resultadoL.split("");
                if(helper[0]=="t"){
                    resultadoL = "(*((float *)"+resultadoL+"))";
                }
                helper = resultadoR.split("");
                if(helper[0]=="t"){
                    resultadoR = "(*((float *)"+resultadoR+"))";
                }
                //Son numeros
                operacion = resultadoL + this.operador + resultadoR;
                cadena += tablaTipos.drawT() + " = "+operacion+";\n";
                this.setNombre(tablaTipos.drawT());
                tablaTipos.addT();
                this.setOperacionFinal(operacion);
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