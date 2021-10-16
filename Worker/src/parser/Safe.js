function safeFile(paqueteria, codigo){
    return{
        paqueteria:paqueteria,
        codigo:codigo
    }
}

class Safe{

    constructor(){
        this.files=[];
    }

    crearSafe(paqueteria, astPython, astJava, astC){
        let fileAst = safeFile(paqueteria, astPython, astJava, astC);
        this.files.push(fileAst);
    }

    findSafe(dirPaquete){

    }

}

module.exports = {
    Safe,
    safeFile
};