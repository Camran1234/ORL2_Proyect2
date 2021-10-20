class Tipo{

    constructor(visibilidad, id, tipo, ambito, posMemoria, longitud, esArreglo, rol, paquete, instruccion){
        this.visibilidad = visibilidad;
        this.id = id;
        this.tipo = tipo;
        //esto es el scope
        this.ambito = ambito;
        this.posMemoria = posMemoria;
        this.longitud = longitud;
        this.esArreglo = esArreglo;
        this.rol = rol;
        //Ignoraremos el paquete y nos concentraremos en el scope
        this.paquete = paquete;
        //Instruccion del objeto que hace referencia
        this.instruccion = instruccion;
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

    getAmbito(){
        return this.ambito;
    }

    getPosMemoria(){
        return this.posMemoria;
    }

    getLongitud(){
        return this.longitud;
    }

    getEsArreglo(){
        return this.esArreglo
    }

    getRol(){
        return this.rol;
    }

    getPaquete(){
        return this.paquete;
    }

    getJSON(){
        return {
            visibilidad:visibilidad,
            id: id,
            tipo: tipo,
            posMemoria: posMemoria,
            ambito:ambito,
            longitud:longitud,
            esArreglo:esArreglo,
            rol:rol,
            paquete:paquete
        }
    }



}

module.exports = Tipo;