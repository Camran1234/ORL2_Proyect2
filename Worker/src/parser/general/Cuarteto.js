const { TIPO_OPERACION } = require('../../api/Instrucciones');
const Asignacion = require('../../api/instrucciones/Asignacion');
const AsignacionClase = require('../../api/instrucciones/AsignacionClase');
const Break = require('../../api/instrucciones/Break');
const Case = require('../../api/instrucciones/Case');
const Clase = require('../../api/instrucciones/Clase');
const Clean = require('../../api/instrucciones/Clean');
const Constructor = require('../../api/instrucciones/Constructor');
const Continue = require('../../api/instrucciones/Continue');
const Declaracion = require('../../api/instrucciones/Declaracion');
const Default = require('../../api/instrucciones/Default');
const doWhile = require('../../api/instrucciones/doWhile');
const Else = require('../../api/instrucciones/Else');
const For = require('../../api/instrucciones/For');
const Function = require('../../api/instrucciones/Function');
const Getch = require('../../api/instrucciones/Getch');
const If = require('../../api/instrucciones/If');
const Imprimir = require('../../api/instrucciones/Imprimir');
const Include = require('../../api/instrucciones/Include');
const Instruccion = require('../../api/instrucciones/Instruccion');
const Main = require('../../api/instrucciones/Main');
const Metodo = require('../../api/instrucciones/Metodo');
const Retornar = require('../../api/instrucciones/Retornar');
const Scanner = require('../../api/instrucciones/Scanner');
const Switch = require('../../api/instrucciones/Switch');
const Variable = require('../../api/instrucciones/Variable');
const While = require('../../api/instrucciones/While');
const Entero = require('../../api/operadores/Entero');

class Cuarteto {

    constructor(tablaTipos){
        this.tabla = tablaTipos;
        this.if_ = null;
    }

    drawEtiqueta(e){
        return "et"+e;
    }

    drawT(t){
        return "t"+t;
    }

    /**
     * Enviamos el ast de instrucciones Javascript
     * estado 0 = iniciando primer proceso
     * estado 1 = otros procesos
     * @param {*} ast 
     * @returns 
     */
    procesar(ast, estado){
        var tabla = this.tabla;
        if (ast == null) return "AST con errores, no se pudo crear el codigo 3d";
        var cuarteto = "";    
        if(estado ==1 ){
            cuarteto += "ptr = 0;\n";
            cuarteto += "h = 0;\n"
            cuarteto += "stack [1000000] ;\n";
            cuarteto += "heap [1000000] ; \n";
        }
        if(Array.isArray(ast)){
            for(let index=0; index<ast.length; index++){
                let instruccion = ast[index];
                cuarteto += this.generar3D(instruccion)
            }
        }else{
            cuarteto += this.generar3D(ast);
        }        
        cuarteto += this.colocarSalidaIf(new Entero("", 0,0,""));
        return cuarteto;
    }

    generar3D(instruccion){
        let cuarteto = "";
        cuarteto += this.colocarSalidaIf(instruccion)
        if(instruccion instanceof Asignacion){
           cuarteto += this.procesarAsignacion(instruccion);
        }else if(instruccion instanceof AsignacionClase){
            cuarteto += this.procesarAsignacionClase(instruccion);
        }else if(instruccion instanceof Break){
            cuarteto += this.procesarBreak(instruccion)
        }else if(instruccion instanceof Case){
            cuarteto += this.procesarCase(instruccion)
        }else if(instruccion instanceof Clase){
            cuarteto += this.procesarClase(instruccion)
        }else if(instruccion instanceof Clean){
            cuarteto += this.procesarClean(instruccion)
        }else if(instruccion instanceof Constructor){
            cuarteto += this.procesarConstructor(instruccion)
        }else if(instruccion instanceof Continue){
            cuarteto += this.procesarContinue(instruccion)
        }else if(instruccion instanceof Declaracion){
            cuarteto += this.procesarDeclaracion(instruccion)
        }else if(instruccion instanceof Default){                
            cuarteto += this.procesarDefault(instruccion)
        }else if(instruccion instanceof doWhile){
            cuarteto += this.procesarDoWhile(instruccion)
        }else if(instruccion instanceof Else){
            cuarteto += this.procesarElse(instruccion)
        }else if(instruccion instanceof For){
            cuarteto += this.procesarFor(instruccion)
        }else if(instruccion instanceof Function){
            cuarteto += this.procesarFunction(instruccion)
        }else if(instruccion instanceof Getch){
            cuarteto += this.procesarGetch(instruccion)
        }else if(instruccion instanceof If){
            cuarteto += this.procesarIf(instruccion)
        }else if(instruccion instanceof Imprimir){
            cuarteto += this.procesarImprimir(instruccion)
        }else if(instruccion instanceof Include){
            cuarteto += this.procesarInclue(instruccion)
        }else if(instruccion instanceof Main){
            cuarteto += this.procesarMain(instruccion)
        }else if(instruccion instanceof Metodo){
            cuarteto += this.procesarMetodo(instruccion)
        }else if(instruccion instanceof Retornar){
            cuarteto += this.procesaRetornar(instruccion)
        }else if(instruccion instanceof Scanner){
            cuarteto += this.procesarScanner(instruccion)
        }else if(instruccion instanceof Switch){
            cuarteto += this.procesarSwitch(instruccion)
        }else if(instruccion instanceof Variable){
            cuarteto += this.procesarVariable(instruccion)
        }else if(instruccion instanceof While){
            cuarteto += this.procesarWhile(instruccion)
        }
         return cuarteto;
    }

    //Enviar var referencia porque es a la que aclararemos
    isState3(instruccion){
        let ambito = instruccion.ambitoMayor();
        if(ambito instanceof Clase){
            return true;
        }
        return false;
    }

    procesarAsignacion(instruccion){
        let cadena = "";
        //calculamos las expresiones
        let varAs = instruccion.getVariableReferencia();
        let tipoVar = this.tabla.buscarInstruccion(varAs);
        let tabla = this.tabla;
        let puntero = varAs.getPuntero();
        let tLeft = "";
        //Generamos el valor a asignar
        let expresionO = instruccion.getExpresionO();

        cadena += expresionO.generarExpresion(tabla, instruccion);
        let tResult = expresionO.getNombre();
        //Esto es R

        if(puntero){
            cadena += tabla.drawT() + " = ptr + "+tipoVar.getPosMemoria() + "; \n";
            tabla.addT();
            cadena += tabla.drawT() + " = stack[t"+(tabla.getT()-1)+"];\n";
            tLeft = tabla.drawT();
            tabla.addT();
            cadena += "stack["+tLeft+"] = "+tResult+";\n";
            //Fin
        }else{
            if(this.isState3(varAs)){
                //Es heap
                cadena += tabla.drawT() + " = ptr + 0 ;\n";
                tabla.addT();
                cadena += tabla.drawT() + "= stack[t"+(tabla.getT()-1)+"];\n"//Direccion de la clase 
                tabla.addT();
                cadena += tabla.drawT() + " = t"+(tabla.getT()-1)+" + "+(tipoVar.getPosMemoria()-1)+";\n";
                tLeft = tabla.drawT();
                tabla.addT(); 
                cadena += "Heap["+tLeft+"] = "+tResult+"; \n";
            }else{
                //Es normal
                cadena += tabla.drawT() + "= ptr + "+(tipoVar.getPosMemoria())+";\n";
                tLeft = tabla.drawT() ;
                tabla.addT();
                if(instruccion.isArray()){
                    let magnitudO = instruccion.getMagnitudO();
                    const Procesador3D = require('../../api/Procesador3D');
                    let procesador3D = new Procesador3D();
                    cadena += procesador3D.procesarParametrosArr(tabla, magnitudO, instruccion);
                    let tMagnitud = procesador3D.getNombre();
                    cadena += tabla.drawT() + " =  stack ["+tLeft+"];\n"; //Obtenemos el valor en este caso el arreglo
                    let tAux = tabla.drawT();//Es el arreglo
                    tabla.addT();                    
                    cadena+= tAux+"["+tMagnitud+"] = "+tResult+" ;\n";//Asignamos el valor
                }else{
                    cadena += "stack["+tLeft+"] = "+tResult+" ;\n";
                }
            }
        }        

        return cadena;
    }

    procesarAsignacionClase(instruccion){
        //En su posicion de memoria el valor que asignamos es el tamanio de la clase
        let tabla = this.tabla;
        let tipoIns = tabla.buscarInstruccion(instruccion);
        let maxSizeM = tabla.sizeAmbito(instruccion.ambitoMayor());
        let consBob = instruccion.getConstructor();
        let cadena = "";
        //Llamamos al constructor inicializandolo
        cadena += "ptr = ptr + "+maxSizeM+";\n";
        cadena += consBob.generarNombre() + "() ;\n";
        cadena += "ptr = ptr - "+maxSizeM+";\n";

        //Nos ubicamos en la pila del constructor
        cadena += tabla.drawT() + " = ptr + "+maxSizeM+";\n";
        tabla.addT();
        cadena += tabla.drawT() + " = t"+(tabla.getT()-1)+" + 0;\n";//Agarramos la posicion del heap
        tabla.addT();
        cadena += tabla.drawT() + " = stack[t"+(tabla.getT()-1)+"];\n";//Obtenemos la direccion
        let tDireccion = tabla.drawT();
        tabla.addT();
        cadena += tabla.drawT()+ " = ptr + "+tipoIns.getPosMemoria()+";\n";//COLOCAR VARIABLE REFERENCIA NO ASIGNACION
        cadena += "stack["+tabla.drawT()+"] = "+tDireccion+";\n";//Asignamos en el stack la pos de memoria
        tabla.addT();

        return cadena;
    }

    procesarBreak(instruccion){
        let ambito = instruccion.getAmbito();
        ambito = ambito.ambitoEnCiclo();
        let cadena="";
        if(ambito instanceof For || ambito instanceof While
            || ambito instanceof doWhile){
                cadena += "goto "+ambito.getPuntoSalida()+";\n";
        }
        return cadena;
    }

    /* 
        declaracion de la variable
        t1 = variable
        if(t1 == caso) goto ete
        goto etn
        ete:

        goto ets
        etn:
        if(t2 == caso)....
    */
    procesarCase(instruccion){
        let switch_ = instruccion.getAmbito();
        let tIde = switch_.getTIde();
        let etExit = switch_.getEtSalida();
        let expresionO = instruccion.getExpresionO();

        let cadena = "";
        cadena += expresionO.generarExpresion(this.tabla, instruccion);
        let tNombre = expresionO.getNombre();
        let etT = this.tabla.drawEt();
        this.tabla.addEt();
        let etF = this.tabla.drawEt();
        this.tabla.addEt();
        let instrucciones = instruccion.getInstrucciones();

        //if
        cadena += "if "+tIde+" == "+tNombre+" goto "+etT+";\n";
        cadena += "goto "+etF+";\n";
        cadena += etT+" :\n";
        let cuarteto_ = new Cuarteto(this.tabla);
        cadena += cuarteto_.procesar(instrucciones, 0);

        cadena += "goto "+etExit+";\n";
        cadena += etF +" :\n";
        return cadena;
    }

    procesarClase(instruccion){
        let cadena = "";
        instruccion.mergeConstructors();
        let instrucciones = instruccion.getConstructores();    
        let cuarteto_ = new Cuarteto(this.tabla);
        cadena += cuarteto_.procesar(instrucciones, 0);
        return cadena;
    }

    procesarClean(instruccion){
        let cadena = " clrscr();\n";
        return cadena;
    }

    procesarConstructor(instruccion){
        let cadena = "";
        let tabla = this.tabla;
        let cuarteto_ = new Cuarteto(this.tabla);
        let instrucciones = instruccion.getInstrucciones();
        let clase = instruccion.ambitoEnClase();//Obtenemos la clase
        let maxMemoriaC = tabla.sizeAmbito(clase)-1;//Descontamos el mismo constructor

        cadena += instruccion.generarNombre() + "{\n"
        //Establecemos la direccion del heap
        cadena += tabla.drawT() +" = ptr + 0;\n";//Direccion del heap
        cadena += "stack["+tabla.drawT()+"] = h;\n";//Asignamos el heap
        cadena += "h = h + "+maxMemoriaC+";\n";
        //Ejecutamos el resto de las acciones
        cadena += cuarteto_.procesar(instrucciones, 0);
        cadena += "}\n"
        return cadena;
    }

    procesarContinue(instruccion){
        let ambito = instruccion.getAmbito();
        ambito = ambito.ambitoEnCiclo();
        let cadena="";
        if(ambito instanceof For || ambito instanceof While
            || ambito instanceof doWhile){
                cadena += "goto "+ambito.getPuntoInicial()+";\n";
        }
        return cadena;
    }

    /*
        Arreglo
        arr[10000];
        t1 = arr;
        t2 = ptr + 0;
        stack [t2] = t1

        Si es string
        t1 = ptr + 0
    */

    procesarDeclaracion(instruccion){
        let cadena = "";
        let tabla = this.tabla;
        let tipoIns = tabla.buscarInstruccion(instruccion);
        if(instruccion.isArray()){
            //Para arreglo
            let magnitudO = instruccion.getMagnitudO();
            const Procesador3D = require('../../api/Procesador3D');
            let procesador3D = new Procesador3D()
            cadena += procesador3D.procesarParametrosArr(tabla, magnitudO, instruccion);
            let tArr = procesador3D.getNombre();
            cadena += tabla.drawAr()+"["+tArr+"];\n";
            cadena += tabla.drawT() +" = "+tabla.drawAr()+";\n";
            tabla.addAr();
            let arr = tabla.drawT();
            tabla.addT();
            //Asignacion en el stack
            cadena += tabla.drawT()+ " = ptr + "+(tipoIns.getPosMemoria())+";\n";
            let pos = tabla.drawT();
            tabla.addT();
            cadena += "stack["+pos+"] = "+arr+" ;\n";
            //Fin declaracion arreglos
        }
        return cadena;
    }


    procesarDefault(instruccion){
        let instrucciones = instruccion.getInstrucciones();
        let cuarteto_ = new Cuarteto(this.tabla);

        let cadena = "";

        cadena += cuarteto_.procesar(instrucciones, 0);

        return cadena;
    }

    procesarDoWhile(instruccion){
        let cadena = "";
        let expresionO = instruccion.getExpresionO();
        let etDo = this.tabla.drawEt();
        this.tabla.addEt();
        let etCondicion = this.tabla.drawEt();
        this.tabla.addEt();
        let etFalso = this.tabla.drawEt();
        this.tabla.addEt();
        instruccion.setPuntoFinal(etFalso);
        instruccion.setPuntoInicial(etCondicion);
        let instrucciones = instruccion.getInstrucciones();
        let cuarteto_ = new Cuarteto(this.tabla);
        cadena+= "goto "+etDo+";\n";
        cadena+= expresionO.generarExpresion(this.tabla, instruccion);
        let tCondicion = expresionO.getNombre();
        cadena+= etCondicion+":\n";
        cadena += "if "+tCondicion+" > 0  goto "+etDo+";\n";
        cadena += "goto "+etFalso+";\n";
        cadena += etDo +" :\n";
        cadena += cuarteto_.procesar(instrucciones, 0);
        cadena += "goto "+etCondicion+";\n";
        cadena += etFalso+" :\n";
        return cadena;
    }

    colocarSalidaIf(instruccion){
        let cadena = "";
        if(this.if_ !=null){
            if(!(instruccion instanceof If
                || instruccion instanceof Else)){
                cadena += this.if_.getEtSalida()+":\n";
            }
        }
        return cadena;
    }

    //Ya
    procesarElse(instruccion){
        let if_ = this.if_;
        let cadena = "";
        let condicion = instruccion.getCondicion();
        let expresion = instruccion.getExpresionO();
        let cuarteto_ = new Cuarteto(this.tabla);
        if(condicion == null){
            //Else
            let instrucciones = instruccion.getInstrucciones();
            cadena += cuarteto_.procesar(instrucciones, 0);
            cadena += "goto "+if_.getEtSalida()+";\n";

            cadena += if_.getEtSalida()+":\n";
            this.if_ = null;
        }else{
            //else if
            cadena += expresion.generarExpresion(this.tabla, instruccion);
            let etTrue = this.tabla.drawEt();
            this.tabla.addEt();
            let etFalse = this.tabla.drawEt();
            this.tabla.addEt();
            let instrucciones = instruccion.getInstrucciones();

            cadena += "if "+expresion.getNombre()+" > 0 goto "+etTrue+";\n";
            cadena += "goto "+etFalse+";\n";
            //Bloque interior
            cadena += etTrue+" :\n";
            cadena += cuarteto_.procesar(instrucciones, 0);
            //Nos vamos al final
            cadena += "goto "+if_.getEtSalida()+";\n";
            //Bloque falso
            cadena += etFalse+" :\n";
        }

        cadena += if_.getEtSalida()+ ":\n";
        return cadena;
    }

    /*
        variableInicial        
        et cond
        condicion
        if( t > 0) goto true
        goto false
        true

        accionPost
        goto cond
        false

    */

    procesarFor(instruccion){
        let inicioV = instruccion.getValorInicial();
        let condicion = instruccion.getExpresionO();
        let postV = instruccion.getAccionPost();
        let cadena = "";
        let etCond = this.tabla.drawEt();
        this.tabla.addEt();
        let etTrue = this.tabla.drawEt();
        this.tabla.addEt();
        let etFalse = this.tabla.drawEt();
        this.tabla.addEt();
        let cuarteto_ = new Cuarteto(this.tabla);
        let instrucciones = instruccion.getInstrucciones();
        //Procesamos la variable inicial
        cadena += cuarteto_.procesar(inicioV, 0);
        //Procesamos la condicion
        
        cadena += etCond+" :\n";
        cadena+= condicion.generarExpresion(this.tabla, instruccion);
        let tName = condicion.getNombre();
        cadena += " if "+tName+" > 0 goto "+etTrue+";\n";
        cadena += "goto "+etFalse+";\n";
        cadena += etTrue + " :\n";

        cuarteto_ = new Cuarteto(this.tabla);
        cadena += cuarteto_.procesar(instrucciones, 0);

        cuarteto_ = new Cuarteto(this.tabla);
        //Acion post
        cadena += cuarteto_.procesar(postV, 0);
        cadena += "goto "+etCond+";\n";
        cadena += etFalse+ " :\n";
        return cadena;
    }

    //Ya
    procesarFunction(instruccion){
        let cadena = "";
        instruccion.setEtSalida(this.tabla.drawEt());
        this.tabla.addEt();
        let instrucciones = instruccion.getInstrucciones();
        cadena += instruccion.generarNombre() + " {\n";
        let cuarteto_ = new Cuarteto(this.tabla);
        cadena += cuarteto_.procesar(instrucciones, 0);
        cadena += instruccion.getEtSalida()+" : \n";
        cadena += "}\n"
        return cadena;
    }

    procesarGetch(instruccion){
        return "scan();\n";
    }

    //Ya
    procesarIf(instruccion){
        this.if_ = instruccion;
        let cadena = ""
        //generar la expresion
        let expresion = instruccion.getExpresionO();
        instruccion.setEtSalida(this.tabla.drawEt());
        this.tabla.addEt();
        //Generamos la expresion de la condicional
        cadena += expresion.generarExpresion(this.tabla, instruccion);

        let etTrue = this.tabla.drawEt();
        this.tabla.addEt();
        let etFalsa = this.tabla.drawEt();
        this.tabla.addEt();
        let instrucciones = instruccion.getInstrucciones();
        let cuarteto_ = new Cuarteto(this.tabla);

        //Comparamos
        cadena += "if "+expresion.getNombre()+"> 0 goto "+etTrue+";\n";
        cadena += "goto "+etFalsa+";\n";
            cadena += etTrue+":\n";
            cadena += cuarteto_.procesar(instrucciones, 0);
            cadena += "goto "+instruccion.getEtSalida()+";\n";
        cadena += etFalsa+":\n";
        return cadena;
    }

    procesarImprimir(instruccion){
        let tabla = this.tabla;
        let cadena = "";
            
            let paramsT = [];
            let paramsO = instruccion.getParamsO();
            //Calculo de parametros
            for(let index=0; index<paramsO.length; index++){
                let param = paramsO[index];
                cadena += param.generarExpresion(tabla, instruccion);
                paramsT.push(param.getNombre());
            }
            //imprimimos
            let expresion = "";
            for(let index=0; index<paramsO.length; index++){
                if(index == paramsO.length-1){
                    expresion += paramsT[index];
                }else{
                    expresion += paramsT[index]+ ", ";
                }
            }
            if(instruccion.getTipo() == 'PRINTLN'){
                expresion += ", "+"\" \\n \"";
            }
            cadena += "print("+expresion+");\n";
        return cadena;
    }

    //Ya
    procesarInclude(instruccion){
        let cadena = "";
        let instrucciones = instruccion.getInstrucciones();
        let cuarteto_ = new Cuarteto(this.tabla);
        cadena += cuarteto_.procesar(instrucciones, 0);
        return cadena;
    }

    //Ya
    procesarMain(instruccion){
        let instrucciones = instruccion.getInstrucciones();
        let cuarteto_ = new Cuarteto(this.tabla);
        return cuarteto_.procesar(instrucciones, 0);
    }

    generarParametro(tabla, parametro, puntero){
        const Operacion = require('../../api/operaciones/Operacion');
        //El paramertro debe ser un objeto ya parseado
        if(parametro instanceof Operacion){
            let cadena = parametro.generarExpresion(tabla, parametro);
            let resultado = parametro.getNombre();
            parametro.setNombre(resultado);
            return cadena;
        }else if(parametro instanceof Object){
            let cadena = parametro.codigo3D(tabla);
            let resultado = parametro.parse(null, null);
            parametro.setNombre(resultado);
            parametro.setParamPuntero(puntero);
            return cadena;
        }
    }

    //
    procesarMetodo(instruccion){
        let variableReferencia = instruccion.getVariableReferencia();
        let tabla = this.tabla;
        let tipoIns = tabla.buscarInstruccion(instruccion);
        let cadena = "";
        if(variableReferencia == null){
            //Funcion normal
            //Calculo de parametros
            let funcionReferencia = instruccion.getFuncionReferencia();
            let parametrosMetodo = instruccion.getParametrosO();
            let parametrosT = [];
            let tHeap = "";
            for(let index=0; index<parametrosMetodo; index++){
                let parametroM = parametrosMetodo[index];
                cadena += this.generarParametro(tabla, parametroM, funcionReferencia.punteroParametro(index));
                parametrosT.push(parametroM.getNombre());
            }
            //Movimiento de pila
            
            let tReferencia = tabla.drawT();
            tabla.addT();
            let sizePilaMov = tabla.sizeAmbito(instruccion.ambitoMayor());

            //obtener el heap
            if(instruccion.esJava()){
                cadena += tabla.drawT() + " = ptr + 0;\n";
                tabla.addT();
                cadena += tabla.drawT() + " = stack[t"+(tabla.getT()-1)+"];\n";
                tHeap = tabla.drawT();//Obtuvimos el heap
                tabla.addT();
            }

            cadena += tReferencia + " = ptr +"+sizePilaMov+";\n";//Mov temporal
            if(instruccion.esJava()){
                cadena += tabla.drawT() + " = "+tReferencia+" + 0;\n";
                cadena += "stack["+tabla.drawT()+"] = "+tHeap+";\n";
                tabla.addT();
            }
            for(let index=0; index<parametrosT.length; index++){
                let mem = index;
                if(instruccion.esJava()){
                    mem++;
                }
                cadena += tabla.drawT()+" = "+tReferencia+" + "+mem+";\n";//Parametro primera memoria
                cadena += "stack["+tabla.drawT()+"] = "+parametrosT[index]+";\n";
                tabla.addT();
            }
            //Llamada al metodo
            cadena += "ptr = ptr + "+sizePilaMov+";\n";
            cadena += funcionReferencia.generarNombre()+"();\n";
            cadena += "ptr = ptr - "+sizePilaMov+";\n";

            //No obtenemos valor de vuelta

        }else{
            //Funcion en clase
            let variable = instruccion.getVariableReferencia();
            let funcionReferencia = instruccion.getFuncionReferencia();
            let tipoVar = tabla.buscarInstruccion(variable);
            
            let sizePilaMov = tabla.sizeAmbito(instruccion.ambitoMayor());
            //Calculo de parametros
            let parametrosMetodo = instruccion.getParametrosO();
            let parametrosT = [];
            for(let index=0; index<parametrosMetodo.length; index++){
                let parametroM = parametrosMetodo[index];//Esto es una operacion o valor
                cadena += this.generarParametro(tabla, parametroM, funcionReferencia.punteroParametro(index));
                parametrosT.push(parametroM.getNombre());
            }
            //Trasposicion temporal
            //Cambiar el getPosMemoria por el tamanio de la pila que andamos manejando
            cadena += tabla.drawT() +" = ptr + "+tipoVar.getPosMemoria()+";\n";//Posicion de memoria de la variable, Este no
            tabla.addT();
            cadena += tabla.drawT()+ "= stack[t"+(tabla.getT()-1)+"];\n";//Valor de la variable Obtenemos su dir en heap
            let tHeap = tabla.drawT();
            tabla.addT();  
            //MOvimiento temporal
            cadena += tabla.drawT() + "= ptr + "+sizePilaMov+";\n";
            tabla.addT();
            cadena += tabla.drawT() + " = t"+(tabla.getT()-1)+" + 0;\n";
            cadena += "stack["+tabla.drawT()+"] = "+tHeap+" ;\n";
            
            cadena += tabla.drawT() + " = ptr +"+sizePilaMov+";\n";//Mov temporalHeap+";\n" 
            let tReferencia = tabla.drawT();
            tabla.addT();
            
            //Enviamos los parametros
            for(let index=0; index<parametrosT.length; index++){
                cadena += tabla.drawT()+" = "+tReferencia+" + "+(index+1)+";\n";//Parametro primera memoria
                cadena += "stack["+tabla.drawT()+"] = "+parametrosT[index]+";\n";
                tabla.addT();
            }
            //Llamada al metodo
            cadena += "ptr = ptr + "+sizePilaMov+";\n";
            cadena += funcionReferencia.generarNombre()+"();\n"
            cadena += "ptr = ptr - "+sizePilaMov+";\n";
        }
        return cadena;
    }

    //Ya esta
    procesarRetornar(instruccion){
        let cadena = "";
        let ambito = instruccion.ambitoEnFuncion();
        let simbolo = this.tabla.buscarInstruccion(ambito);
        let funcionInstruccion = simbolo.getInstruccion();

        let expresionO = instruccion.getExpresionO();
        cadena += expresionO.generarExpresion(this.tabla);
        let t = this.tabla.getT();
        funcionInstruccion.generarReturnName(t, this.tabla);
        t = funcionInstruccion.getReturnName();
        cadena += "stack[t"+t+"]" + " = "+expresionO.getNombre()+";\n";
        //terminamos el retornar
        cadena += "goto "+instruccion.getEtSalida()+ " ; \n";
        return cadena;
    }

    procesarScanner(instruccion){
        let tabla = this.tabla;
        let cadena = "";
        let varReference = instruccion.getVariable();
        let tipo = tabla.buscarInstruccion(varReference);
        let texto = instruccion.getExpresion();
        
        cadena += tabla.drawT() + " = ptr "+ tipo.getPosMemoria()+";\n";
        tabla.addT();
        cadena += tabla.drawT() + " = stack[t"+(tabla.getT()-1)+"];\n";//Como es en el contexto actual no agregamos nada        
        let variable = tabla.drawT();
        tabla.addT();
        
        cadena += "scanf("+texto+", &"+variable+");\n";

        return cadena;
    }
    

    procesarSwitch(instruccion){
        let variableReferencia = instruccion.getVariableReferencia();
        let tabla = this.tabla;
        let tipoV = tabla.buscarInstruccion(variableReferencia);
        let posMemoria = tipoV.getPosMemoria();
        let cadena = "";

        cadena += tabla.drawT()+" = ptr + "+posMemoria+";\n";
        tabla.addT();
        cadena += tabla.drawT()+" = stack[t"+(tabla.getT()-1)+"] ;\n";
        let tIde = tabla.drawT();
        tabla.addT();

        instruccion.setTIde(tIde);
        instruccion.setEtSalida(tabla.drawEt());
        let etSalida = tabla.drawEt();
        tabla.addEt();

        //Introduciendo los casos
        let cases = instruccion.getCases();
        let default_ = instruccion.getDefault();

        //Casos
        for(let index=0; index<cases.length; index++){
            let cuarteto_ = new Cuarteto(tabla);
            let caso = cases[index];
            cadena += cuarteto_.procesar(caso, 0);
        }
        //Default

        if(default_!=null){
            let cuarteto_ = new Cuarteto(tabla);
            cadena += cuarteto_.procesar(default_, 0);
        }

        cadena += etSalida+" :\n"; 

        return cadena;
    }

    procesarVariable(instruccion){
        let cadena = "";
        let ast = instruccion.getAst();
        //metemos las declaraciones
        for(let index=0; index<ast.length; index++){
            let as = ast[index];
            let cuarteto_ = new Cuarteto(this.tabla);
            cadena += cuarteto_.procesar(as, 0);
        }
        return cadena;
    }

    procesarWhile(instruccion){
        let cadena = "";
        let expresionO = instruccion.getExpresionO();
        let tabla = this.tabla;
        let etCondicion = tabla.drawEt();
        let instrucciones = instruccion.getInstrucciones();
        tabla.addEt();
        let etV = tabla.drawEt();
        tabla.addEt();
        let etF = tabla.drawEt();
        tabla.addEt();

        instruccion.setPuntoInicial(etCondicion);
        instruccion.setPuntoFinal(etF);

        //condicion
        cadena += expresionO.generarExpresion(tabla, instruccion);
        let tCondicion = expresionO.getNombre();
        let cuarteto_ = new Cuarteto(this.tabla);
        //condicion
        cadena += etCondicion +" :\n";
        cadena += "if "+tCondicion+" > 0 goto "+etV + ";\n";
        cadena += "goto "+etF + ";\n";
        cadena += etV + " :\n";
        cadena += cuarteto_.procesar(instrucciones, 0);
        cadena += "goto "+etCondicion+";\n";
        cadena += etF + " :\n";

        return cadena;
    }
}


module.exports = Cuarteto;