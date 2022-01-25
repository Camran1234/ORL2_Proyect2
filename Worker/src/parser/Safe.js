
class Safe{

    constructor(){
        this.dir = "./data";
        this.dir3D = "./data/codigo3d.mlg";
        this.dirC = "./data/codigoC.mlg";
        this.createDirectory(this.dir);
    }   
    
    obtenerCodigo3D(){
        let fs = require('fs');
        let codigo = "Sin codigo 3D";
        codigo = fs.readFileSync(this.dir3D, 'utf8');
        
        /*fs.readFileSync(this.dir3D, (err, data) => {
            if (err) throw err;
            codigo = data.toString();
        });*/
        return codigo;
        
    }

    obtenerCodigoC(){
        let fs = require('fs');
        let codigo = "NULL";
        codigo = fs.readFileSync(this.dirC, 'utf8');
        return codigo;
    }

    guardarCodigoC(content){
        let fs = require('fs');
        fs.writeFile(this.dirC, content, function (err) {
            if(err) throw err;
        });
    }

    guardarCodigo3D(content){
        let fs = require('fs');

        fs.writeFile(this.dir3D, content, function (err) {
            if (err) throw err;
            console.log('GUARDADO');
        });
    }

    createDirectory(dir){
        let fs = require('fs');

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            console.log("Creating")
        }
    }

    

}

module.exports = Safe;