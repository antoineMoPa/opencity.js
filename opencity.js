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

opencity.parse = function(str){
    var toks = opencity.tokenize(str, false);

    var statements = [];

    var i = 0;

    statements = parse_until_token("eof");
    
    function road_element(){
        var curr_stmt = 0;
        var stmts = [];
        //console.log(toks,i);
        while(i < toks.length){
            if(toks[i][0] == "road_element"){
                stmts[curr_stmt] = {};
                stmts[curr_stmt].type = toks[i][1];
                stmts[curr_stmt].catches = [];

                i++;
                
                if(toks[i][0] == "semicolon"){
                    i--;
                    return stmts;
                } else if(toks[i][0] == "open_parens") {
                    // Now we expect a $number and a close_parens
                    i++;
                    if(toks[i][0] == "$number"){
                        stmts[curr_stmt].catches
                            .push(toks[i][1]);
                    } else {
                        console.log("expected $number not found");
                        throw "Parse error";
                    }
                    i++;
                    if(toks[i][0] != "close_parens"){
                        console.log(
                            "expected close_parens not found"
                        );
                        throw "Parse error";
                    }
                }
            } else {
                console.log("expected road_element not found");
                throw "Parse error";
            }
        }
    }
    
    function road_block(){
        var curr_stmt = 0;
        
        var stmts = [];

        while(i < toks.length && toks[i][0] != "end"){
            stmts[curr_stmt] = {
                type: "road",
                elements: []
            };
            
            do {
                i++;
                stmts[curr_stmt].elements
                    .push(road_element());
            } while (toks[i][0] != "semicolon");
            
            curr_stmt++;
            
            i++;
        }
        
        return stmts;
    }

    function parse_until_token(until){
        var curr_stmt = 0;

        var stmts = [];

        while(i < toks.length && toks[i][0] != until){
            if(toks[i][0] == "road"){
                stmts[curr_stmt] = {
                    type: "road"
                };

                stmts[curr_stmt].elements = road_block();
                
                curr_stmt++;
            } else {
                console.log("expected '"+until+"' not found.");
                throw "Parse error";
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
        }
    }
};

if(typeof module != "undefined"){
    module.exports = opencity;
}


