const e = require('express');
const Booleano = require('./Booleano');
const Decimal = require('./Decimal');


class Object {
    constructor(valor, linea, columna, lenguaje){
        this.linea = linea;
        this.columna = columna;
        this.lenguaje = lenguaje;
        this.valor = valor;
        //Valores iniciales
        
        
        this.nombre = null;
        //Estado 1 para identificadores, estado 2 para punteros, estado 3 para this, estado 4 para metodos
        this.estado = 0;
        this.instruccion = null;//Es generalmente la funcion de referencia no existe Metodo
        this.variableReferencia = "";
        this.parmasO = [];
        this.esArreglo=false;
        this.paramPuntero = false;
        this.tipo = Object;
    }

    getTipo(){
        return this.tipo;
    }

    setParamPuntero(op){
        this.paramPuntero = op;
    }

    esArreglo(){
        return this.esArreglo;
    }

    setParamsO(params){
        this.paramsO = params;
        if(params!=null){
            if(params.length>0){
                this.esArreglo=true;
            }
        }
    }

    getParamsO(){
        return this.paramsO;
    }

    getEstado(){
        return this.estado;
    }

    getNombre(){
        return this.nombre;
    }

    setEstado(estado){
        this.estado = estado;
    }

    setInstruccion(instruccion){
        this.instruccion = instruccion;
    }

    setSimboloReferencia(var_){
        this.variableReferencia(var_);
    }

    getSimboloReferencia(){
        return this.variableReferencia;
    }

    getInstruccion(){
        return this.instruccion;
    }

    /*Devuelve el tipo que hace referencia a esta funcion */
    buscarTipo(tablaTipos){
        if(this.instruccion == null) return null;
        return tablaTipos.buscarInstruccion(this.instruccion);
    }

    generarExpresion(tablaTipos, instruccion){
        let cadena = "";
        cadena += this.codigo3D(tablaTipos);
        let resultado = this.parse(tablaTipos, instruccion); //Aqui va el nombre u operacion
        this.setNombre(resultado);
        return cadena;
    }

    parse(){
        if(this.nombre == null){
            return this.valor;
        }else{
            return this.nombre;
        }
    }

    setTipo(type){
       this.tipo = type;
    }

    generarParametro(tablaTipos, parametro, puntero){
        const Operacion = require('../operaciones/Operacion');
        //El paramertro debe ser un objeto ya parseado
        if(parametro instanceof Operacion){
            let cadena = parametro.generarExpresion(tablaTipos, parametro);
            let resultado = parametro.getNombre();
            parametro.setNombre(resultado);
            return cadena;
        }else if(parametro instanceof Object){
            let cadena = parametro.codigo3D(tablaTipos);
            let resultado = parametro.parse(null, null);
            parametro.setNombre(resultado);
            parametro.setParamPuntero(puntero);
            return cadena;
        }
    }

    compilerCode(tipo, cadena){
        let result = "";
        if(tipo == Cadena){
            //printf("%d\n",*((float*) arr[0]));
            result = "(*(char *) "+cadena+")";
        }else{
            result = "(*(float *) "+cadena+")";
        }
    }

    codigo3D(tablaTipos){
        let cadena="";
        
        let simbolo = this.buscarTipo(tablaTipos);//Simbolo del metodo
        let posMemoria = null;
        if(simbolo!= null) posMemoria = simbolo.getPosMemoria();

        if(simbolo!=null){
            if(this.estado == 1 || this.estado == 3){
                let varReference = this.instruccion.getVariableReferencia();
                if(varReference.getPuntero()){
                    this.estado = 2;
                }
            }
        }


        if(this.estado == 0){
            //Es una literal
            //No hacer nad aporque se tomara el valor para transformarlo
            //this.nombre = this.valor;
            const Cadena = require('./Cadena');
            const Caracter = require('./Caracter');
            const Booleano = require('./Booleano');
            const Decimal = require('./Decimal');
            const Entero = require('./Entero');
            if(this.tipo == Cadena){
                if(tablaTipos.isCompiler()){
                    cadena += "char *";
                }
                cadena += tablaTipos.drawS() + " = \""+this.valor+"\";\n ";
                this.nombre = tablaTipos.drawS();
                tablaTipos.addS();
                
            }else if(this.tipo == Caracter){
                if(this.valor != "scan()"){
                    this.nombre = this.valor.charCodeAt(0);
                    if(tablaTipos.isCompiler()){
                        let helper = tablaTipos.drawT();
                        cadena += tablaTipos.drawT() + " = \'"+this.nombre+"\'\n";
                        tablaTipos.actualTChar();
                        tablaTipos.addT();
                        cadena += tablaTipos.drawT() + " = &"+helper+";\n";
                        tablaTipos.actualTVoid();
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                    }
                }else{
                    this.nombre = this.valor;
                }
            }else if(this.tipo == Booleano){
                if(this.valor.toLowerCase() == "true"){
                    this.nombre = 1;
                }else {
                    this.nombre = 0;
                }
                if(tabla.isCompiler()){
                    cadena += tablaTipos.drawT() + " = "+this.nombre+";\n";
                    let helper = tablaTipos.drawT();
                    tablaTipos.addT();
                    cadena += tablaTipos.drawT() + " = &"+helper+";\n";
                    tablaTipos.actualTVoid();
                    this.nombre = tablaTipos.drawT();
                    tablaTipos.addT();
                     
                }
            }else if(this.tipo == Decimal){
                this.nombre = this.valor;
                if(tabla.isCompiler()){
                    cadena += tablaTipos.drawT() + " = "+this.nombre+";\n";
                    let helper = tablaTipos.drawT();
                    tablaTipos.actualTFloat();
                    tablaTipos.addT();
                    cadena += tablaTipos.drawT() + " = "+helper+";\n";
                    tablaTipos.actualTVoid();
                    this.nombre = tablaTipos.drawT();
                    tablaTipos.addT();
                }
            }else if(this.tipo == Entero){
                this.nombre = this.valor;
                if(tabla.isCompiler()){
                    cadena += tablaTipos.drawT() + " = "+this.nombre+";\n";
                    let helper = tablaTipos.drawT();
                    tablaTipos.addT();
                    cadena += tablaTipos.drawT() + " = "+helper+";\n";
                    tablaTipos.actualTVoid();
                    this.nombre = tablaTipos.drawT();
                    tablaTipos.addT();
                }
            }

        }else if(this.estado == 1 || this.estado==3){
            //Identificadores Solo llamamos la direccion de memoria en que estan ubicadas en el stack
            if(this.paramPuntero){
                cadena += tablaTipos.drawT()+" = ptr + "+posMemoria +";\n"; // Direccion de la memoria
                let tdireccion = tablaTipos.drawT(); 
                tablaTipos.addT();
                this.nombre = tdireccion;        
            }else{
                if(this.estado == 3){
                    if(tablaTipos.isCompiler()){
                        cadena += tablaTipos.drawT()+" = ptr + 0;\n"; // Pos del Heap
                        tablaTipos.addT();
                        cadena += tablaTipos.drawT() + " = stack[t"+(tablaTipos.getT()-1)+"];\n";//Valor del heap
                        tablaTipos.actualTVoid();
                        tablaTipos.addT();  
                        let helper = "t"+(tablaTipos.getT()-1);
                        helper = "(*((int*) "+helper+"))";//puntero
                        cadena += tablaTipos.drawT() + " = "+helper+" + "+(posMemoria-1)+";\n";//Direccion de la variable dentro del heap
                        tablaTipos.addT();
                        cadena += tablaTipos.drawT() + " = Heap[t"+(tablaTipos.getT()-1)+"];\n";//Enviamos el valor del heap
                        tablaTipos.actualTVoid();

                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                        
                        //Si es un arreglo
                    } else{
                        cadena += tablaTipos.drawT()+" = ptr + 0;\n"; // Pos del Heap
                        tablaTipos.addT();
                        cadena += tablaTipos.drawT() + " = stack[t"+(tablaTipos.getT()-1)+"];\n";//Valor del heap
                        tablaTipos.addT();
                        cadena += tablaTipos.drawT() + " = t"+(tablaTipos.getT()-1)+" + "+(posMemoria-1)+";\n";//Direccion de la variable dentro del heap
                        tablaTipos.addT();
                        cadena += tablaTipos.drawT() + " = Heap[t"+(tablaTipos.getT()-1)+"];\n";//Enviamos el valor del heap
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                        //Si es un arreglo
                    }
                }else{
                    if(tablaTipos.isCompiler()){
                        cadena += tablaTipos.drawT()+" = ptr +"+posMemoria+";\n";
                        tablaTipos.addT();
                        cadena += tablaTipos.drawT()+"= stack[t"+(tablaTipos.getT()-1)+"];\n";//Enviamos el valor del stack
                        tablaTipos.actualTVoid();
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                        
                        //Si no es un arreglo
                    }else{
                        cadena += tablaTipos.drawT()+" = ptr +"+posMemoria+";\n";
                        tablaTipos.addT();
                        cadena += tablaTipos.drawT()+"= stack[t"+(tablaTipos.getT()-1)+"];\n";//Enviamos el valor del stack
                        tablaTipos.actualTVoid();
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                        //Si no es un arreglo
                    }
                }
                if(this.paramsO !=null){
                    if(this.paramsO.length>0){
                        let paramsO = this.paramsO;//Son instancias de operacion y objeto
                        const Procesador3D = require('../Procesador3D');
                        let procesador3D = new Procesador3D();
                        cadena += procesador3D.procesarParametrosArr(tablaTipos, paramsO, this.instruccion);
                        let tResult = procesador3D.getNombre();
                        let tHelper = "t" + (tablaTipos.getT()-1);
                        if(tablaTipos.isCompiler()){
                            let aux = tResult.split("");
                            if(aux[0] == "t"){
                                tResult = "(*((int*)"+tResult+"))";
                            }
                            tHelper = "(*(("
                        }
                        cadena += tablaTipos.drawT() + "= "+tHelper+"["+tResult+"];\n";
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                        
                    }
                }
            }

        }else if(this.estado == 2){
            if(tablaTipos.isCompiler()){
                //Punteros
                cadena += tablaTipos.drawT()+ "= ptr +"+posMemoria+";\n";
                tablaTipos.addT();
                cadena += tablaTipos.drawT()+"= stack[t"+(tablaTipos.getT()-1)+"];\n"; //obtenemos la direccion de memoria
                tablaTipos.actualTVoid();
                tablaTipos.addT();
                let helper = "t"+(tablaTipos.getT()-1);
                helper = "(*((int*)"+helper+"))";
                cadena += tablaTipos.drawT()+" = stack["+helper+"];\n"; //obtenemos el valor
                this.nombre = tablaTipos.drawT();
                tablaTipos.actualTVoid();
                tablaTipos.addT();
                if(this.paramsO !=null){
                    if(this.paramsO.length>0){
                        let paramsO = this.paramsO;//Son instancias de operacion y objeto
                        const Procesador3D = require('../Procesador3D');
                        let procesador3D = new Procesador3D();
                        cadena += procesador3D.procesarParametrosArr(tablaTipos, paramsO, this.instruccion);
                        let tResult = procesador3D.getNombre();
                        if(tablaTipos.isCompiler()){
                            let aux = tResult.split("");
                            if(aux[0] == "t"){
                                tResult = "(*((int*)"+tResult+"))";
                            }
                        }
                        cadena += tablaTipos.drawT() + "= t"+(tablaTipos.getT()-1)+"["+tResult+"];\n";
                        this.nombre = tablaTipos.drawT();
                       
                        tablaTipos.addT();
                    }
                }  
                
            }else{
                //Punteros
                cadena += tablaTipos.drawT()+ "= ptr +"+posMemoria+";\n";
                tablaTipos.addT();
                cadena += tablaTipos.drawT()+"= stack[t"+(tablaTipos.getT()-1)+"];\n"; //obtenemos la direccion de memoria
                tablaTipos.addT();
                cadena += tablaTipos.drawT()+" = stack[t"+(tablaTipos.getT()-1)+"];\n"; //obtenemos el valor
                this.nombre = tablaTipos.drawT();
                tablaTipos.addT();
                if(this.paramsO !=null){
                    if(this.paramsO.length>0){
                        let paramsO = this.paramsO;//Son instancias de operacion y objeto
                        const Procesador3D = require('../Procesador3D');
                        let procesador3D = new Procesador3D();
                        cadena += procesador3D.procesarParametrosArr(tablaTipos, paramsO, this.instruccion);
                        let tResult = procesador3D.getNombre();
                        cadena += tablaTipos.drawT() + "= t"+(tablaTipos.getT()-1)+"["+tResult+"];\n";
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                    }
                }  
            }
                      
        }else if(this.estado == 4 && this.instruccion!=null){
            if(tablaTipos.isCompiler()){
                //Manejarlo como funcion normal
                //calculo de parametros
                let parametrosMetodo = this.instruccion.getParametrosO();
                let funcionReferencia = this.instruccion.getFuncionReferencia();//Es un objeto instruccion
                let parametrosT = [];
                for(let index=0; index<parametrosMetodo.length; index++){
                    let parametroM = parametrosMetodo[index];//Esto es una operacion o valor
                    cadena += this.generarParametro(tablaTipos, parametroM, funcionReferencia.punteroParametro(index));
                    let nombreParam = parametroM.getNombre();
                    parametrosT.push(nombreParam);
                }
                //MOvimiento de pila
                
                let tReferencia = tablaTipos.drawT();
                tablaTipos.addT();
                let sizePilaMov = tablaTipos.sizeAmbito(this.instruccion.ambitoMayor());
                let tHeap = "";
                //obtener el heap
                if(this.instruccion.esJava()){
                    cadena += tablaTipos.drawT() + " = ptr + 0;\n";
                    tablaTipos.addT();
                    cadena += tablaTipos.drawT() + " = stack[t"+(tablaTipos.getT()-1)+"];\n";
                    tablaTipos.actualTVoid();
                    tHeap = tablaTipos.drawT();//Obtuvimos el heap
                    tablaTipos.addT();
                }

                cadena += tReferencia+" = ptr + "+sizePilaMov+";\n";//Mov temporal

                if(this.instruccion.esJava()){
                    cadena += tablaTipos.drawT() + " = "+tReferencia+" + 0;\n";
                    cadena += "stack["+tablaTipos.drawT()+"] = "+tHeap+";\n";
                    tablaTipos.addT();
                }

                for(let index=0; index<parametrosT.length; index++){
                    let mem = index;
                    if(this.instruccion.esJava()){
                        mem++;
                    }
                    cadena += tablaTipos.drawT()+" = "+tReferencia+" + "+mem+";\n";//Parametro primera memoria
                    cadena += "stack["+tablaTipos.drawT()+"] = "+parametrosT[index]+";\n";
                    tablaTipos.addT();
                }
                //Llamada a metodo
                cadena += "ptr = ptr + "+sizePilaMov+";\n";
                cadena += funcionReferencia.generarNombre()+"();\n";
                cadena += "ptr = ptr - "+sizePilaMov+";\n";
                //Obtener valor
                //Movemos temporalmente la pila
                cadena += tablaTipos.drawT() + "= ptr + "+sizePilaMov+";\n";
                tablaTipos.addT();
                cadena += tablaTipos.drawT() + " = t"+(tablaTipos.getT()-1)+" + t"+funcionReferencia.getReturnName()+";\n"; //valor de retorno
                this.nombre = tablaTipos.drawT();
                
                tablaTipos.addT();
                //Manejando un metodo
                //Encontrar la variable
                //Encontrar su heap
                //Enviar los parametros
                //Invocacion metodo java
            }else{
                //Manejarlo como funcion normal
                //calculo de parametros
                let parametrosMetodo = this.instruccion.getParametrosO();
               // console.log(parametrosMetodo);
                let funcionReferencia = this.instruccion.getFuncionReferencia();//Es un objeto instruccion
                let parametrosT = [];
                for(let index=0; index<parametrosMetodo.length; index++){
                    let parametroM = parametrosMetodo[index];//Esto es una operacion o valor
                    cadena += this.generarParametro(tablaTipos, parametroM, funcionReferencia.punteroParametro(index));
                    let nombreParam = parametroM.getNombre();
                    parametrosT.push(nombreParam);
                }
                //MOvimiento de pila
                
                let tReferencia = tablaTipos.drawT();
                tablaTipos.addT();
                let sizePilaMov = tablaTipos.sizeAmbito(this.instruccion.ambitoMayor());
                let tHeap = "";
                //obtener el heap
                if(this.instruccion.esJava()){
                    cadena += tablaTipos.drawT() + " = ptr + 0;\n";
                    tablaTipos.addT();
                    cadena += tablaTipos.drawT() + " = stack[t"+(tablaTipos.getT()-1)+"];\n";
                    tHeap = tablaTipos.drawT();//Obtuvimos el heap
                    tablaTipos.addT();
                }

                cadena += tReferencia+" = ptr + "+sizePilaMov+";\n";//Mov temporal

                if(this.instruccion.esJava()){
                    cadena += tablaTipos.drawT() + " = "+tReferencia+" + 0;\n";
                    cadena += "stack["+tablaTipos.drawT()+"] = "+tHeap+";\n";
                    tablaTipos.addT();
                }

                for(let index=0; index<parametrosT.length; index++){
                    let mem = index;
                    if(this.instruccion.esJava()){
                        mem++;
                    }
                    cadena += tablaTipos.drawT()+" = "+tReferencia+" + "+mem+";\n";//Parametro primera memoria
                    cadena += "stack["+tablaTipos.drawT()+"] = "+parametrosT[index]+";\n";
                    tablaTipos.addT();
                }
                //Llamada a metodo
                cadena += "ptr = ptr + "+sizePilaMov+";\n";
                cadena += funcionReferencia.generarNombre()+"();\n";
                cadena += "ptr = ptr - "+sizePilaMov+";\n";
                //Obtener valor
                //Movemos temporalmente la pila
                cadena += tablaTipos.drawT() + "= ptr + "+sizePilaMov+";\n";
                tablaTipos.addT();
                cadena += tablaTipos.drawT() + " = t"+(tablaTipos.getT()-1)+" + t"+funcionReferencia.getReturnName()+";\n"; //valor de retorno
                this.nombre = tablaTipos.drawT();
                tablaTipos.addT();
                //Manejando un metodo
                //Encontrar la variable
                //Encontrar su heap
                //Enviar los parametros
                //Invocacion metodo java
            }
        }else if(this.estado == 5 && this.instruccion!=null){
            if(tablaTipos.isCompiler()){
                //Manejarlo como una funcion de clase desde c
                //Encontrar la variable
                let variable = this.instruccion.getVariableReferencia();//Instruccion de declaracion
                let funcionReferencia = this.instruccion.getFuncionReferencia();//Instruccion funcion
                let tipoVar = tablaTipos.buscarInstruccion(variable);
                let sizePilaMov = tablaTipos.sizeAmbito(this.instruccion.ambitoMayor());
                //Calculo de parametros
                let parametrosMetodo = this.instruccion.getParametrosO();
                let parametrosT = [];
                for(let index=0; index<parametrosMetodo.length; index++){
                    let parametroM = parametrosMetodo[index];//Esto es una operacion o valor
                    cadena += this.generarParametro(tablaTipos, parametroM, funcionReferencia.punteroParametro(index));
                    let nombreParam = parametroM.getNombre();
                    parametrosT.push(nombreParam);
                }
                //Trasposicion temporal
                //Cambiar el getPosMemoria por el tamanio de la pila que andamos manejando
                cadena += tablaTipos.drawT() +" = ptr + "+tipoVar.getPosMemoria()+";\n";//Posicion de memoria de la variable, Este no
                tablaTipos.addT();
                cadena += tablaTipos.drawT()+ "= stack[t"+(tablaTipos.getT()-1)+"];\n";//Valor de la variable Obtenemos su dir en heap
                let tHeap = tablaTipos.drawT();
                tablaTipos.actualTVoid();
                tablaTipos.addT();                
                //MOvimiento temporal
                cadena += tablaTipos.drawT() + "= ptr + "+sizePilaMov+";\n";
                tablaTipos.addT();
                cadena += tablaTipos.drawT() + " = t"+(tablaTipos.getT()-1)+" + 0;\n";
                cadena += "stack["+tablaTipos.drawT()+"] = "+tHeap+";\n" 
                tablaTipos.addT();
                //Enviamos los parametros

                cadena += tabla.drawT() + " = ptr + "+sizePilaMov+";\n";
                let tReferencia = tabla.drawT();
                tabla.addT();

                for(let index=0; index<parametrosT.length; index++){
                    cadena += tablaTipos.drawT()+" = "+tReferencia+" + "+(index+1)+";\n";//Parametro primera memoria
                    cadena += "stack["+tablaTipos.drawT()+"] = "+parametrosT[index]+";\n";
                    tablaTipos.addT();
                }
                //Llamada al metodo
                cadena += "ptr = ptr + "+sizePilaMov+";\n";
                cadena += funcionReferencia.generarNombre()+"();\n";
                cadena += "ptr = ptr - "+sizePilaMov+";\n";
                //Obtener valor
                //Movemos temporalmente la pila
                cadena += tablaTipos.drawT() + "= ptr + "+sizePilaMov+";\n";
                tablaTipos.addT();
                cadena += tablaTipos.drawT() + " = t"+(tablaTipos.getT()-1)+" + t"+funcionReferencia.getReturnName()+";\n"; //valor de retorno
                this.nombre = tablaTipos.drawT();
                tablaTipos.addT();
                //AHORA THIS.INSTRUCCION SIEMPRE SERA UN METODO
            }else{
                //Manejarlo como una funcion de clase desde c
                //Encontrar la variable
                let variable = this.instruccion.getVariableReferencia();//Instruccion de declaracion
                let funcionReferencia = this.instruccion.getFuncionReferencia();//Instruccion funcion
                let tipoVar = tablaTipos.buscarInstruccion(variable);
                let sizePilaMov = tablaTipos.sizeAmbito(this.instruccion.ambitoMayor());
                //Calculo de parametros
                let parametrosMetodo = this.instruccion.getParametrosO();
                let parametrosT = [];
                for(let index=0; index<parametrosMetodo.length; index++){
                    let parametroM = parametrosMetodo[index];//Esto es una operacion o valor
                    cadena += this.generarParametro(tablaTipos, parametroM, funcionReferencia.punteroParametro(index));
                    let nombreParam = parametroM.getNombre();
                    parametrosT.push(nombreParam);
                }
                //Trasposicion temporal
                //Cambiar el getPosMemoria por el tamanio de la pila que andamos manejando
                cadena += tablaTipos.drawT() +" = ptr + "+tipoVar.getPosMemoria()+";\n";//Posicion de memoria de la variable, Este no
                tablaTipos.addT();
                cadena += tablaTipos.drawT()+ "= stack[t"+(tablaTipos.getT()-1)+"];\n";//Valor de la variable Obtenemos su dir en heap
                let tHeap = tablaTipos.drawT();
                tablaTipos.addT();                
                //MOvimiento temporal
                cadena += tablaTipos.drawT() + "= ptr + "+sizePilaMov+";\n";
                tablaTipos.addT();
                cadena += tablaTipos.drawT() + " = t"+(tablaTipos.getT()-1)+" + 0;\n";
                cadena += "stack["+tablaTipos.drawT()+"] = "+tHeap+";\n" 
                tablaTipos.addT();
                //Enviamos los parametros

                cadena += tabla.drawT() + " = ptr + "+sizePilaMov+";\n";
                let tReferencia = tabla.drawT();
                tabla.addT();

                for(let index=0; index<parametrosT.length; index++){
                    cadena += tablaTipos.drawT()+" = "+tReferencia+" + "+(index+1)+";\n";//Parametro primera memoria
                    cadena += "stack["+tablaTipos.drawT()+"] = "+parametrosT[index]+";\n";
                    tablaTipos.addT();
                }
                //Llamada al metodo
                cadena += "ptr = ptr + "+sizePilaMov+";\n";
                cadena += funcionReferencia.generarNombre()+"();\n"
                cadena += "ptr = ptr - "+sizePilaMov+";\n";
                //Obtener valor
                //Movemos temporalmente la pila
                cadena += tablaTipos.drawT() + "= ptr + "+sizePilaMov+";\n";
                tablaTipos.addT();
                cadena += tablaTipos.drawT() + " = t"+(tablaTipos.getT()-1)+" + t"+funcionReferencia.getReturnName()+";\n"; //valor de retorno
                this.nombre = tablaTipos.drawT();
                tablaTipos.addT();
                //AHORA THIS.INSTRUCCION SIEMPRE SERA UN METODO
            }
        }
        return cadena;
    }

    

    generarValor(){
        if(this.nombre != null){
            return this.nombre;
        }else{
            return this.valor;
        }
    }

    getNombre(){
        return this.nombre;
    }

    setNombre(nombre){
        this.nombre = nombre;
    }

    getValor(){
        return this.valor;
    }

    getLinea(){
        return this.linea
    }

    getColumna(){
        return this.columna;
    }

    getLenguaje(){
        return this.lenguaje;
    }

   
}

module.exports = Object;