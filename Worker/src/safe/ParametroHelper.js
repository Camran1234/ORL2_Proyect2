const Operacion = require("../api/operaciones/Operacion");
const Any = require("../api/operadores/Any");
const Booleano = require("../api/operadores/Booleano");
const Cadena = require("../api/operadores/Cadena");
const Caracter = require("../api/operadores/Caracter");
const Decimal = require("../api/operadores/Decimal");
const Entero = require("../api/operadores/Entero");


class ParametroHelper{

    constructor(){
        this.nombre = null;
        this.resultado = "";
    }

    getResultado(){
        return this.resultado;
    }


    stablishComparacion(operador, resultado, operacion){
        let cadena = "";
        if(operacion == "=="){

        }else if(operacion == "!="){

        }else if(operacion == ">="){

        }else if(operacion == "<="){

        }else if(operacion == ">"){

        }else if(operacion == "<"){
            
        }
        return cadena;
    }

    stablishCuarteto(operador, resultado){
        let cadena = "";
        let aux = "";
        if(operador.getTipo() instanceof Any
        || operador.getTipo() == Any){
            if(operador instanceof Operacion){
                this.resultado = resultado;
            }else{
                aux = "*((unsigned int*)"+resultado+".puntero)";
                this.resultado = aux;
            }
        }else{
            //literal
            this.resultado = resultado;
        }
        return cadena;
    }

    createVoidParam(variableInstruccion, parametro, tabla){
        let cadena ="";  
        if(variableInstruccion.getPuntero()){
            this.setNombre(parametro.getNombre());
        }else{
            if(parametro.getTipo() == "CARACTER"        
            ||parametro.getTipo() instanceof Caracter
            || parametro.getTipo() == Caracter){        
                cadena += "char "+tabla.drawT()+" = "+parametro.getNombre()+";\n"; 
            }else if(parametro.getTipo() == "BOOLEAN"        
            || parametro.getTipo() instanceof Booleano
            || parametro.getTipo() == Booleano){        
                cadena += "int "+tabla.drawT() + " = "+parametro.getNombre()+";\n";        
            }else if(parametro.getTipo() == "ENTERO"        
            || parametro.getTipo() instanceof Entero
            || parametro.getTipo() == Entero){        
                cadena += "int "+tabla.drawT() + " = "+parametro.getNombre()+";\n";        
            }else if(parametro.getTipo() == "DECIMAL"        
            || parametro.getTipo() instanceof Decimal
            || parametro.getTipo() == Decimal){        
                cadena += "float "+tabla.drawT() + " = "+parametro.getNombre()+";\n";        
            }else if(parametro.getTipo() == "CADENA"        
            || parametro.getTipo() instanceof Cadena
            || parametro.getTipo() == Cadena){        
                cadena += "char * "+tabla.drawT() + " = "+parametro.getNombre()+";\n";        
            }        
            this.setNombre(tabla.drawT());
            tabla.inscribirT();        
            tabla.addT();  
        }                                 
        return cadena;
    }

    getNombre(){
        return this.nombre;
    }

    setNombre(nombre){
        this.nombre = nombre;
    }
    
}

module.exports = ParametroHelper;