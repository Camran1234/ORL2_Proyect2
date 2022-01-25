var Instruccion = require('./Instruccion');

class Retornar extends Instruccion{

    constructor(valor, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones)
        this.valor = valor;
    }

    getValor(){
        return this.valor;
    }

    escribirDeclaracion(funcion, tabla){
        if(!funcion.hasReturnName()){
            let tipo = funcion.getTipo();
            let cadena = "";    
            if(tipo == "ENTERO"){
                cadena += "int "+tabla.drawT()+";\n";
            }else if(tipo == "DECIMAL"){
                cadena += "float "+tabla.drawT()+";\n"; 
            }else if(tipo == "CARACTER"){
                cadena += "char "+tabla.drawT()+";\n";
            }else if(tipo == "CADENA"){
                cadena += "char * "+tabla.drawT()+";\n";
            }else if(tipo == "BOOLEAN"){
                cadena += "int "+tabla.drawT()+";\n";
            }else if(tipo == "ANY"){
                cadena += "struct Var "+tabla.drawT()+";\n";
            }
            tabla.inscribirT();
            funcion.generarReturnName(tabla.drawT());
            tabla.addT();
            tabla.agregarTexto(cadena);
        }
    }

    isFromMain(){
        let ambit = this.ambitoEnMain();
        if (ambit !=null){
            return true;
        }
        return false;
    }

}

module.exports = Retornar;