
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

// 1️⃣
import * as ace from "ace-builds";
import Parser from "../assets/js/Parser.js";
import {CodeService} from "./client/app.server";
import { MatTableDataSource } from '@angular/material/table';

//Tree View
import {FlatTreeControl} from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Fruit loops' },
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli' },
          { name: 'Brussels sprouts' },
        ]
      }, {
        name: 'Orange',
        children: [
          { name: 'Pumpkins' },
          { name: 'Carrots' },
        ]
      },
    ]
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  tableDataSrc:any;
  salida="Hello world";
  line: string = 'Linea: 1 Column: 0';;
  title="MultiLenguaje";
  texto="Ingrese su codigo Aqui";
  parser: Parser;
  tableCols = ['Fila', 'Columna', 'Tipo_de_Error', 'Simbolo_provocador', 'Descripcion'];
  tableData : any;

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(private codeService:CodeService){
    let jsonData = {
      proyectos:[
        {
          proyecto: 'REI SUPREMACY'
        },
        {
          proyecto: 'ASUKA SUPREMACY'
        }
      ]
    }
    this.dataSource.data = TREE_DATA;
  }

  // 3️⃣
  @ViewChild("editor") private editor: ElementRef<HTMLElement>;
  // 3️⃣

  generarErrores(){
    this.tableDataSrc = new MatTableDataSource(this.tableData);
  }

/*
  Fila:linea,
        Columna:columna,
        Tipo_de_Error:tipo,
        Simbolo_provocador:error,
        Descripcion:descripcion
*/ 


  // 4️⃣
  ngAfterViewInit(): void {
    ace.config.set("fontSize", "14px");
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    const aceEditor = ace.edit(this.editor.nativeElement);
    // 🚨 Added
    aceEditor.setTheme('ace/theme/twilight');
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

  async parseCode(){
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
    let flag = false;
    let recievedData = false;
    await this.codeService.parse(JSON.parse(jsonString)).toPromise().then(response=> {
      let respuesta = JSON.parse(JSON.stringify(response));
      console.log("HTTP POST");
      console.log(respuesta.respuesta);
      flag = respuesta.respuesta;
      recievedData = !recievedData;
    });
    console.log("TS");
    console.log(JSON.parse(JSON.stringify(flag)));
      //throw errores
    let errores = [];
    await this.codeService.getErrores().toPromise().then( response =>{
      errores = JSON.parse(JSON.stringify(response.respuesta));
    });

      /*this.http.post(parseUrl, "").subscribe(response=> {
            return JSON.parse(JSON.stringify(response));
        });*/

    console.log(errores);
    this.tableData = errores;
    this.generarErrores();
  }

  
}

