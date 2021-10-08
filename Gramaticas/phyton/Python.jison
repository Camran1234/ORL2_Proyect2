/*Parsea python*/

%{
    let indentation=0;
    let estado=0;
    let lineNumber=0;
    let columnNumber=0;

    function setLineNumber(line){
        this.lineNumber=line;
    }

    function setColumnNumber(column){
        this.columnNumber=column;
    }

    

%}

%lex
%%
\n      {
        indentation=0;
            if(estado==0){
                /*ignore*/
            }else if(estado==1){
                estado=0;
            }else if(estado==2){
                estado=0;
            }
        return 'SPACE';
        }

\t      {
            if(estado==1){
                /*ignore*/
            }else if(estado==2){
                /*ignore*/
            }else{
                yytext = 4;
                console.log('TAB');
                return 'INDENTATION';
            }            
        }
        
" "       {
            if(estado==1){
                /*ignore*/
            }else if(estado==2){
                /*ignore*/
            }else{
                yytext=1;
                console.log("blank");
                return 'INDENTATION';
            }
        }
\s     /*ignore*/;
"#"[^\n] /*ignore*/;
    
([\"][\"][\"][^\"]*([^\"][^\"]*)*[\"][\"][\"]|[\'][\'][\'][^\']*([^\'][^\']*)*[\'][\'][\']) {
                        if(estado==1){
                            /*ignore*/
                        }else if(estado==2){
                            yytext = yytext.substr(3,yyleng-6);
                            estado=2;
                        console.log(yytext);
                            return'LIT_CADENA';
                        }else{
                            indentation=0;
                            estado=1;
                        }
                    }

"def" {
                estado=2;
            console.log(yytext); return'DEF';

        }
        
"print" {
             estado=2;
console.log(yytext); return'PRINT';
            }

"println" {
                estado=2;
console.log(yytext); return'PRINTLN';
            }

"if" {
                estado=2;
console.log(yytext); return'IF';
                }

"else" {
                estado=2;
console.log(yytext); return'ELSE';
            }
      

"elif" {
                estado=2;
console.log(yytext); return'ELIF';
            }

"input" {
                estado=2;
console.log(yytext); return'INPUT';
            }

"return" {
                estado=2;
console.log(yytext); return'RETURN';
                  }

"while" {
                estado=2;
console.log(yytext); return'WHILE';
            }

"break" {
                estado=2;
console.log(yytext); return'BREAK';
            }

"continue" {

                estado=2;
console.log(yytext); return'CONTINUE';
            }

"for" {
                estado=2;
console.log(yytext); return'FOR';
            }

"in" {
                estado=2;
console.log(yytext); return'IN';
            }

"range" {
                estado=2;
console.log(yytext); return'RANGE';
            }


//Simbolos
"and" {
                estado=2;
console.log(yytext); return'AND';
            }
      

"or" {
                estado=2;
console.log(yytext); return'OR';
            }

"not" {
                estado=2;
console.log(yytext); return'NOT';
            }


"(" {
                estado=2;
console.log(yytext); return'OPEN_PARENTHESIS';
            }

")" {
                estado=2;
console.log(yytext); return'CLOSE_PARENTHESIS';
            }

"[" {
                estado=2;
console.log(yytext); return'OPEN_BRACKET';
            }

"]" {
                estado=2;
console.log(yytext); return'CLOSE_BRACKET';
            }

"{" {
                estado=2;
console.log(yytext); return'OPEN_CURLY';
            }

"}" {
                estado=2;
console.log(yytext); return'CLOSE_CURLY';
            }

"," {
                estado=2;
console.log(yytext); return'COMA';
            }

">=" {
                estado=2;
console.log(yytext); return'MAYOR_IGUAL';
            }

">" {
                estado=2;
console.log(yytext); return'MAYOR';
            }

"<" {
                estado=2;
console.log(yytext); return'MENOR';
            }

"<=" {
                estado=2;
console.log(yytext); return'MENOR_IGUAL';
            }

"!=" {
                estado=2;
console.log(yytext); return'DIFERENTE';
            }

"==" {
                estado=2;
console.log(yytext); return'COMPARACION';
            }


"+=" {
                estado=2;
console.log(yytext); return'O_SUMA';
            }

"-=" {
                estado=2;
console.log(yytext); return'O_RESTA';
            }

"/=" {
                estado=2;
console.log(yytext); return'O_DIV';
            }

"*=" {
                estado=2;
console.log(yytext); return'O_POR';
            }

"%=" {
                estado=2;
console.log(yytext); return'O_MOD';
            }

"^=" {
                estado=2;
console.log(yytext); return'O_POW';
            }

"=" {
                estado=2;
console.log(yytext); return'IGUAL';
            }

":" {
                estado=2;
console.log(yytext); return'SEMI_COLON';
            }


"+" {
                estado=2;
console.log(yytext); return'SUMA';
            }

"-" {
                estado=2;
console.log(yytext); return'RESTA';
            }

"/" {
                estado=2;
console.log(yytext); return'DIV';
            }

"*" {
                estado=2;
console.log(yytext); return'POR';
            }

"%" {
                estado=2;
console.log(yytext); return'MOD';
            }
      

"^" {
                estado=2;
console.log(yytext); return'POW';
            }


//Literales
[0-9]+("."[0-9]+)\b {
                estado=2;
console.log(yytext); return'LIT_DECIMAL';
            }

[0-9]+\b {
                estado=2;
console.log(yytext); return'LIT_ENTERO';
            }

([\"[^\"]*\"]|[\'[^\']*\']) {
                estado=2;
console.log(yytext); return'LIT_CADENA';
            }

"True" {
                estado=2;
console.log(yytext); return'LIT_TRUE';
            }

"False" {
                estado=2;
console.log(yytext); return'LIT_FALSE';
            }

[aA-zZ|"_"]([aA-zZ]|[0-9]|"_")* {
                estado=2;
console.log(yytext); return'IDENTIFICADOR';
            }


.+	{                             
        console.log("ERROR LEXICO "+yytext);
    }
<<EOF>>  return'EOF';
/lex
%{

%}
    
    
    
    %left 'OR'
    %left 'AND'
    %left 'MAYOR_IGUAL' 'MENOR_IGUAL' 'DIFERENTE' 'COMPARACION' 'MAYOR' 'MENOR'    
    %left 'NOT'
    %left 'SUMA' 'RESTA'
    %left 'POR' 'DIV' 'MOD'
    %left 'POW'
    %left 'UMINUS'
    %left 'OPEN_PARENTHESIS' 'CLOSE_PARENTHESIS'
%start ini

%% 
/*Definicion de la gramatica*/
/*Manejaremos solo expresiones*/

input
    :INPUT OPEN_PARENTHESIS CLOSE_PARENTHESIS
    ;

expresion
    :expresion AND expresion
    |expresion OR expresion
    |NOT expresion
    |expresion MAYOR expresion
    |expresion MAYOR_IGUAL expresion
    |expresion MENOR expresion
    |expresion MENOR_IGUAL expresion
    |expresion DIFERENTE expresion
    |expresion COMPARACION expresion
    |expresion SUMA expresion
    |expresion RESTA expresion
    |expresion POR expresion
    |expresion DIV expresion
    |expresion MOD expresion
    |expresion POW expresion
    |RESTA expresion %prec UMINUS
    |input
    |LIT_ENTERO
    |LIT_DECIMAL
    |LIT_CADENA
    |LIT_TRUE
    |LIT_FALSE
    |IDENTIFICADOR
    |OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS
    ;

ini
    : statements EOF
    | ini error 
    ;

/*Funcion*/
parameters
    : IDENTIFICADOR parameters_re
    | %empty /*empty*/
    ;

parameters_re
    : parameters_re COMA  IDENTIFICADOR
    |parameters_re error
    |%empty /*empty*/
    ;

function_stmt
    :DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS SEMI_COLON SPACE 
    |DEF error 
    |DEF IDENTIFICADOR error
    |DEF IDENTIFICADOR OPEN_PARENTHESIS error
    |DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS error
    |DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS SEMI_COLON error
    ;

/*End of Funcion*/

/*Declaraciones*/


statements
    : statements statement 
    | statements function_stmt
    | statements SPACE
    | statements INDENTATION
    | statements error
    |%empty /*empty*/
    ;

statement
    : var_stmt
    | if_stmt
    | for_stmt
    | while_stmt
    | print_stmt 
    | CONTINUE SPACE
    | CONTINUE error
    | BREAK SPACE
    | BREAK error
    ;
/*End of Declaraciones*/

/*Print statement*/
print_parameter
    : expresion print_stmt_re
    ;

print_parameter_re
    : print_stmt_re COMA expresion 
    | print_stmt_re error
    | %empty /*empty*/
    ;

print_method
    :PRINT
    |PRINTLN
    ;

print_stmt
    : print_method  OPEN_PARENTHESIS print_parameter CLOSE_PARENTHESIS SPACE
    | print_method error 
    | print_method OPEN_PARENTHESIS error 
    | print_method OPEN_PARENTHESIS print_parameter error 
    | print_method OPEN_PARENTHESIS print_parameter CLOSE_PARENTHESIS error
    ;
/*End of Print statement*/

/*If statement*/
if_stmt
    : IF expresion SEMI_COLON SPACE
    | IF expresion error 
    | IF expresion SEMI_COLON error
    | IF error
    | ELIF expresion SEMI_COLON SPACE
    | ELIF error SEMI_COLON SPACE
    | ELIF expresion error SPACE
    | ELIF expresion SEMI_COLON error 
    | ELIF error
    | ELSE SEMI_COLON SPACE
    | ELSE error
    | ELSE SEMI_COLON error
    ;
/*End of statement*/

/*For statement*/
for_parameters
    :expresion for_parameters_re
    ;

for_parameters_re
    : for_parameters_re COMA expresion
    | for_parameters_re error
    | %empty /*empty*/
    ;

rango
    :RANGE OPEN_PARENTHESIS for_parameters CLOSE_PARENTHESIS
    |RANGE error 
    |RANGE OPEN_PARENTHESIS error 
    ;

for_stmt
    : FOR IDENTIFICADOR IN rango SEMI_COLON SPACE
    | FOR error 
    | FOR IDENTIFICADOR error 
    | FOR IDENTIFICADOR IN error 
    | FOR IDENTIFICADOR IN rango error 
    | FOR IDENTIFICADOR IN rango SEMI_COLON error
    ;
/*End of statement*/

/*While statement*/
while_stmt
    : WHILE expresion SEMI_COLON SPACE
    | WHILE error 
    | WHILE expresion error 
    | WHILE expresion SEMI_COLON error
    ;
/*End of statement*/
/*Variable statement*/
igualaciones
    : IGUAL
    | O_MAS
    | O_RESTA
    | O_POR
    | O_DIV
    | O_POW
    | O_MOD
    ;

nombre_variables
    : IDENTIFICADOR nombre_variables_re
    ;

nombre_variables_re
    : nombre_variables_re COMA IDENTIFICADOR
    | %empty /*empty*/
    ;

asignacion
    : igualaciones expresion asignacion_re
    | igualaciones error 
    ;

asignacion_re
    : asignacion_re igualaciones expresion 
    | asignacion_re error
    | %empty /*empty*/
    ;

var_stmt
    : nombre_variables asignacion SPACE
    | nombre_variables error
    ;
/*End of statement*/
