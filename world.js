

// Constructor
class World {  
  constructor(num) {
    // Start with initial food and creatures
    this.food = new Food(num);
    this.creatures = []; // An array for all creatures  
    this.names = ["Abdullah", "Achilles", "Adolphus", "Alexande", "Alistair", "Alphonse", "Anderson", "Anthoney", "Augustin", "Beatrice", "Benjaman", "Benjamin", "Bernardo", "Bertrand", "Brantlee", "Brentley", "Burdette", "Campbell", "Carlisle", "Casimiro", "Chadwick", "Chandler", "Charlton", "Cheyenne", "Clarance", "Claudius", "Clemente", "Columbus", "Courtney", "Cristian", "Damarcus", "Danielle", "Deforest", "Demarion", "Devaughn", "Dionicio", "Domenico", "Ebenezer", "Eldridge", "Emiliano", "Epifanio", "Everette", "Faustino", "Fernando", "Fielding", "Fitzhugh", "Florence", "Franklyn", "Fredrick", "Garrison", "Geovanni", "Germaine", "Gianluca", "Giovanni", "Giuseppe", "Gottlieb", "Grayling", "Gregorio", "Guilford", "Hamilton", "Harrison", "Herschel", "Hezekiah", "Humberto", "Ignatius", "Jamarcus", "Jedediah", "Jefferey", "Jennings", "Jeremiah", "Jerimiah", "Johathan", "Jonathan", "Joseluis", "Kathleen", "Kenyatta", "Kimberly", "Kingston", "Ladarius", "Langston", "Laurence", "Lawrence", "Leonardo", "Leopoldo", "Marcello", "Matthias", "Maverick", "Mckinley", "Menachem", "Michelle", "Mohammad", "Montrell", "Muhammad", "Nehemiah", "Nicklaus", "Norberto", "Percival", "Pleasant", "Prentice", "Randolph", "Raymundo", "Reginald", "Reinhold", "Reynolds", "Roderick", "Salvador", "Santiago", "Shedrick", "Sheridan", "Sherwood", "Stafford", "Starling", "Sullivan", "Talmadge", "Terrance", "Thaddeus", "Theadore", "Thompson", "Thorwald", "Timmothy", "Torrence", "Tremayne", "Tristian", "Valentin", "Virginia", "Wilfredo", "Williard", "Winifred", "Lissette", "Louvenia", "Madaline", "Madeline", "Magdalen", "Malissie", "Marcelle", "Marianna", "Marietta", "Marleigh", "Maryjane", "Mckenzie", "Mellissa", "Michaela", "Milagros", "Nathalia", "Patience", "Pearlene", "Phylicia", "Priscila", "Richelle", "Rosamond", "Ruthanne", "Scarlett", "Sharonda", "Sherilyn", "Stefanie", "Susannah", "Tennille", "Treasure", "Vernetta", "Violetta", "Winifred", "Yessenia"];
    for (let i = 0; i < num; i++) {
      let l = createVector(random(width), random(height));
      let dna = new DNA();

      let name = this.makeid();
      this.creatures.push(new Creature(l, dna, name));
    }
  }

  makeid() {
    var r = Math.floor(random(this.names.length - 1));    
    var result = this.names[r].toLowerCase();
    console.log(result);
    return result;
  }

  // Make a new creature
  born(x, y) {
    let l = createVector(x, y);
    let dna = new DNA();
    let name = this.makeid(8);
    console.log(name);
    this.creatures.push(new Creature(l, dna, name));
  }

  // Run the world
  run() {
    // Deal with food
    //console.log(this.creatures);
    this.food.run();

    // Cycle through the ArrayList backwards b/c we are deleting
    for (let i = this.creatures.length - 1; i >= 0; i--) {
      // All creatures run, seek and eat
      let b = this.creatures[i];
      b.run(this.food.food, this.creatures);
      // If it's dead, kill it and make food
      if (b.dead()) {
        this.creatures.splice(i, 1);
        this.food.add(b.position);
      }
    }
  }
}