const Asignacion = require('../instrucciones/Asignacion');
const Clase = require('../instrucciones/Clase');



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

    tipo_int(){
        const Caracter = require('./Caracter');
        const Decimal = require('./Decimal');
        const Entero = require('./Entero');
        const Cadena = require('./Entero');
        const Booleano = require('./Booleano');
        if(this.tipo instanceof Caracter
            || this.tipo == "CARACTER"
            || this.tipo == Caracter){
            return 2;
        }else if(this.tipo instanceof Booleano
            || this.tipo == "BOOLEAN"
            || this.tipo == Booleano){
            return 0;
        }else if(this.tipo instanceof Entero
            || this.tipo == "ENTERO"
            || this.tipo == Entero){
            return 0;
        }else if(this.tipo instanceof Decimal
            || this.tipo == "DECIMAL"
            || this.tipo == Decimal){
            return 1;
        }else if(this.tipo instanceof Cadena
            || this.tipo == "CADENA"
            || this.tipo == Cadena){
            return 3;
        }
        return 0;
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
        let resultado = tablaTipos.buscarInstruccion(this.instruccion);
        if(resultado == null && this.instruccion instanceof Asignacion){
            resultado = tablaTipos.buscarInstruccion(this.instruccion.getVariableReferencia().getDeclaracion());
        }
        return resultado;
    }

    generarExpresion(tablaTipos, instruccion){
        let cadena = "";
        cadena += this.codigo3D(tablaTipos);
        let resultado = this.parse(tablaTipos, instruccion); //Aqui va el nombre u operacion
        this.setNombre(resultado);
        return cadena;
    }

    parse(){
        const Any = require('./Any');
        if(this.nombre == null ){
            return this.valor;
        }else if(this.nombre == ""){
            return this.valor;   
        }else{
            if(this.tipo == Any
            || this.tipo instanceof Any
            || this.tipo == "ANY"){
                return "*((unsigned int*)"+this.nombre+")";
            }
            return this.nombre;
        }
    }

    setTipo(type){
       this.tipo = type;
    }

    generarParametro(tablaTipos, parametro, puntero){
        const Operacion = require('../operaciones/Operacion');
        const Any = require('./Any');
        //El paramertro debe ser un objeto ya parseado
        if(parametro instanceof Operacion){
            let cadena = parametro.generarExpresion(tablaTipos, parametro);
            let resultado = parametro.getNombre();
            if(parametro instanceof Any && tablaTipos.isCompiler()){
                resultado = "*((unsigned int*)"+resultado+")";
            }
            parametro.setNombre(resultado);
            return cadena;
        }else if(parametro instanceof Object){
            let cadena = parametro.codigo3D(tablaTipos);
            let resultado = parametro.parse(null, null);
            if(parametro instanceof Any && tablaTipos.isCompiler()){
                resultado = "*((unsigned int*)"+resultado+")";
            }
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
        const Cadena = require('./Cadena');
            const Caracter = require('./Caracter');
            const Booleano = require('./Booleano');
            const Decimal = require('./Decimal');
            const Entero = require('./Entero');
            const Any = require('./Any');
            const ParametroHelper = require('../../safe/ParametroHelper');
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
            if(this.tipo == Cadena){
                let aux= "";
                if(tablaTipos.isCompiler()){
                    aux += "char * "+tablaTipos.drawT()+";\n";
                }
                cadena += tablaTipos.drawT() + " = \""+this.valor+"\";\n ";
                this.nombre = tablaTipos.drawT();
                tablaTipos.inscribirT();
                tablaTipos.addT(); 
                tablaTipos.agregarTexto(aux);
            }else if(this.tipo == Caracter){
                if(this.valor != "scan()" || this.valor!="input()"){
                    this.nombre = this.valor.charCodeAt(0);
                    if(tablaTipos.isCompiler()){
                        let aux = "char "+tablaTipos.drawT()+";\n";
                        tablaTipos.agregarTexto(aux);
                        tablaTipos.inscribirT();
                        cadena += tablaTipos.drawT() + " = \'"+this.nombre+"\';\n";
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                    }else{
                        this.nombre = this.valor.charCodeAt(0);
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
                if(tablaTipos.isCompiler()){
                    let aux = "int "+tablaTipos.drawT()+";\n";
                    tablaTipos.agregarTexto(aux);
                    tablaTipos.inscribirT();
                    cadena += tablaTipos.drawT() + " = "+this.nombre+";\n";
                    this.nombre = tablaTipos.drawT();
                    tablaTipos.addT();
                }
            }else if(this.tipo == Decimal){
                if(this.valor != "scan()" || this.valor!="input()"){
                    this.nombre = this.valor;
                    if(tablaTipos.isCompiler()){
                        let aux = "float "+tablaTipos.drawT()+";\n";
                        tablaTipos.agregarTexto(aux);
                        tablaTipos.inscribirT();
                        cadena += tablaTipos.drawT() + " = "+this.nombre + ";\n";
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                    }
                }else{
                    this.nombre = this.valor;
                }
                
            }else if(this.tipo == Entero){
                if(this.valor != "scan()" || this.valor!="input()"){
                    this.nombre = this.valor;
                    if(tablaTipos.isCompiler()){
                        let aux = "int "+tablaTipos.drawT()+";\n";
                        tablaTipos.agregarTexto(aux);
                        tablaTipos.inscribirT();
                        cadena += tablaTipos.drawT() + " = "+this.nombre + ";\n";
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                    }
                }else{
                    this.nombre = this.valor;
                }
            }else if(this.tipo == Any){
                this.nombre = this.valor;
                if(tablaTipos.isCompiler()){
                    try{
                        if(simbolo.ambitoMayor() instanceof Clase){
                            this.nombre = "*((unsigned int*)"+simbolo.getInstruccion().getTName()+"->puntero)";
                        }else{
                            this.nombre = "*((unsigned int*)"+simbolo.getInstruccion().getTName()+".puntero)";
                        }
                    }catch(ex){}
                }
            }

        }else if(this.estado == 1 || this.estado==3){
            //Identificadores Solo llamamos la direccion de memoria en que estan ubicadas en el stack
            if(this.paramPuntero){
                if(tablaTipos.isCompiler()){
                    this.nombre = simbolo.getInstruccion().getTName();
                }else{
                    cadena += tablaTipos.drawT()+" = ptr + "+posMemoria +";\n"; // Direccion de la memoria
                    let tdireccion = tablaTipos.drawT(); 
                    tablaTipos.addT();
                    this.nombre = tdireccion;        
                }
            }else{
                if(this.estado == 3){
                    if(tablaTipos.isCompiler()){
                        this.nombre = simbolo.getInstruccion().getTName();
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
                        this.nombre = simbolo.getInstruccion().getTName();
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
                        if(tablaTipos.isCompiler()){
                            cadena += procesador3D.procesarParametrosArr(tablaTipos, paramsO, this.instruccion);
                            this.nombre = simbolo.getInstruccion().getTName()+"["+procesador3D.getNombre()+"]";
                        }else{
                            cadena += procesador3D.procesarParametrosArr(tablaTipos, paramsO, this.instruccion);
                            let tResult = procesador3D.getNombre();
                            let tHelper = "t" + (tablaTipos.getT()-1);
                            cadena += tablaTipos.drawT() + "= "+tHelper+"["+tResult+"];\n";
                            this.nombre = tablaTipos.drawT();
                            tablaTipos.addT();
                        }
                        
                    }
                }
            }

        }else if(this.estado == 2){
            if(tablaTipos.isCompiler()){
                //Punteros
                this.nombre = simbolo.getInstruccion().getTName();
                if(this.paramsO != null){
                    if(this.paramsO.length>0){
                        let paramsO = this.paramsO;
                        const Procesador3D = require('../Procesador3D');
                        let procesador3D = new Procesador3D();
                        cadena += procesador3D.procesarParametrosArr(tablaTipos, paramsO, this.instruccion);
                        this.nombre = simbolo.getInstruccion().getTName() + "[" + procesador3D.getNombre()+"]";
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
                        cadena += tablaTipos.drawT() + "= t"+(tablaTipos.getT()-1)+"["+tResult+"]";
                        this.nombre = tablaTipos.drawT();
                        tablaTipos.addT();
                    }
                }  
            }
                      
        }else if(this.estado == 4 && this.instruccion!=null){
            if(tablaTipos.isCompiler()){
                let parametrosMetodo = this.instruccion.getParametrosO();
                let funcionReferencia = this.instruccion.getFuncionReferencia();
                let parametrosT = [];
                for(let index=0; index<parametrosMetodo.length; index++){
                    let parametroM = parametrosMetodo[index];
                    cadena += this.generarParametro(tablaTipos, parametroM, funcionReferencia.punteroParametro(index));
                    parametrosT.push(parametroM);
                }
                for(let index=0; index<parametrosT.length; index++){
                    let parametroM = parametrosT[index];
                    let variableTipo = tablaTipos.buscarParametro(index, funcionReferencia);
                    //PENDIENTE
                    let variableInstruccion = variableTipo.getInstruccion();
                    let agregarPuntero = function(variable, parametro, tabla){
                        if(variable.getTipo() == "ANY"
                        || variable.getTipo() instanceof Any
                        || variable.getTipo() == Any){
                            return "&"+parametro.getNombre();
                        }else{
                            if(variable.getPuntero()){
                                return "&"+parametro.getNombre();
                            }else{
                                return parametro.getNombre();
                            }
                        }                        
                    }
                    //Asignar
                    if(variableInstruccion.getTipo() == "ANY"
                    || variableInstruccion.getTipo() instanceof Any
                    || variableInstruccion.getTipo() == Any){
                        
                        let parametroHelper = new ParametroHelper();
                        cadena += parametroHelper.createVoidParam(variableInstruccion, parametroM, tablaTipos);
                        if(parametroM.getTipo() == "BOOLEAN"
                        || parametroM.getTipo() instanceof Booleano
                        || parametroM.getTipo() == Booleano){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 0;\n";
                        }else if(parametroM.getTipo() == "CARACTER"
                        || parametroM.getTipo() instanceof Caracter
                        || parametroM.getTipo() == Caracter){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 2;\n";
                        }else if(parametroM.getTipo() == "ENTERO"
                        || parametroM.getTipo() instanceof Entero
                        || parametroM.getTipo() == Entero){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 0;\n";
                        }else if(parametroM.getTipo() == "DECIMAL"
                        || parametroM.getTipo() instanceof Decimal
                        || parametroM.getTipo() == Decimal){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 1;\n";
                        }else if(parametroM.getTipo() == "CADENA"
                        || parametroM.getTipo() instanceof Cadena
                        || parametroM.getTipo() == Cadena){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 3;\n";
                        }
                    }else if(variableInstruccion.getTipo() == "CADENA"
                    || variableInstruccion.getTipo() instanceof Cadena
                    || variableInstruccion.getTipo() == Cadena){
                        cadena += variableInstruccion.getTName()+" = "+agregarPuntero(variableInstruccion)+";\n";
                    }else {
                        //enteros y decimales
                        cadena += variableInstruccion.getTName()+" = "+agregarPuntero(variableInstruccion)+";\n";
                    }                    
                }

                if(this.instruccion.esJava()){
                    cadena += funcionReferencia.generarNombre()+"($$);\n";
                }else{
                    cadena += funcionReferencia.generarNombre() + "();\n";
                }
                if(funcionReferencia.getTipo() == "ANY"
                || funcionReferencia.getTipo() instanceof Any
                || funcionReferencia.getTipo() == Any){

                    this.nombre = "*((unsigned int *) "+funcionReferencia.generarReturnName()+".puntero)";
                }else{
                    this.nombre = funcionReferencia.generarReturnName();
                }

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
                let variableReferencia = this.instruccion.getVariableReferencia();
                let parametrosMetodo = this.instruccion.getParametrosO();
                let funcionReferencia = this.instruccion.getFuncionReferencia();
                let parametrosT = [];
                for(let index=0; index<parametrosMetodo.length; index++){
                    let parametroM = parametrosMetodo[index];
                    cadena += this.generarParametro(tablaTipos, parametroM, funcionReferencia.punteroParametro(index));
                    parametrosT.push(parametroM);
                }
                for(let index=0; index<parametrosT.length; index++){
                    let parametroM = parametrosT[index];
                    let size = index;
                    let claseFuncion = funcionReferencia.ambitoEnClase();
                    if(claseFuncion instanceof Clase){
                        size += tablaTipos.buscarParametroJavaSize(funcionReferencia)+1;
                    }
                    let variableTipo = tablaTipos.buscarParametro(size, funcionReferencia);
                    //PENDIENTE
                    let variableInstruccion = variableTipo.getInstruccion();
                    let agregarPuntero = function(variable, parametro, tablaTipos){
                        if(variable.getTipo() == "ANY"
                        || variable.getTipo() instanceof Any){
                            return "&"+parametro.getNombre();
                        }else{
                            if(variable.getPuntero()){
                                return "&"+parametro.getNombre();
                            }else{
                                return parametro.getNombre();
                            }
                        }                        
                    }
                    //Asignar
                    if(variableInstruccion.getTipo() == "ANY"
                    || variableInstruccion.getTipo() instanceof Any
                    || variableInstruccion.getTipo() == Any){
                        let parametroHelper = new ParametroHelper();
                        cadena += parametroHelper.createVoidParam(variableInstruccion, parametroM, tablaTipos);
                        if(parametroM.getTipo() == "BOOLEAN"
                        || parametroM.getTipo() instanceof Booleano
                        || parametroM.getTipo() == Booleano){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 0;\n";
                        }else if(parametroM.getTipo() == "CARACTER"
                        || parametroM.getTipo() instanceof Caracter
                        || parametroM.getTipo() == Caracter){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 2;\n";
                        }else if(parametroM.getTipo() == "ENTERO"
                        || parametroM.getTipo() instanceof Entero
                        || parametroM.getTipo() == Entero){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 0;\n";
                        }else if(parametroM.getTipo() == "DECIMAL"
                        || parametroM.getTipo() instanceof Decimal
                        || parametroM.getTipo() == Decimal){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 1;\n";
                        }else if(parametroM.getTipo() == "CADENA"
                        || parametroM.getTipo() instanceof Cadena
                        || parametroM.getTipo() == Cadena){
                            cadena += variableInstruccion.getTName()+".puntero = &"+parametroHelper.getNombre()+";\n";
                            cadena += variableInstruccion.getTName()+".type = 3;\n";
                        }
                    }else if(variableInstruccion.getTipo() == "CADENA"
                    || variableInstruccion.getTipo() instanceof Cadena){
                        cadena += variableInstruccion.getTName()+" = "+agregarPuntero(variableInstruccion)+";\n";
                    }else {
                        //enteros y decimales
                        cadena += variableInstruccion.getTName()+" = "+agregarPuntero(variableInstruccion)+";\n";
                    }                    
                }
                if(funcionReferencia.esJava()){
                    cadena += funcionReferencia.generarNombre() + "($$);\n";
                }else if(variableReferencia !=null){
                    cadena += funcionReferencia.generarNombre() + "(&"+variableReferencia.generarNombre()+");\n";
                }else{
                    cadena += funcionReferencia.generarNombre() + "();\n";
                }
                
                if(funcionReferencia.getTipo() == "ANY"
                || funcionReferencia.getTipo() instanceof Any
                || funcionReferencia.getTipo() == Any){                
                    this.nombre = "*((unsigned int *) "+funcionReferencia.generarReturnName()+".puntero)";
                }else{
                    this.nombre = funcionReferencia.generarReturnName();
                }
                
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

                cadena += tablaTipos.drawT() + " = ptr + "+sizePilaMov+";\n";
                let tReferencia = tablaTipos.drawT();
                tablaTipos.addT();

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