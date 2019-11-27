class Creature {
    constructor(l, dna_, name_, parents_) {
        this.name = name_;
        this.parents = parents_;
        this.position = l.copy(); // Vector 2
        this.velocity = createVector(); //p5.Vector.random2D();
        this.acceleration = createVector();
        this.health = 200; // Life Timer
        this.xoff = random(1000);
        this.yoff = random(1000);
        this.dna = dna_;
        this.foodtarget = null; // next dinner
        this.reprocucetarget = null; // next mate
        this.maxforce = 0.3;
        this.sextime = 0;
        this.age = 0;
        this.birthtime = worldtime;
        //console.log(this.birthtime);
        this.generation = (parents_ == undefined) ? [1, 1] : [parents_[0].highestgeneration() + 1, parents_[1].highestgeneration() + 1];

        this.maxspeed = map(this.dna.genes[0], 0, 1, 15, 0);
        this.foodsense = (this.dna.genes[1] * 75) + 25; // radious to find food
        this.attraction = (this.dna.genes[2] * 75) + 25; // radious to find mate
        this.repoductionrate = this.dna.genes[3]; // rate to reproduce
        this.eatingrate = this.dna.genes[4]; // rate to eat
        this.reproctioncooldown = (this.dna.genes[5] * 5) + 5; // sex cooldown
        this.lifespan = (this.dna.genes[6] * 100) + 40;
        //console.log("life" + this.lifespan);
        this.r = map(this.dna.genes[0], 0, 1, 0, 50);
        //console.log("New child born");
    }

    oldage() {
        //console.log("Died of old age")
        this.health = -1;
    }

    run(food, mates) {
        this.detectfood(food);
        this.detectmate(mates);
        this.update();
        this.borders();
        this.display();
    }

    oldenough() {
        this.backinthegame();
    }

    reproduce(mate) {
        // sexual reproduction
        //console.log("Reproduce");
        this.reprocucetarget = null;
        this.sextime = this.age;
        mate.sextime = mate.age;
        if (random(1) < 0.25) {
            let name = '';
            if (this.parents != undefined && mate.parents != undefined) {
                name = this.name.substring(0, 2) + this.parents[0].name.charAt(2) + this.parents[1].name.charAt(3) + mate.parents[0].name.charAt(4) + mate.parents[1].name.charAt(5) + mate.name.substring(6, 8);
            }
            else {
                name = this.name.substring(0, 4) + mate.name.substring(4, 8);
            }
            // Child is mix of two parents
            let childDNA = this.dna.copy(mate);
            // Child DNA can mutate
            childDNA.mutate(0.01);
            return new Creature(this.position, childDNA, name, [this, mate]);
        } else {
            return null;
        }
    }

    detectfood(food) {
        if (this.health < 300) {
            var foundfood = false;
            for (let i = food.length - 1; i >= 0; i--) {
                // Calculate distance
                var d = p5.Vector.dist(food[i], this.position);
                // eat if close
                if (d < 10) {
                    this.clamp(this.health += 100, -1, 400);
                    food.splice(i, 1);
                    break;
                }
                // find food
                if (this.foodtarget == null) {
                    var change = random(1);
                    if (d < this.foodsense && (change <= this.eatingrate || this.health < 100)) {
                        this.foodtarget = food[i];
                        foundfood = true;
                        break;
                    }
                }
                else {
                    if (d < this.attraction && this.foodtarget == food[i]) {
                        foundfood = true;
                    }
                }
            }
            if (!foundfood) {
                this.foodtarget = null;
            }
        }
    }

    canreproduce() {
        if (this.age > this.sextime + this.reproctioncooldown) {
            return true;
        }
        return false;
    }

    detectmate(mates) {

        if (this.canreproduce() && this.age > 10 && this.health >= 100) {
            var foundmate = false;
            for (let i = 0; i < mates.length; i++) {
                // can't sex yourself
                if (mates[i] != this && mates[i] != null) {
                    // Calculate distance
                    var d = p5.Vector.dist(mates[i].position, this.position);
                    // reproduce
                    if (d < 10 && mates[i] == this.reprocucetarget) {
                        var baby = this.reproduce(mates[i]);
                        this.reprocucetarget = null;
                        if (baby) {
                            mates.push(baby);
                        }
                        break;
                    }
                    // find mate
                    if (this.reprocucetarget == null) {
                        var change = random(1);
                        if (d < this.attraction && change <= this.repoductionrate && mates[i].canreproduce()) {
                            this.reprocucetarget = mates[i];
                            foundmate = true;
                            break;
                        }
                    }
                    else {
                        if (d < this.attraction && this.reprocucetarget == mates[i]) {
                            foundmate = true;
                        }
                    }
                }
            }
            if (!foundmate) {
                this.reprocucetarget = null;
            }
        }
    }

    // Method to update position
    update() {
        if (this.foodtarget == null && this.reprocucetarget == null) {
            //console.log("moving random");
            this.moverandom();
        }
        if (this.foodtarget != null) {
            //console.log("Found food");
            this.findtarget(this.foodtarget);
        }
        if (this.reprocucetarget != null && this.foodtarget == null) {
            //console.log("Found mate");
            this.findtarget(this.reprocucetarget.position);
        }
        var mouse = createVector(mouseX, mouseY);
        var flee = this.flee(mouse);
        flee.mult(5);
        this.applyforce(flee);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);

        this.health -= 0.2;        
    }

    birthsecond() {
        this.age = worldtime - this.birthtime;
    }

    findtarget(target) {
        var arrive = this.arrive(target);

        arrive.mult(1);

        this.applyforce(arrive);      
    }

    moverandom() {

        // Simple movement based on perlin noise
        let vx = map(noise(this.xoff), 0, 1, -this.maxspeed, this.maxspeed);
        let vy = map(noise(this.yoff), 0, 1, -this.maxspeed, this.maxspeed);
        this.velocity = createVector(vx, vy);
        this.xoff += 0.01;
        this.yoff += 0.01;
    }

    arrive(target) {
        var desired = p5.Vector.sub(target, this.position);
        var d = desired.mag();
        var speed = this.maxspeed;
        if (d < 100) {
            speed = map(d, 0, 100, 0, this.maxspeed);
        }
        desired.setMag(speed);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        return steer;
    }

    flee(target) {
        var desired = p5.Vector.sub(target, this.position);
        var d = desired.mag();
        if (d < 20) {
            desired.setMag(this.maxspeed);
            desired.mult(-1);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    applyforce(f) {
        this.acceleration.add(f);
    }

    // Wraparound
    //borders() {
    //    if (this.position.x < -this.r) this.position.x = width + this.r;
    //    if (this.position.y < -this.r) this.position.y = height + this.r;
    //    if (this.position.x > this.width + this.r) this.position.x = -r;
    //    if (this.position.y > this.height + this.r) this.position.y = -r;
    //}

    borders() {
        if (this.position.x < 0) this.position.x = width;
        if (this.position.y < 0) this.position.y = height;
        if (this.position.x > width) this.position.x = 0;
        if (this.position.y > height) this.position.y = 0;
    }

    // Method to display
    display() {
        ellipseMode(CENTER);
        stroke(0, this.health);
        let c = this.foodtarget != null ? color(255, 0, 0) : this.reprocucetarget != null ? color(0, 0, 255) : 0;
        fill(c, this.health);
        ellipse(this.position.x, this.position.y, 4, 4);
    }

    dead() {
        var deathtime = this.birthtime + this.lifespan;

        if (deathtime < worldtime && deathtime != 0){
            console.log("Died of old age ");
            return true;
        }
        if (this.health < 0.0) {
            return true;
        } else {
            return false;
        }
    }

    clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }

    highestgeneration() {
        return this.generation[0] > this.generation[1] ? this.generation[0] : this.generation[1];
    }
}