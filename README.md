# opencity.js
A city definition language I should start implementing soon

# Examples

It could look something like this:

    road normal_road: 
      buildingedge($1)-sidewalk-parkinglane-bikelane-buslane-carlane-middle-carlane-buslane-buildingedge($2);
    end road;
    
    block normal_block:
      $a, $b = normal_road(0.0, 0.0, 1.0, 0.0);
      $c, $d = normal_road(0.0, 1.0, 1.0, 1.0);
      buildings($b,$c);
    end block;
    
    block1(0.0, 1.0);
    
Some Reserved keywords:
 
    road, block, end, busstop, sidewalk, parkinglane, bikelane,
    buslane, middle, carlane, buslane, buildingedge, buildings,
    roundabout
