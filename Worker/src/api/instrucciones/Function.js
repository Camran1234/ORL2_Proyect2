var Instruccion = require('./Instruccion');
class Function extends Instruccion{

    constructor(visibilidad, id, tipo, instrucciones, parametros, lenguaje, linea, columna, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.visibilidad = visibilidad;
        this.id = id;
        this.tipo = tipo;
        this.parametros = parametros;
        this.nombre = null;
        this.parametrosO = parametros;
        //Posicion de memoria
        this.returnName = null;
        this.etSalida = "";
    }

    setEtSalida(et){
        this.etSalida = et;
    }

    getEtSalida(){
        return this.etSalida;
    }

    punteroParametro(index){
        try{
            let answer = this.parametros[index].puntero;
            return answer;
        }catch(ex){
            return false;
        }
    }

    generarReturnName(nombre){
        if(this.returnName == null){
            this.returnName = nombre;
            return nombre;
        }else{
            //posMemoria
            return this.returnName;
        }
    }

    getReturnName(){
        return this.returnName;
    }

    getParametrosO(){
        return this.parametrosO;
    }

    setParametrosO(params){
        this.parametrosO = params;
    }

    

    getParametros(){
        return this.parametros;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

    getId(){
        return this.id;
    }

    getTipo(){
        return this.tipo;
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
        try {
            if(this.nombre!=null){
                return this.nombre;
            }else{
                let cadena = "";
                let paquete = this.generarPaqueteria();
                let ambito = this.ambitoEnClase();
                let tipoF = this.tipo;
                let nombre = this.id;
                let tipos = this.generarTipos();
                if(ambito !=null){
                    let clase = ambito.getId();
                    cadena += paquete+"_";
                    cadena += clase+"_";
                    cadena += nombre+"_";
                    cadena += tipoF+"_";
                    cadena += tipos;
                    this.nombre = cadena;
                    return cadena;
                }else{
                    cadena += paquete+"_";
                    cadena += nombre+"_";
                    cadena += tipoF+"_";
                    cadena += tipos+"_";
                    this.nombre = cadena;
                    return cadena;
                }
            }   
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Function;