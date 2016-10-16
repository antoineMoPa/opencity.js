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

    // Log and throw error
    function error(expected){
	console.log("Expected: "+expected+
		    " but found "+(toks[i][0])+": "+
		    (toks[i][1]));
	var e = new Error();
	console.log(e.stack);
	throw "Parse error";
    }
    
    function identifier(){
	i++;
	if(toks[i][0] == "identifier"){
	    return toks[i][1];
	} else {
	    error("identifier");
	}
    }
    
    function colon(){
        i++;
	if(toks[i][0] == "colon"){
	    return toks[i][1];
	} else {
	    error("colon");
	}
    }

    function end(){
	i++;
	if(toks[i][0] == "end"){
	    return toks[i][1];
	} else {
	    error("end");
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
            } else if(toks[i][0] == "open_parens") {
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
	
	stmt.identifier = identifier();
	colon();
	
	// Read road elements
        while(true){
            stmt.elements.push(road_element());
	    i++;
	    
	    // Read - or ;
	    if(toks[i][0] == "hyphen"){
		// Do nothing
	    } else if(toks[i][0] == "semicolon") {
		end();
		break;
	    } else {
		error("semicolon or hyphen");
	    }
        }
	
        return stmt;
    }

    function parse_until_token(until){
        var curr_stmt = 0;

        var stmts = [];

        while(i < toks.length && toks[i][0] != until){
            if(toks[i][0] == "road"){
                stmts[curr_stmt] = {
                    type: "road"
                };
		
                stmts[curr_stmt] = road_block();
                
                curr_stmt++;
            } else {
		error(until);
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


