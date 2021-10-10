/*Inicio del parseo*/
%{
    //imports
    var ErrorLexico = require("../../error/LexicalError");
    var ErrorSintactico = require("../../error/SyntaxError");
    //variables
    let estado=0;
    let erroresLexicos = [];
    let erroresSintacticos = [];

    function getErroresLexicos(){
        return erroresLexicos;
    }

    function getErroresSintacticos(){
        return erroresSintacticos;
    }

    function addLexicalError(lexema, line, column){
        try{
            let errorLexico = new ErrorLexico(lexema, line, column);
            erroresLexicos.push(errorLexico);
        }catch(ex){
            console.log("ERROR FATAL EN addLexicalError: "+ex);
        }
    }

    function addSyntaxError(descripcion, token, line, column){
        try{
            let errorSintactico = new ErrorSintactico(descripcion, token, line, column);
            erroresSintacticos.push(errroSintactico);
        }catch(ex){
            console.log("ERROR FATAL EN addSyntaxError: "+ex);
        }
    }
    
    
%}

/* Definición Léxica */
%lex
nombre_paqueteria [aA-zZ|"_"|"-"|0-9|","|"$"|"\("|"\)"|"\["|"\]"|"\{"|"\}"]+
paqueteria {nombre_paqueteria}(["."]{nombre_paqueteria})*
chunk [^ \n\t]+
commentary "//".*
block_commentary [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	
%%

"paquete" {
    console.log("Paquete: "+yytext);
            if(estado==1){
                return 'CHUNK';
            }else {                
                return 'PAQUETE';
            }
        }
{paqueteria}    {
                    console.log("Paqueteria: "+yytext); 
                    if(estado==1){
                        return 'CHUNK';
                    }else{
                        return 'PAQUETERIA';
                    }
                }
"%%PY"  {
    console.log(yytext);
    estado=1;
    return 'PY';
    }  
"%%JAVA"    {
    console.log(yytext);
    estado=1;
    return 'JAVA';
    }
"%%PROGRAMA"    {
    console.log(yytext);
    estado=1;
    return 'PROGRAMA';
    }
\s  return 'SPACE';
{commentary}  {
        console.log("comentario: "+yytext)
            if(estado==1){
                return 'CHUNK';
            }else{
                /*ignore*/;
            }
        }
{block_commentary}  {
        console.log("comentario multiple: "+yytext)
            if(estado==1){
                return 'CHUNK';
            }else{
                /*ignore*/;
            }
        }
{chunk} {
    if(estado==0){
        this.addLexicalError(yytext, yylloc.first_line, yylloc.first_column);
    }else{
        console.log("Chunk: "+yytext);
        return 'CHUNK';
    }
}
<<EOF>> return 'EOF';

/lex


%{
	
%}

%start ini

%% /* Definición de la gramática */

space_stmt
    :SPACE space_stmt_re
    |%empty
    ;

space_stmt_re
    :space_stmt_re SPACE
    |%empty
    ;
texto
    :texto CHUNK
    |texto SPACE
    |%empty /*empty*/
    ;

ini
	:paqueteria EOF
    |paqueteria error EOF {} 
	;

paqueteria
    : space_stmt PAQUETE space_stmt PAQUETERIA space_stmt condicional_py
    | space_stmt error
    | space_stmt PAQUETE space_stmt error
    | space_stmt PAQUETE space_stmt PAQUETERIA space_stmt error
    ;

condicional_py
    :PY texto condicional_java
    |PY texto error
    ;

condicional_java
    :JAVA texto condicional_c
    |JAVA texto error
    ;

condicional_c
    :PROGRAMA texto
    ;
