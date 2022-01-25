var Instruccion = require('./Instruccion');

class Clase extends Instruccion{
    constructor(id, instrucciones, idExtension, visibilidad, linea, columna, lenguaje, ambito,paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.id = id;
        this.idExtension = idExtension;
        this.visibilidad = visibilidad;
        this.constructores = [];
        this.variables = [];
        this.idExtensionO = null;
        this.asignaciones = "";
    }

    getAsignaciones(){
        return this.asignaciones;
    }

    agregarAsignacion(texto){
        this.asignaciones += texto;
    }

    getIdExtensionO(){
        return this.idExtensionO;
    }

    esExtendible(){
        if(this.idExtensionO!=null){
            return true;
        }
        return false;
    }
    

    setClaseExtendida(tabla){
        if(this.idExtension!=null){
            if(this.idExtension != ""){
                this.idExtensionO = tabla.buscarClase(this.idExtension,this.paqueteria);
            }
        }        
    }

    generarNombre(){
        let cadena = "";
        let paquete = this.getPaqueteria();
        let nombreClase = this.id;
        cadena += paquete+"_";
        cadena += nombreClase+"_";
        return cadena;
    }

    getConstructores(){
        return this.constructores;
    }

    getVariables(){
        return this.variables;
    }

    pushConstructor(cons){
        this.constructores.push(cons);
    }

    

    mergeConstructors(){
        //Encontramos todo aquello que no sea un constructor
        let instrucciones = this.instrucciones;
        const Constructor = require('./Constructor');
        const Function = require('./Function');
        let variables = [];
        let constructores = [];
        for(let index = 0; index<instrucciones.length; index++){
            let instruccion = instrucciones[index];
            if(instruccion instanceof Constructor
                || instruccion instanceof Function){
                constructores.push(instruccion);
            }else{
                //SOn variables
                variables.push(instruccion);
            }
        }
        //Agregamos las instrucciones a los constructores
        for(let index=0; index<constructores.length; index++){
            let constructor = constructores[index];
            for(let indexV = 0; indexV< variables.length; indexV++){
                //Agregamos
                if(constructor instanceof Constructor){
                    let variable = variables[indexV];
                    constructor.unshiftInstruccion(variable);
                }
            }
        }
        this.constructores = constructores;
        this.variables = variables;
    }

    getId(){
        return this.id;
    }

    getIdExtension(){
        return this.idExtension;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

    getConstructor(parametros){
        const Entero = require('../operadores/Entero');
        const Decimal = require('../operadores/Decimal');
        const Caracter = require('../operadores/Caracter');
        const Cadena = require('../operadores/Cadena');
        const Booleano = require('../operadores/Booleano');
        const Objeto = require('../operadores/Object');
        const instruccionesApi = require('../InstruccionesApi').instruccionesApi;
        const TIPO_DATO = require('../Instrucciones').TIPO_DATO;
        let arreglo = [];
        console.log('GETTING CONSTRUCTOR');
/*        for(let index=0; index<parametros.length; index++){
            let parametro = parametros[index];
            if(parametro instanceof Booleano){
                arreglo.push(instruccionesApi.nuevoParametro(null, TIPO_DATO.BOOLEAN,false, null, 0,0));
            }else if(parametro instanceof Caracter){
                arreglo.push(instruccionesApi.nuevoParametro(null, TIPO_DATO.CHAR,false, null, 0,0));
            }else if(parametro instanceof Decimal){
                arreglo.push(instruccionesApi.nuevoParametro(null, TIPO_DATO.FLOAT,false, null, 0,0));
            }else if(parametro instanceof Entero){
                arreglo.push(instruccionesApi.nuevoParametro(null, TIPO_DATO.INT,false, null, 0,0));
            }else if(parametro instanceof Cadena){
                arreglo.push(instruccionesApi.nuevoParametro(null, TIPO_DATO.STRING,false, null, 0,0));
            }else if(parametro instanceof Objeto){
                arreglo.push(instruccionesApi.nuevoParametro(null, TIPO_DATO.ANY,false, null, 0,0));
            }   
        }*/
        
        let result = this.searchConstructor(parametros);

        return result;
    }

    searchConstructor(parametros){
        const Constructor = require('./Constructor');
        let instrucciones = this.instrucciones;
        let id = this.id;
        console.log('Buscando Constructor');
        for(let index=0; index<instrucciones.length; index++){
            let instruccion = instrucciones[index];
            if(instruccion instanceof Constructor){
                console.log('CONSTRUCTOR ENCONTRADO');
                if(instruccion.getId() == id){
                    let auxParams = instruccion.getParametros();
                    let result = this.compararParametros(parametros, auxParams);
                    if(result){
                        return instruccion;
                    }
                }
            }
        }

        return null;
    }

    compararParametros(parametrosL, parametrosR){
        console.log('COMPARANDO PARAMETROS');
        const Operador = require('../operadores/Operador');
        let operador = new Operador();
        if(parametrosL.length == parametrosR.length){
            for(let index=0; index<parametrosL.length; index++){
                //Son una instancia
                let paramL = parametrosL[index];
                //Son un objeto
                let paramR = operador.convertirParametro(parametrosR[index].tipo);
                if((paramL instanceof paramR) == false){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

}

module.exports = Clase;