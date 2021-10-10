
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

// 1️⃣
import * as ace from "ace-builds";
import Parser from "../assets/js/Parser.js";
import {CodeService} from "./client/app.server";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  salida="Hello world";
  line: string = 'Linea: 1 Column: 0';;
  title="MultiLenguaje";
  texto="Ingrese su codigo Aqui";
  parser: Parser;

  constructor(private codeService:CodeService){
    
  }

  // 3️⃣
  @ViewChild("editor") private editor: ElementRef<HTMLElement>;
  // 3️⃣
  @ViewChild("editor2") private editor2: ElementRef<HTMLElement>;
  // 4️⃣
  ngAfterViewInit(): void {
    ace.config.set("fontSize", "14px");
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    const aceEditor = ace.edit(this.editor.nativeElement);
    const aceEditor2 = ace.edit(this.editor2.nativeElement);
    // 🚨 Added
    aceEditor.setTheme('ace/theme/twilight');
    aceEditor.session.setMode('ace/mode/html');
    aceEditor2.setTheme('ace/theme/twilight');
    aceEditor.session.setMode('ace/mode/html');
    //Outputs
    aceEditor.on("change", () => {
      this.salida=aceEditor.getValue();
    });
  }

  getCurrentLineAndNumber(){
    const aceEditor = ace.edit(this.editor.nativeElement);
    var currentLineNumber = aceEditor.selection.getCursor().row +1;      
    var currentColumnNumber = aceEditor.selection.getCursor().column;    
    this.line="Linea: "+currentLineNumber+" Columna: "+currentColumnNumber;
  }

  parseCode(){
    /*var Parser = require("../assets/js/Parser");*/
    const aceEditor = ace.edit(this.editor.nativeElement);
    console.log("Entrando");
    var codigo = aceEditor.getValue();
    var jsonCodigo = {
      codigo: codigo
    };
    var jsonString = JSON.stringify(jsonCodigo);
    /*var parseador = new Parser(jsonString);
    this.parser = parseador;
    parseador.parse();*/
    this.codeService.parse(JSON.parse(jsonString));
    this.revisarErrores();
  }

  revisarErrores(){
    /*var parseador = this.parser;
    if(!parseador.isParsed()){
      //Manejar Errores
    }else{
      this.revisarEjecucion();
    }*/
  }

  revisarEjecucion(){
    //Manejar respuestas
  }

}

