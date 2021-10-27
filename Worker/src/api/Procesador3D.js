
const Operacion = require('../api/operadores/Operador');
const Object = require('../api/operadores/Object');
const Entero = require('../api/operadores/Entero');
const Decimal = require('../api/operadores/Decimal');
const Caracter = require('../api/operadores/Caracter');
const Cadena = require('../api/operadores/Cadena');
const Booleano = require('../api/operadores/Booleano');
class Procesador3D{

    constructor(){
        this.nombre = "";
    }

    getNombre(){
        return this.nombre;
    }

    procesarParametrosArr(tabla, parametros, instruccion){
        let cadena = "";
        let formulaSize = parametros.length;
        let coord = [];
        let dims = [];
        //Coordenadas
        for(let index=0; index< parametros.length; index++){
            let par = parametros[index];
            if(par instanceof Operacion){
                cadena += par.generarExpresion(tabla, instruccion);
                let nombre = par.getNombre();
                coord.push(nombre);
            }else if(par instanceof Object){
                try{
                cadena += par.codigo3D(tabla);
                let nombre = par.parse(null, null);
                coord.push(nombre);
                }catch(error){
                    console.log(error);
                }
            }            
        }
        //Dimensiones
        let dimensionesP = instruccion.getMagnitudO();
        for(let index=0; index<dimensionesP.length; index++){
            let dim = dimensionesP[index];
            if(dim instanceof Operacion){
                cadena += dim.generarExpresion(tabla, instruccion);
                let nombre = dim.getNombre();
                dims.push(nombre);
            }else if(dim instanceof Object){
                try{
                    cadena += dim.codigo3D(tabla);
                    let nombre = dim.parse(null,null);
                    dims.push(nombre);
                }catch(error){
                    console.log(error);
                }
            }
        }
        cadena += this.generar_Direccion(formulaSize, formulaSize, coord, dims,tabla);
        return cadena;
    }

    generar_Direccion(originalSize, size, coord, dims, tabla){
        let cadena="";
        if(size!=0){
            let estructura= "";
            let newCoord = coord[originalSize-size];
            let t = newCoord;
            for(let index=(originalSize-size)+1; index<originalSize; index++){
                estructura += tabla.drawT() + " = "+t+" * "+dims[index]+";\n";
                t = tabla.drawT()
                tabla.addT();
            }
            cadena += estructura;
            if(size!=1){
                cadena += this.generar_Direccion(originalSize, size-1, coord, dims, tabla);
                cadena += tabla.drawT() + " = "+t +" + "+this.nombre+";\n";        
                t = tabla.drawT();
                tabla.addT();        
            }
            this.nombre = t;            
        }
        return cadena;
    }

}

module.exports = Procesador3D;