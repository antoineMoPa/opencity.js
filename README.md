# opencity.js
A city definition language. Its purpose will be to procedurally generate road networks, highways, etc. It could be used in web based games to generate maps.

# Examples

It could look something like this:

    road normal_road: 
      buildingedge($1)-sidewalk-parkinglane-bikelane-buslane-carlane-middle-carlane-buslane-buildingedge($2);
    end;
    
    block normal_block:
      a, b = normal_road(0.0, 0.0, 1.0, 0.0);
      c, d = normal_road(0.0, 1.0, 1.0, 1.0);
      buildings(b,c);
    end
    
    block1(0.0, 1.0);
    
Some Reserved keywords:
 
    road, block, end, busstop, sidewalk, parkinglane, bikelane,
    buslane, middle, carlane, buslane, buildingedge, buildings,
    roundabout

# Development

Currently, thanks to a weekend of work, there is a tokenizer and a simple parser for road definitions and function calls. The next step will be to build the interpreter that will go through the statements and eventually draw the road network to a `<canvas>` element.

## Tests

Run tests by opening `test/index.html` or by running `test/test.js` in node/other.
