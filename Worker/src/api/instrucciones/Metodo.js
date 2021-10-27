var Instruccion = require('./Instruccion');

class Metodo extends Instruccion{

    constructor(id, parametros, linea, columna, lenguaje, ambito, paqueteria, instrucciones, funcionReferencia){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones)
        this.id = id;
        this.parametros = parametros;
        this.funcionReferencia = funcionReferencia;
        this.variableReferencia = null;//Variable de java especificamente
        this.parametrosO = null;
    }

    getParametrosO(){
        return this.parametrosO;
    }

    setParametrosO(params){
        this.parametrosO = params;
    }

    setVariableReferencia(variable){
        this.variableReferencia = variable;
    }

    getVariableReferencia(){
        return this.variableReferencia;
    }

    setParametros(parametros){
        this.parametros = parametros;
    }

    setFuncionReferencia(funcion){
        this.funcionReferencia = funcion;
    }

    //Es la tabla de tipos y el TIPO de funcion que hace referencia
    /*
        Usar esta clase para funciones que no posean heap

        funcion(x){
            x = 4;
            printf(x);
        }

        int a = 0; // pos = 0
        int b = 0; // pos = 1
        int c = 0; // pos = 2
        int d = 0; // pos = 3
        int e = 0; // pos = 4
        int f = 0; // pos = 5

        pasos llamada de metodo:
        //Calculo de parametros
        //Movimiento temporal de la pila
        //Llamada a la funcion
        //Desmovimiento temporal de la pila
        
    */
    calcularParametrosO(tablaTipos, funcion){
        let cadena = " ";
        let parametrosO = this.funcionReferencia.getParametrosO();
        for(let index=0; index<parametrosO.length; index++){
            
        }
        return cadena;
    }

    calcularParametrosOC(tablaTipos, funcion){
        
    }

    setId(id){
        this.id = id;
    }

    getParametros(){
        return this.parametros;
    }

    getFuncionReferencia(){
        return this.funcionReferencia;
    }

    getId(){
        return this.id;
    }

}

module.exports = Metodo;