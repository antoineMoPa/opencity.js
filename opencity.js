var opencity = {};

opencity.tokens = [
    [/^[\s\t \n]+/,"whitespace"],
    [/^road/,"road"],
    [/^block/,"block"],
    [/^end/,"end"],
    [/^busstop/,"road_element"],
    [/^sidewalk/,"road_element"],
    [/^parkinglane/,"road_element"],
    [/^bikelane/,"road_element"],
    [/^buslane/,"road_element"],
    [/^middle/,"road_element"],
    [/^carlane/,"road_element"],
    [/^buslane/,"road_element"],
    [/^buildingedge/,"road_element"],
    [/^buildings/,"buildings"],
    [/^roundabout/,"roundabout"],
    [/^intersection/,"intersection"],
    [/^[a-zA-Z\_]+/,"identifier"],
    [/^\$[0-9]+/,"$number"],
    [/^\$[a-zA-Z\_]+/,"$identifier"],
    [/^:/,"colon"],
    [/^=/,"assignment"],
    [/^\(/,"open_parens"],
    [/^\)/,"close_parens"],
    [/^[0-9]+\.[0-9]+/,"number"],
    [/^[0-9]+/,"number"],
    [/^\,/,"comma"],
    [/^\-/,"hyphen"],
    [/^;/,"semicolon"],
];

opencity.tokenize = function(str, keep_whitespace){
    // Whitespace is useful for tests
    if(typeof keep_whitespace == "undefined"){
        keep_whitespace = true;
    }

    var toks = [];
    var l = str.length;
    var remaining = str;
    var tokens = opencity.tokens;

    while(remaining.length > 0){
        var match = false;
        for(var it = 0; it < tokens.length; it++){
            var t = tokens[it];
            
            if((m = remaining.match(t[0])) != null){
                if(t[1] != "whitespace" || keep_whitespace){
                    toks.push([t[1],m[0]]);
                }
                remaining = remaining.substr(m[0].length, remaining.length);
                match = true;
                break;
            }
        }
        
        if(!match){
            console.log("tokenization error at :'"+remaining.substr(0,15)+"[...]'");
            throw "Tokenization error";
        }

    }

    toks.push(["eof"]);

    return toks;
};

opencity.eval = function(statements, canvas){
    var ctx = canvas.getContext("2d");
    var functions = {};

    // Log and throw error
    function error(msg){
        console.log(msg);
        var e = new Error();
        console.log(e.stack);
        throw "Evaluation error";
    }

    function road(){
        
    }
    
    function func_call(statement){
        if(typeof functions[statement.name] == "undefined"){
            error("function " + statement.name + "() does not exist.");
        }

        var f = functions[statement.name];
        
        console.log("s",statement);
        console.log("f",f);

        var assigns = statement.assigns.length;
        
        if(assigns < f.catches){
            error(statement.name+"() returns "+
                  f.catches+
                  " elements but you are trying to assign"+
                  assings + " elements.");
        }
        
        if(f.type == "road"){
            var x1 = Number(statement.args[0]);
            var y1 = Number(statement.args[1]);
            var x2 = Number(statement.args[2]);
            var y2 = Number(statement.args[3]);
            
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            
            ctx.stroke();
        }
    }
    
    for(var i = 0; i < statements.length; i++){
        var s = statements[i];

        switch(s.type){
        case "road":
            functions[s.identifier] = s;
            break;
        case "func_call":
            func_call(s);
            break;
        default:
            console.log("unmanaged statement type: "+s.type);
        }
    }
};

opencity.parse = function(str){
    var toks = opencity.tokenize(str, false);

    var statements = [];

    var i = 0;

    statements = parse_tokens();

    // Log and throw error
    function error(expected){
        console.log("Expected: "+expected+
                    " but found "+(toks[i][0])+": "+
                    (toks[i][1]));
        var e = new Error();
        console.log(e.stack);
        throw "Parse error";
    }

    function parse_token(token){
        i++;
        if(toks[i][0] == token){
            return toks[i][1];
        } else {
            error(token);
        }
    }
    
    function road_element(){
        i++;
        
        if(toks[i][0] == "road_element"){
            var element = {};
            element.type = toks[i][1];
            element.catches = [];
            i++;
            if(toks[i][0] == "semicolon" || toks[i][0] == "hyphen"){
                i--;
                return element;
            } else if(toks[i][0] == "open_parens"){
                // Now we expect a $number and a close_parens
                i++;
                if(toks[i][0] == "$number"){
                    element.catches
                        .push(toks[i][1]);
                } else {
                    error("$number");
                }
                i++;
                if(toks[i][0] != "close_parens"){
                    error("close_parens");
                }
            }
        } else {
            error("road_element");
        }
        return element;
    }
    
    function road_block(){
        var stmt = [];

        // Parse road elements
        stmt = {
            type: "road",
            identifier: "",
            elements: []
        };
        
        stmt.identifier = parse_token("identifier");
        parse_token("colon");

        var catches = 0;
        
        // Read road elements
        while(true){
            var el = road_element()
            catches += el.catches.length;
            stmt.elements.push(el);
            
            i++;
            
            // Read - or ;
            if(toks[i][0] == "hyphen"){
                // Do nothing
            } else if(toks[i][0] == "semicolon") {
                parse_token("end");
                break;
            } else {
                error("semicolon or hyphen");
            }
        }

        stmt.catches = catches;
        
        return stmt;
    }

    function parse_list(){
        i++;
        var args = [];
        
        while(true){
            if( toks[i][0] == "close_parens" ||
                toks[i][0] == "assignment"){
                break;
            }
            if(toks[i][0] == "comma"){
                i++;
                continue;
            } else if(toks[i][0] == "number") {
                args.push(toks[i]);
            } else if(toks[i][0] == "identifier"){
                args.push(toks[i]);
            } else {
                error("number");
            }
            
            i++;
        }
        
        return args;
    }
    
    /*
      Statements are either
      
      - a function call:
      functionname(3,3)
      - a function call with assignation:
      a, b = functionname(3,3)
      
      Maybe in the future:
      - an expression with assignation
      a = 33 + 4 * sin(x);
    */
    function parse_statement(){
        var end = i;

        var stmt = {
            type: "",
            args: [],
            assigns: []
        };
        
        if(toks[i][0] == "eof"){
            return null;
        }
        
        // Find end
        while(toks[end][0] != "semicolon"){
            if(toks[end][0] == "eof"){
                error("end of statement (semicolon)");
            }
            end++;
        }

        // function call alone
        if( toks[i][0] == "identifier" &&
            toks[i+1][0] == "open_parens" &&
            toks[end-1][0] == "close_parens"){
            stmt.type = "func_call";
            stmt.name = toks[i][1];
            i++;
            stmt.args = parse_list();
        } else if(toks[end-1][0] == "close_parens"){
            i--;
            
            // function call with return assignments
            // find assignment symbol
            var assign = i;
            
            while(true){
                if(assign == end-1){
                    error("assignment operator");
                } else if(toks[assign][0] == "assignment"){
                    break;
                }
                assign++;
            }

            // read assignments
            stmt.assigns = parse_list();
            
            i = assign;
            i++;
            stmt.type = "func_call";
            stmt.name = toks[i][1];
            i++;
            stmt.args = parse_list();
        }

        
        i = end;
        return stmt;
    }
    
    function parse_tokens(){
        var curr_stmt = 0;

        var stmts = [];

        while(i < toks.length && toks[i][0] != "eof"){
            if(toks[i][0] == "road"){
                stmts[curr_stmt] = {
                    type: "road"
                };
                
                stmts[curr_stmt] = road_block();
                
                curr_stmt++;
            } else {
                var stmt = parse_statement();
                if(stmt != null){
                    stmts[curr_stmt] = stmt;
                    curr_stmt++;
                } else {
                    break;
                }
            }

            i++;
        }
        
        return stmts;
    }

    
    return {
        getTokens: function(){
            return toks;
        },
        getStatements: function(){
            return statements;
        },
        eval: function(canvas){
            opencity.eval(statements, canvas);
        }
    }
};

if(typeof module != "undefined"){
    module.exports = opencity;
}


