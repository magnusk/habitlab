var ditto,last,o,bnf,operators,tokens,name,alts,alt,token;ditto={},last="",o=function(n,o,r){return n=n.trim().split(/\s+/),o&&(o=o===ditto?last:(o+"").replace(/^function\s*\(\)\s*\{\s*return\s*([\s\S]*);\s*\}/,function(o,r){return"$$ = "+("L("===r.slice(0,2)?"(":"L(@1, @"+n.length+",")+r+");"}).replace(/\b(?!Er)(?!String)[A-Z][\w.]*/g,"yy.$&").replace(/(\.L\()\s*(\d+\s*\,)\s*(\d+\s*\,)?/g,function(o,r,e,t){return r+"@"+(e||"1,")+"@"+(t||e||n.length+",")})),[n,last=o||"",r]},bnf={Chain:[o("ID",function(){return Chain(L(1,Var($1)))}),o("Parenthetical",function(){return Chain($1)}),o("List",ditto),o("STRNUM",function(){return Chain(L(1,Literal($1)))}),o("LITERAL",ditto),o("Chain DOT Key",function(){return $1.add(L(2,3,Index($3,$2,!0)))}),o("Chain DOT List",ditto),o("Chain CALL( ArgList OptComma )CALL",function(){return $1.add(L(2,5,Call($3)))}),o("Chain ?",function(){return Chain(L(1,2,Existence($1.unwrap())))}),o("LET CALL( ArgList OptComma )CALL Block",function(){return Chain(L(1,5,Call.let($3,$6)))}),o("[ Expression LoopHeads ]",function(){return Chain(L(1,4,$3[0].makeComprehension($2,$3.slice(1))))}),o("[ Expression LoopHeads DEDENT ]",function(){return Chain(L(1,5,$3[0].makeComprehension($2,$3.slice(1))))}),o("{ [ ArgList OptComma ] LoopHeads }",function(){return Chain(L(1,7,$6[0].addObjComp().makeComprehension(L(3,Arr($3)),$6.slice(1))))}),o("( BIOP )",function(){return Chain(L(2,Binary($2)))}),o("( BIOP Expression )",function(){return Chain(L(2,Binary($2,void 0,$3)))}),o("( Expression BIOP )",function(){return Chain(L(3,Binary($3,$2)))}),o("( BIOPR )",function(){return Chain(L(2,"!"===$2.charAt(0)?Binary($2.slice(1)).invertIt():Binary($2)))}),o("( BIOPR Expression )",function(){return Chain(L(2,"!"===$2.charAt(0)?Binary($2.slice(1),void 0,$3).invertIt():Binary($2,void 0,$3)))}),o("( Expression BIOPR )",function(){return Chain(L(3,"!"===$3.charAt(0)?Binary($3.slice(1),$2).invertIt():Binary($3,$2)))}),o("( BIOPBP )",function(){return Chain(L(2,Binary($2)))}),o("( BIOPBP CALL( ArgList OptComma )CALL )",function(){return Chain(L(2,Binary($2,void 0,$4)))}),o("( BIOPP )",function(){return Chain(L(2,Binary($2)))}),o("( PARAM( ArgList OptComma )PARAM BIOPP )",function(){return Chain(L(6,Binary($6,$3)))}),o("( UNARY )",function(){return Chain(L(2,Unary($2)))}),o("( CREMENT )",ditto),o("( BACKTICK Chain BACKTICK )",function(){return Chain($3)}),o("( Expression BACKTICK Chain BACKTICK )",function(){return Chain(L(2,5,$4.add(L(2,Call([$2])))))}),o("( BACKTICK Chain BACKTICK Expression )",function(){return Chain(L(3,Chain(Var("flip$"))).add(L(3,Call([$3])))).flipIt().add(L(5,Call([$5])))}),o("[ Expression TO Expression ]",function(){return Chain(L(2,4,new For({from:$2,op:$3,to:$4,inComprehension:!0})))}),o("[ Expression TO Expression BY Expression ]",function(){return Chain(L(2,6,new For({from:$2,op:$3,to:$4,step:$6,inComprehension:!0})))}),o("[ FROM Expression TO Expression ]",function(){return Chain(L(2,5,new For({from:$3,op:$4,to:$5,inComprehension:!0})))}),o("[ FROM Expression TO Expression BY Expression ]",function(){return Chain(L(2,7,new For({from:$3,op:$4,to:$5,step:$7,inComprehension:!0})))}),o("[ TO Expression ]",function(){return Chain(L(2,3,new For({from:Chain(Literal(0)),op:$2,to:$3,inComprehension:!0})))}),o("[ TO Expression BY Expression ]",function(){return Chain(L(2,5,new For({from:Chain(Literal(0)),op:$2,to:$3,step:$5,inComprehension:!0})))}),o("Chain DOT [ Expression TO Expression BY Expression ]",function(){return Chain(L(1,9,new StepSlice({op:$5,target:$1,from:$4,to:$6,step:$8})))}),o("Chain DOT [ TO Expression BY Expression ]",function(){return Chain(L(1,8,new StepSlice({op:$4,target:$1,from:Literal(0),to:$5,step:$7})))}),o("Chain DOT [ Expression TO Expression ]",function(){return Chain(L(1,7,Slice({type:$5,target:$1,from:$4,to:$6})))}),o("Chain DOT [ Expression TO ]",function(){return Chain(L(1,6,Slice({type:$5,target:$1,from:$4})))}),o("Chain DOT [ TO Expression ]",function(){return Chain(L(1,6,Slice({type:$4,target:$1,to:$5})))}),o("Chain DOT [ TO ]",function(){return Chain(L(1,5,Slice({type:$4,target:$1})))}),o("WITH Expression Block",function(){return Chain(L(1,2,Cascade($2,$3,"with")))}),o("FOR  Expression Block",function(){return Chain(L(1,2,new For({kind:$1,source:$2,body:$3,ref:!0}).addBody($3)))})],List:[o("[ ArgList    OptComma ]",function(){return Arr($2)}),o("{ Properties OptComma }",function(){return Obj($2)}),o("[ ArgList    OptComma ] LABEL",function(){return Arr($2).named($5)}),o("{ Properties OptComma } LABEL",function(){return Obj($2).named($5)})],Key:[o("KeyBase"),o("Parenthetical")],KeyBase:[o("ID",function(){return Key($1)}),o("STRNUM",function(){return Literal($1)})],ArgList:[o("",function(){return[]}),o("Arg",function(){return[$1]}),o("ArgList , Arg",function(){return $1.concat($3)}),o("ArgList OptComma NEWLINE Arg",function(){return $1.concat($4)}),o("ArgList OptComma INDENT ArgList OptComma DEDENT",ditto)],Arg:[o("Expression"),o("... Expression",function(){return Splat($2)}),o("...",function(){return Splat(L(1,Arr()),!0)})],OptComma:[o(""),o(",")],Lines:[o("",function(){return Block()}),o("Line",function(){return Block($1)}),o("Lines NEWLINE Line",function(){return $1.add($3)}),o("Lines NEWLINE")],Line:[o("Expression"),o("Expression Block",function(){return Cascade($1,$2,"cascade")}),o("PARAM( ArgList OptComma )PARAM <- Expression",function(){return Call.back($2,$6,/~/.test($5),/--|~~/.test($5),/!/.test($5),/\*/.test($5))}),o("COMMENT",function(){return JS($1,!0,!0)}),o("...",function(){return Throw(L(1,JS("Error('unimplemented')")))}),o("REQUIRE Chain",function(){return Require($2.unwrap())})],Block:[o("INDENT Lines DEDENT",function(){return $2})],SplatChain:[o("... Chain",function(){return Splat($2.unwrap())})],Expression:[o("Chain CLONEPORT Expression",function(){return Import(L(1,2,Unary("^^",$1,{prec:"UNARY"})),$3,!1)}),o("Chain CLONEPORT Block",function(){return Import(L(1,2,Unary("^^",$1,{prec:"UNARY"})),$3.unwrap(),!1)}),o("Expression BACKTICK Chain BACKTICK Expression",function(){return $3.add(L(1,5,Call([$1,$5])))}),o("Chain",function(){return $1.unwrap()}),o("Chain ASSIGN Expression",function(){return Assign($1.unwrap(),$3,L(2,Box($2)))}),o("SplatChain ASSIGN Expression",function(){return Assign($1,$3,L(2,Box($2)))}),o("Chain ASSIGN INDENT ArgList OptComma DEDENT",function(){return Assign($1.unwrap(),Arr.maybe($4),L(2,Box($2)))}),o("Expression IMPORT Expression",function(){return Import($1,$3,"<<<<"===$2)}),o("Expression IMPORT INDENT ArgList OptComma DEDENT",function(){return Import($1,Arr.maybe($4),"<<<<"===$2)}),o("CREMENT Chain",function(){return Unary($1,$2.unwrap())}),o("Chain CREMENT",function(){return Unary($2,$1.unwrap(),!0)}),o("CREMENT ... Chain",function(){return Unary($1,Splat($3.unwrap()))}),o("SplatChain CREMENT",function(){return Unary($2,$1,!0)}),o("UNARY ASSIGN     Chain",function(){return Assign($3.unwrap(),[$1],L(2,Box($2)))}),o("+-    ASSIGN     Chain",ditto),o("CLONE ASSIGN     Chain",ditto),o("UNARY ASSIGN ... Chain",function(){return Assign(Splat($4.unwrap()),[$1],L(2,Box($2)))}),o("+-    ASSIGN ... Chain",ditto),o("CLONE ASSIGN ... Chain",ditto),o("UNARY     Expression",function(){return Unary($1,$2)}),o("+-        Expression",ditto,{prec:"UNARY"}),o("CLONE     Expression",ditto,{prec:"UNARY"}),o("UNARY ... Expression",function(){return Unary($1,Splat($3))}),o("+-    ... Expression",ditto,{prec:"UNARY"}),o("CLONE ... Expression",ditto,{prec:"UNARY"}),o("UNARY ... INDENT ArgList OptComma DEDENT",function(){return Unary($1,Splat(Arr($4)))}),o("UNARY INDENT ArgList OptComma DEDENT",function(){return Unary($1,Arr.maybe($3))}),o("YIELD",function(){return Yield($1)}),o("YIELD Expression",function(){return Yield($1,$2)}),o("Expression +-      Expression",function(){return L(2,Binary($2,$1,$3))}),o("Expression COMPARE Expression",ditto),o("Expression LOGIC   Expression",ditto),o("Expression MATH    Expression",ditto),o("Expression POWER   Expression",ditto),o("Expression SHIFT   Expression",ditto),o("Expression BITWISE Expression",ditto),o("Expression CONCAT  Expression",ditto),o("Expression COMPOSE Expression",ditto),o("Expression RELATION Expression",function(){return"!"===$2.charAt(0)?Binary($2.slice(1),$1,$3).invert():Binary($2,$1,$3)}),o("Expression PIPE     Expression",function(){return Block($1).pipe($3,$2)}),o("Expression BACKPIPE Expression",function(){return Block($1).pipe([$3],$2)}),o("Chain !?",function(){return Existence($1.unwrap(),!0)}),o("PARAM( ArgList OptComma )PARAM -> Block",function(){return Fun($2,$6,/~/.test($5),/--|~~/.test($5),/!/.test($5),/\*/.test($5))}),o("FUNCTION CALL( ArgList OptComma )CALL Block",function(){return Fun($3,$6).named($1)}),o("GENERATOR CALL( ArgList OptComma )CALL Block",function(){return Fun($3,$6,!1,!1,!1,!0).named($1)}),o("IF Expression Block Else",function(){return L(1,2,If($2,$3,"unless"===$1)).addElse($4)}),o("Expression POST_IF Expression",function(){return L(2,3,If($3,$1,"unless"===$2))}),o("LoopHead Block Else",function(){return $1.addBody($2).addElse($3)}),o("DO Block WHILE Expression",function(){return new While($4,"until"===$3,!0).addBody($2)}),o("DO Block WHILE Expression CASE Expression",function(){return new While($4,"until"===$3,!0).addGuard($6).addBody($2)}),o("HURL Expression",function(){return Jump[$1]($2)}),o("HURL INDENT ArgList OptComma DEDENT",function(){return Jump[$1](Arr.maybe($3))}),o("HURL",function(){return Jump[$1]()}),o("JUMP",function(){return new Jump($1)}),o("JUMP ID",function(){return new Jump($1,$2)}),o("SWITCH Exprs Cases",function(){return new Switch($1,$2,$3)}),o("SWITCH Exprs Cases DEFAULT Block",function(){return new Switch($1,$2,$3,$5)}),o("SWITCH Exprs Cases ELSE    Block",function(){return new Switch($1,$2,$3,$5)}),o("SWITCH       Cases",function(){return new Switch($1,null,$2)}),o("SWITCH       Cases DEFAULT Block",function(){return new Switch($1,null,$2,$4)}),o("SWITCH       Cases ELSE    Block",function(){return new Switch($1,null,$2,$4)}),o("SWITCH                     Block",function(){return new Switch($1,null,[],$2)}),o("TRY Block",function(){return new Try($2)}),o("TRY Block CATCH Block",function(){return new Try($2,void 0,L(3,$4))}),o("TRY Block CATCH Block     FINALLY Block",function(){return new Try($2,void 0,L(3,$4),L(5,$6))}),o("TRY Block CATCH Arg Block",function(){return new Try($2,$4,L(3,4,$5))}),o("TRY Block CATCH Arg Block FINALLY Block",function(){return new Try($2,$4,L(3,4,$5),L(6,$7))}),o("TRY Block                 FINALLY Block",function(){return new Try($2,void 0,void 0,L(3,$4))}),o("CLASS Chain OptExtends OptImplements Block",function(){return new Class({title:$2.unwrap(),sup:$3,mixins:$4,body:$5})}),o("CLASS       OptExtends OptImplements Block",function(){return new Class({sup:$2,mixins:$3,body:$4})}),o("Chain EXTENDS Expression",function(){return Util.Extends($1.unwrap(),$3)}),o("LABEL Expression",function(){return new Label($1,$2)}),o("LABEL Block",ditto),o("DECL INDENT ArgList OptComma DEDENT",function(){return Decl($1,$3,yylineno+1)})],Exprs:[o("Expression",function(){return[$1]}),o("Exprs , Expression",function(){return $1.concat($3)})],KeyValue:[o("Key"),o("LITERAL",function(){return Prop(L(1,Key($1,"arguments"!==$1&&"eval"!==$1)),L(1,Literal($1)))}),o("Key     DOT KeyBase",function(){return Prop($3,Chain($1,[L(2,3,Index($3,$2))]))}),o("LITERAL DOT KeyBase",function(){return Prop($3,Chain(L(1,Literal($1)),[L(2,3,Index($3,$2))]))}),o("{ Properties OptComma } LABEL",function(){return Prop(L(5,Key($5)),L(1,4,Obj($2).named($5)))}),o("[ ArgList    OptComma ] LABEL",function(){return Prop(L(5,Key($5)),L(1,4,Arr($2).named($5)))})],Property:[o("Key : Expression",function(){return Prop($1,$3)}),o("Key : INDENT ArgList OptComma DEDENT",function(){return Prop($1,Arr.maybe($4))}),o("KeyValue"),o("KeyValue LOGIC Expression",function(){return L(2,Binary($2,$1,$3))}),o("KeyValue ASSIGN Expression",function(){return L(2,Binary($2,$1,$3,!0))}),o("+- Key",function(){return Prop($2.maybeKey(),L(1,Literal("+"===$1)))}),o("+- LITERAL",function(){return Prop(L(2,Key($2,!0)),L(1,Literal("+"===$1)))}),o("... Expression",function(){return Splat($2)}),o("COMMENT",function(){return JS($1,!0,!0)})],Properties:[o("",function(){return[]}),o("Property",function(){return[$1]}),o("Properties , Property",function(){return $1.concat($3)}),o("Properties OptComma NEWLINE Property",function(){return $1.concat($4)}),o("INDENT Properties OptComma DEDENT",function(){return $2})],Parenthetical:[o("( Body )",function(){return Parens($2.chomp().unwrap(),!1,'"'===$1,L(1,{}),L(3,{}))})],Body:[o("Lines"),o("Block"),o("Block NEWLINE Lines",function(){return $1.add($3)})],Else:[o("",function(){return null}),o("ELSE Block",function(){return $2}),o("ELSE IF Expression Block Else",function(){return If($3,$4,"unless"===$2).addElse($5)})],LoopHead:[o("FOR Chain IN Expression",function(){return new For({kind:$1,item:$2.unwrap(),index:$3,source:$4})}),o("FOR Chain IN Expression CASE Expression",function(){return new For({kind:$1,item:$2.unwrap(),index:$3,source:$4,guard:$6})}),o("FOR Chain IN Expression BY Expression",function(){return new For({kind:$1,item:$2.unwrap(),index:$3,source:$4,step:$6})}),o("FOR Chain IN Expression BY Expression CASE Expression",function(){return new For({kind:$1,item:$2.unwrap(),index:$3,source:$4,step:$6,guard:$8})}),o("FOR Expression",function(){return new For({kind:$1,source:$2,ref:!0})}),o("FOR Expression CASE Expression",function(){return new For({kind:$1,source:$2,ref:!0,guard:$4})}),o("FOR Expression BY Expression",function(){return new For({kind:$1,source:$2,ref:!0,step:$4})}),o("FOR Expression BY Expression CASE Expression",function(){return new For({kind:$1,source:$2,ref:!0,step:$4,guard:$6})}),o("FOR     ID         OF Expression",function(){return new For({object:!0,kind:$1,index:$2,source:$4})}),o("FOR     ID         OF Expression CASE Expression",function(){return new For({object:!0,kind:$1,index:$2,source:$4,guard:$6})}),o("FOR     ID , Chain OF Expression",function(){return new For({object:!0,kind:$1,index:$2,item:$4.unwrap(),source:$6})}),o("FOR     ID , Chain OF Expression CASE Expression",function(){return new For({object:!0,kind:$1,index:$2,item:$4.unwrap(),source:$6,guard:$8})}),o("FOR ID FROM Expression TO Expression",function(){return new For({kind:$1,index:$2,from:$4,op:$5,to:$6})}),o("FOR FROM Expression TO Expression",function(){return new For({kind:$1,from:$3,op:$4,to:$5,ref:!0})}),o("FOR ID FROM Expression TO Expression CASE Expression",function(){return new For({kind:$1,index:$2,from:$4,op:$5,to:$6,guard:$8})}),o("FOR FROM Expression TO Expression CASE Expression",function(){return new For({kind:$1,from:$3,op:$4,to:$5,guard:$7,ref:!0})}),o("FOR ID FROM Expression TO Expression BY Expression",function(){return new For({kind:$1,index:$2,from:$4,op:$5,to:$6,step:$8})}),o("FOR FROM Expression TO Expression BY Expression",function(){return new For({kind:$1,from:$3,op:$4,to:$5,step:$7,ref:!0})}),o("FOR ID FROM Expression TO Expression BY Expression CASE Expression",function(){return new For({kind:$1,index:$2,from:$4,op:$5,to:$6,step:$8,guard:$10})}),o("FOR FROM Expression TO Expression BY Expression CASE Expression",function(){return new For({kind:$1,from:$3,op:$4,to:$5,step:$7,guard:$9,ref:!0})}),o("FOR ID FROM Expression TO Expression CASE Expression BY Expression",function(){return new For({kind:$1,index:$2,from:$4,op:$5,to:$6,guard:$8,step:$10})}),o("FOR FROM Expression TO Expression CASE Expression BY Expression",function(){return new For({kind:$1,from:$3,op:$4,to:$5,guard:$7,step:$9,ref:!0})}),o("WHILE Expression",function(){return new While($2,"until"===$1)}),o("WHILE Expression CASE Expression",function(){return new While($2,"until"===$1).addGuard($4)}),o("WHILE Expression , Expression",function(){return new While($2,"until"===$1,$4)}),o("WHILE Expression , Expression CASE Expression",function(){return new While($2,"until"===$1,$4).addGuard($6)})],LoopHeads:[o("LoopHead",function(){return[$1]}),o("LoopHeads LoopHead",function(){return $1.concat($2)}),o("LoopHeads NEWLINE LoopHead",function(){return $1.concat($3)}),o("LoopHeads INDENT LoopHead",function(){return $1.concat($3)})],Cases:[o("CASE Exprs Block",function(){return[L(1,2,new Case($2,$3))]}),o("Cases CASE Exprs Block",function(){return $1.concat(L(2,3,new Case($3,$4)))})],OptExtends:[o("EXTENDS Expression",function(){return $2}),o("",function(){return null})],OptImplements:[o("IMPLEMENTS Exprs",function(){return $2}),o("",function(){return null})]},operators=[["left","POST_IF"],["right","ASSIGN","HURL"],["right","YIELD"],["right","BACKPIPE"],["left","PIPE"],["right",",","FOR","WHILE","EXTENDS","INDENT","SWITCH","CASE","TO","BY","LABEL"],["right","LOGIC"],["left","BITWISE"],["right","COMPARE"],["left","RELATION"],["right","CONCAT"],["left","SHIFT","IMPORT","CLONEPORT"],["left","+-"],["left","MATH"],["right","UNARY"],["right","POWER"],["right","COMPOSE"],["nonassoc","CREMENT"],["nonassoc","..."],["left","BACKTICK"]],tokens=function(){var n,o,r,e,t,i,s,$,u,p=[];for(name in n=bnf){for(alts=n[name],o=[],r=0,t=(e=alts).length;r<t;++r){for(alt=e[r],i=[],s=0,u=($=alt[0]).length;s<u;++s)token=$[s],token in bnf||i.push(token);o.push(i)}p.push(o)}return p}().join(" "),bnf.Root=[[["Body"],"return $$"]],module.exports=new(require("jison").Parser)({bnf:bnf,operators:operators,tokens:tokens,startSymbol:"Root"});