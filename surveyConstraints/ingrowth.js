// tag
(function() { if (data('tag')==2){return true;} alert('Fix Tag Number'); return false;})()
// crown ratio
(function() { if (data('crown_ratio') <= 100  && data('crown_ratio') >=1){return true;} alert('Crown Ratio Needs to be Fixed'); return false;})()
// lean angle
(function() { if (data('lean_angle') <= 120  && data('lean_angle') >=0){return true;} alert('Lean Angle Needs to be Fixed'); return false;})()
// crown percentage
(function() { if (data('crown_percentage') <= 100  && data('crown_percentage') >=0){return true;} alert('Crown Ratio Needs to be Fixed'); return false;})()
// tree percentage
(function() { if (data('tree_percentage') <= 100  && data('tree_percentage') >=0){return true;} alert('Tree Percentage Needs to be Fixed'); return false;})()
// distance
(function() { if (data('distance') <= 25.0  && data('distance') >=0.1){return true;} alert('Distance Needs to be Fixed'); return false;})()
// azimuth
(function() { if (data('azimuth') <= 360  && data('azimuth') >=0){return true;} alert('Azimuth Range needs to be fixed'); return false;})()
