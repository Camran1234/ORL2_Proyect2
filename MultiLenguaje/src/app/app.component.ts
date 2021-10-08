
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

// 1️⃣
import * as ace from "ace-builds";
import * as parserJava from "../assets/js/parsers/java/Java.js";

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

  parseJava(){
    var inputText = this.salida.toString();

  }
  
  
  


  
}

