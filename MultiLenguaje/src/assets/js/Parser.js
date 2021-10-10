import { HttpClient } from '@angular/common/http';
import {CodeService} from '../../app/client/app.server';

export default class Parser{
    constructor(codigo){
        console.log("Generando");
        this.codigo = codigo;
        this.parsed = false;
        this.errores = [];
        this.respuesta = [];
    }

    parse(){
        console.log(this.codigo.toString());
        let cliente = new CodeService();
        cliente.parse(this.codigo);
        /*const axios = require('axios')
        console.log("enviando");
        axios
        .post('https://worker:2000/parse', {
            codigo: this.codigo.toString()
        })
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        })*/

    }

    isParsed(){
        if(this.errores.length == 0){
            return true;
        }
        return false;
    }

    getErrores(){
        return this.errores;
    }

    getRespuesta(){
        return this.respuesta;
    }
}