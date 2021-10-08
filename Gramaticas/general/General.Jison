/*Inicio del parseo*/
%{
    let estado=0;
%}

/* Definición Léxica */
%lex
nombre_paqueteria [aA-zZ|"_"|"-"|0-9|","|"$"|"\("|"\)"|"\["|"\]"|"\{"|"\}"]+
paqueteria {nombre_paqueteria}(["."]{nombre_paqueteria})*
chunk .
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
{chunk}        console.log("Chunk: "+yytext);return 'CHUNK';
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
	;

paqueteria
    : space_stmt PAQUETE space_stmt PAQUETERIA space_stmt condicional_py
    ;

condicional_py
    :PY texto condicional_java
    ;

condicional_java
    :JAVA texto condicional_c
    ;

condicional_c
    :PROGRAMA texto
    ;
