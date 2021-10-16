import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class CodeService {
    url = 'http://localhost:2000/';
    
    constructor(private http:HttpClient) {
        
    }

    public parse(codigo:JSON) {
        var parseUrl = this.url+"parse";
        console.log(parseUrl.toString());
        console.log(JSON.stringify(codigo));
        this.http.post(parseUrl, codigo).subscribe(response=> {
            let respuesta = JSON.parse(JSON.stringify(response));
            console.log(respuesta.respuesta);
            if(respuesta==true){
                respuesta = this.getErrores();
            }else{
                respuesta = this.getResultado();
            }
            return respuesta;
        });            
    }

    public getErrores(){
        var parseUrl = this.url + "obtenerErrores";
        return this.http.post(parseUrl, "").subscribe(response=> {
            return JSON.parse(JSON.stringify(response));
        });
    }

    public getResultado(){
        var parseUrl = this.url + "obtenerResultado";
        return this.http.post(parseUrl, "").subscribe(response=> {
            return JSON.parse(JSON.stringify(response));
        });
    }
}