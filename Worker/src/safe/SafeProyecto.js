
const TIPO = require('../api/Instrucciones').TIPO;

function initProyectos(){
    return {
        proyectos:[]
    }
}

function mkProyecto(nombre){
    return {
        nombre:nombre,
        src:this.mkDir("src")
    }
}

function mkDir(nombre){
    return {
        rol: TIPO.DIRECTORIO,
        nombre:nombre,
        carpetas:[],
        archivos:[]

    }
}

function mkFile(nombre, codigo){
    return {
        rol: TIPO.ARCHIVO,
        nombre:nombre,
        codigo:codigo
    }
}

function arregloPop(arreglo){
    let array=[];
    for(let index=0; index<arreglo.length; index++){
        array.push(arreglo[index]);
    }
    return array;
}

function transformarArreglo(arreglo){
    let array=[];
    if(arreglo!=null){
        for(let index=0; index<arreglo.length; index++){
            array.push(arreglo[index]);
        }
    }
    return array;
}

function enrutar(direccion, carpeta){
    let resultado = carpeta;
    if(direccion.length>0){
        //obtenemos las carpetas y la carpeta que atravesaremos
        let carpetas = carpeta.carpetas;
        let nombreCarpeta = direccion[0];
        let flag = false;
        //buscamos dentro de todas sus carpetas        
        for(let index=0; index<carpetas.length; index++){
            if(carpetas[index].nombre == nombreCarpeta){
                resultado = enrutar(arregloPop(direccion), carpetas[index]);
                flag=true;
                break;
            }
        }
        if(!flag){
            let newCarpeta = mkDir(nombreCarpeta);
            carpetas.push(newCarpeta);
            resultado = enrutar(arregloPop(direccion),newCarpeta);
        }
    }
    return resultado;
}

function introducirArchivo(archivo,dirPaquete, proyecto){
    try{
        //Obtenemos la carpeta source
        let src = proyecto.paquetes[0];
        let direccion = transformarArreglo(dirPaquete.split("."));
        let carpeta = enrutar(direccion, src);
        carpeta.archivos.push(archivo);
    }catch(ex){
        //Carpeta no encontrada
        console.log(ex);
    }
}


class SafeProyecto{

    constructor(){
        this.proyectos= initProyectos();
        this.proyectoActual = null;
        this.xmlFiles = "../../xmlFile.dat"
        this.actualDir = "";
        this.createDirectory(this.dirFiles);
    }

    createDirectory(dir){
        let fs = require('fs');

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }

    createFile(dir){
        let fs = require('fs');
        fs.open(dir, function (err, file) {
            if (err) throw err;
            console.log('Saved!');
          });
    }

    readFile(dir){
        let fs = require('fs');
        let result = "";
        fs.readFile((dir), (err, data) => {
            if (err) throw err;
            return data.toString();
        });
    }

    updateFile(dir, content){
        let fs = require('fs');

        fs.writeFile(dir, content, function (err) {
            if (err) throw err;
            console.log('Replaced!');
        });
    }

    deleteFile(dir){
        let fs = require('fs');
        fs.unlink(dir, function (err) {
            if (err) throw err;
            console.log('File deleted!');
          }); 
    }

    nuevoProyecto(nombre){
        let proyecto = this.mkProyecto(nombre);
        this.proyectos.push(proyecto);
        this.proyectoActual = proyecto;
    }

    nuevoArchivo(nombre, dirPaquete, codigo){
        let archivo = this.mkFile(nombre, codigo);
        this.introducirArchivo(archivo, dirPaquete, this.proyectoActual);
    }

    abirArchivo(dirPaquete, nombre){

    }

    abrirProyecto(nombre){
        let proyectos = this.proyectos.proyectos;
        for(let index=0; index<proyectos.length; index++){
            if(proyectos[index].nombre == nombre){
                this.proyectoActual = proyectos[index];
            }
        }
    }

    cerrarProyecto(){
        this.proyectoActual = null;
    }
}

//let safe = new SafeProyecto();

module.exports = SafeProyecto;