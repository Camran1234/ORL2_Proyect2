var Instruccion = require('./Instruccion');

class Constructor extends Instruccion{

    constructor(id, visibilidad, instrucciones, parametros, linea, columna, lenguaje, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.id = id;
        this.visibilidad = visibilidad;
        this.parametros = parametros;
        this.nombre = null;
        this.parametrosO = parametros;
    }

    unshiftInstruccion(instruccion){
        this.instrucciones.unshift(instruccion);
    }

    getParametrosO(){
        return this.parametrosO;
    }

    setParametrosO(params){
        this.parametrosO = params;
    }

    generarTipos(){
        let parametros = this.parametros;
        let cadena = "";
        for(let index=0; index<parametros.length; index++){
            cadena += parametros[index].tipo;
            if(index!=parametros.length-1){
                cadena += '_';
            }
        }
        return cadena;
    }

    generarNombre(){
        let cadena = "";
        if(this.nombre!=null){
            return this.nombre;
        }else{
            let paquete = this.generarPaqueteria();
            let nombreClase = this.id;
            let tipos = this.generarTipos();
            cadena+= paquete + "_";
            cadena += nombreClase + "_";
            cadena += tipos+"_";
            this.nombre = cadena;
            return cadena;
        }
    }

    getId(){
        return this.id;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

    getParametros(){
        return this.parametros;
    }

}

module.exports = Constructor;