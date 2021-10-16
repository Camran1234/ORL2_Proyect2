
const TIPO = {
    DIRECTORIO = 'DIRECTORIO',
    ARCHIVO = 'ARCHIVO'
}

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
        this.proyectos=this.initProyectos();
        this.proyectoActual = null;
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

module.exports = SafeProyecto;