
const TablaTipos = require('../TablaTipos');
var Instruccion = require('./Instruccion');
var Variable = require('./Variable');

class Declaracion extends Instruccion{

    constructor(visibilidad, id, magnitud, tipo, lenguaje, linea, columna, ambito, paqueteria){
        super( linea, columna, lenguaje, ambito, paqueteria, null);
        this.visibilidad = visibilidad;
        this.id = id;
        this.magnitud = magnitud;
        this.tipo = tipo;
        this.asignado = 0;
        this.magnitudO = [];
        this.esArreglo = false;
        this.puntero = false;
    }

    printScan(){
        const Entero = require('../operadores/Entero');
        const Decimal = require('../operadores/Decimal');
        const Caracter = require('../operadores/Caracter');
        const Any = require('../operadores/Any');
        if(this.tipo == "ENTERO"
        || this.tipo instanceof Entero){
            return "\"%d\"";
        }else if(this.tipo == "DECIMAL"
        || this.tipo instanceof Decimal){
            return "\"%f\"";
        }else if(this.tipo == "CARACTER"
        || this.tipo == "ANY"
        || this.tipo instanceof Caracter
        || this.tipo instanceof Any){
            return "\"%c\"";
        }
    }

    agregarPuntero(){
        if(this.puntero){
            return "*";
        }
        return "";
    }

    prexTName(){
        let name = this.getTName();
        name = "$$->"+name;
        this.tName = name;
    }

    escribirDeclaracion(tabla){
        let cadena = "";
        if(this.tipo == "ENTERO"){
            cadena += "int "+this.agregarPuntero()+tabla.drawT();
        }else if(this.tipo == "DECIMAL"){
            cadena += "float "+this.agregarPuntero()+tabla.drawT();
        }else if(this.tipo == "CARACTER"){
            cadena += "char "+this.agregarPuntero()+tabla.drawT();
        }else if(this.tipo == "CADENA"){
            cadena += "char * "+this.agregarPuntero()+tabla.drawT();
        }else if(this.tipo == "BOOLEAN"){
            cadena += "int "+this.agregarPuntero()+tabla.drawT();
        }else if(this.tipo == "ANY"){
            cadena += "struct Var "+tabla.drawT();
        }
        tabla.inscribirT();
        this.setTName(tabla.drawT());
        tabla.addT();
        return cadena;
    }

    inscribir(tabla){
        if(this.tipo == 'ENTERO'){
            tabla.actualTInt(this.id);
        }else if(this.tipo == 'DECIMAL'){
            tabla.actualTFloat(this.id);
        }else if(this.tipo == 'CARACTER'){
            tabla.actualTChar(this.id);
        }else if(this.tipo == 'CADENA'){
            tabla.actualTCadena(this.id);
        }else if(this.tipo == 'BOOLEAN'){
            tabla.actualTInt(this.id);
        }else if (this.tipo == 'ANY'
        || this.tipo == 'VOID'){
            tabla.actualTVoid(this.id);
        }
    }

    getVariableReferencia(){
        return this;
    }

    setPuntero(puntero){
        this.puntero = puntero;
    }

    getPuntero(){
        return this.puntero;
    }

    isArray(){
        return this.esArreglo;
    }

    setMagnitudO(magnitud){
        this.magnitudO = magnitud;
        if(magnitud.length>0){
            this.esArreglo = true;
        }
    }

    getMagnitudO(){
        return this.magnitudO;
    }

    addAsignacion(){
        if(this.asignado >= 1){
            return false;
        }
        this.asignado++;
        return true;
    }

    getCompilerType(){
        if(this.tipo == 'ENTERO'){
            return 'int';
        }else if(this.tipo == "DECIMAL"){
            return 'float';
        }else if(this.tipo == 'CARACTER'){
            return 'char';
        }else if(this.tipo == 'CADENA'){
            return 'char *';
        }else if(this.tipo == 'BOOLEAN'){
            return 'int ';
        }else if(this.tipo == 'VOID'){
            return 'void *';
        }else if(this.tipo == 'ANY'){
            return 'void *';
        }
    }

    setTipo(tipo){
        this.tipo = tipo;
    }

    getVisibilidad(){
        return this.visibilidad;
    }

    getId(){
        return this.id;
    }

    getMagnitud(){
        return this.magnitud;
    }

    getTipo(){
        return this.tipo;
    }

}

module.exports = Declaracion;