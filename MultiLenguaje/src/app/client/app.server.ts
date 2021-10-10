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
        var retornar;
        this.http.post(parseUrl, codigo).subscribe(response=> {
            let respuesta = JSON.parse(JSON.stringify(response));
                console.log(respuesta.respuesta);
        });             
    }

    public getErrores(){
        var parseUrl = this.url + "obtenerErrores";
        this.http.post(parseUrl, "").subscribe(response=> {
            let respuesta = JSON.parse(JSON.stringify(response));
                console.log(respuesta.respuesta);
        });    
    }
}