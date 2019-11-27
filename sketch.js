// Evolution EcoSystem
// Daniel Shiffman <http://www.shiffman.net>
// The Nature of Code

// A World of creatures that eat food
// The more they eat, the longer they survive
// The longer they survive, the more likely they are to reproduce
// The bigger they are, the easier it is to land on food
// The bigger they are, the slower they are to find food
// When the creatures die, food is left behind


let world;
let worldtime = 0;
var currentgen;
var creatures;


function setup() {
  currentgen = 1;
  creatures = [];
  createCanvas(640, 360);
  frameRate(30);
  // World starts with 20 creatures
  // and 20 pieces of food
  world = new World(50);
  stats = createP("Stats");
  setInterval(increasetime, 1000);
}

function draw() {
  background(175);
  world.run();
  this.displayInfo();
}



// We can add a creature manually if we so desire
function mousePressed() {
  //world.born(mouseX, mouseY);
}

function mouseDragged() {
  //world.born(mouseX, mouseY);
}

function displayInfo() {
  // Display current status of population
  // let answer = population.getBest();

  // bestPhrase.html("Best phrase:<br>" + answer);
  creatures = world.creatures;
  for (let i = 0; i < creatures.length; i++) {
    if (creatures[i].highestgeneration() > currentgen) {
      currentgen = creatures[i].highestgeneration();
    }
  }
  let statstext = "<h3>Living creatures (Total: " + creatures.length + " | Latest Gen: " + currentgen + ")</h3>";
  statstext += "Runtime: " + gettime() + "<br>";

  for (let i = 0; i < creatures.length; i++) {
    statstext += "<h4>" + creatures[i].name + "</h4>";
    statstext += "Speed: " + Math.round(creatures[i].maxspeed) + " | Health: " + Math.round(creatures[i].health) + "<br>";
    statstext += "Can procreate: " + (creatures[i].canreproduce() ? "yes" : "no") + " | ";
    statstext += "Food Sense: " + Math.round(creatures[i].foodsense) + " | ";
    statstext += "Mate Sense: " + Math.round(creatures[i].attraction) + "<br>";
    statstext += "Eating Rate: " + Math.round(creatures[i].eatingrate * 100) + "% | ";
    statstext += "Reproduction Rate: " + Math.round(creatures[i].repoductionrate * 100) + "% | ";
    statstext += "Reproduction Cooldown: " + Math.round(creatures[i].reproctioncooldown) + " seconds<br>";
    statstext += "Lifespan: " + Math.round(creatures[i].lifespan) + " seconds<br>";
    statstext += "Age: " + Math.round(creatures[i].age) + " seconds<br>";
    statstext += "Parents: " + (creatures[i].parents == undefined ? "None" : creatures[i].parents[0].name + " & " + creatures[i].parents[1].name) + "<br>";
    statstext += "Generation: " + creatures[i].highestgeneration() + "<br>";
  }

  stats.html(statstext);
}

function increasetime() {
  if (creatures.length > 0) {
    worldtime += 1;
    for (let i = 0; i < creatures.length; i++) {
      creatures[i].birthsecond();
    }
  }
}

function gettime() {
  var totalseconds = worldtime;
  var minutes = Math.floor(totalseconds / 60);
  var seconds = totalseconds - (minutes * 60);
  var runtime = '';
  runtime = minutes + ":" + (Math.floor(seconds) > 9 ? Math.floor(seconds) : "0" + Math.floor(seconds));
  return runtime;
}