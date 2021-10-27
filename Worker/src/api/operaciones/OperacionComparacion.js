var Operacion = require('./Operacion');

class OperacionComparacion extends Operacion {

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
            resultadoR = this.operadorL.getNombre();
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
    
        let tNombre = tablaTipos.drawT();
        tablaTipos.drawT();
        let etSalida = tablaTipos.drawEt();        
        tablaTipos.addEt();

        cadena += "if "+operacion +" goto "+tablaTipos.drawEt()+";\n"
        let etTrue= tablaTipos.drawEt();
        tablaTipos.addEt();
        cadena += "goto "+tablaTipos.drawEt()+";\n";
        let etFalse = tablaTipos.drawEt();
        tablaTipos.addEt();
        //t1 = 1
        cadena += etTrue+":\n";
        cadena += tNombre+" = 1;\n";
        cadena += "goto "+etSalida+";\n";

        //t1 = 0
        cadena += etFalse+":\n";
        cadena += tNombre+" = 0;\n";
        cadena += "goto "+etSalida+";\n";

        this.setNombre(tNombre);
        this.setOperacionFinal(operacion);
        return cadena;
    }
    //Ejemplo comparacion
    /*
        
        if(2 == 4){
            r = 4
        }else{

        }

        //Inicio expresion 2 == 4
        if(2 == 4) goto et1 (verdadero)
        goto et2
        et1:
        t1 = 1 //This.nombre
        goto et3
        et2:(false)
        t1 = 0 // this.nombre
        goto et3
        ............Fin expresion 2 == 4

        et3:
        ..........Nombre del resultado de la variable

        //Evaluacion final
        if(t1 > 0)  goto et4
        goto et5
        et4:

        goto et0
        et5: (else)

        goto et0
        //Fin evaluacion
    */ 

}

module.exports = OperacionComparacion;