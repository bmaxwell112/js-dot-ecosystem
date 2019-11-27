class Food {
    constructor(num) {
        // Start with some food
        this.food = [];
        for (let i = 0; i < num; i++) {
            this.food.push(createVector(random(width), random(height)));
        }
    }

    // Add some food at a location
    add(l) {
        this.food.push(l.copy());
    }

    // Display the food
    run() {
        for (let i = 0; i < this.food.length; i++) {
            let f = this.food[i];
            let c = color(0, 255, 0);
            rectMode(CENTER);
            noStroke();
            fill(c);
            rect(f.x, f.y, 3, 3);
        }

        // There's a small chance food will appear randomly
        if (random(1) < 0.02) {
            this.food.push(createVector(random(width), random(height)));
        }
    }

    // Return the list of food
    getFood() {
        return this.food;
    }
}