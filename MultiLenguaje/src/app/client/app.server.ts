import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';

@Injectable({
    providedIn: 'root'
})

export class CodeService {
    url = 'http://localhost:2000/';
    errores: "";
    constructor(private http:HttpClient) {
        
    }

    public get3D(): Observable<any>{
        let parseUrl = this.url+"getCodigo3d";
        let body = {

        };
        return this.http.post<any>(parseUrl,JSON.stringify(body));
    }

    public parse(codigo:JSON): Observable<any> {
        let parseUrl = this.url+"parse";
        //console.log(parseUrl.toString());
        //console.log(JSON.stringify(codigo));
        let answer = false;
        return this.http.post<any>(parseUrl, codigo);
    }

    public getErrores(): Observable<any>{
        let parseUrl = this.url + "obtenerErrores";
        /*this.http.post(parseUrl, "").subscribe(response=> {
            return JSON.parse(JSON.stringify(response));
        });*/
        let body = {
            
        };
        return this.http.post<any>(parseUrl, JSON.stringify(body));
    }

    public getResultado(){
        var parseUrl = this.url + "obtenerResultado";
        return this.http.post(parseUrl, "").subscribe(response=> {
            return JSON.parse(JSON.stringify(response));
        });
    }
}