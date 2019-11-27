
class DNA {
  constructor(newgenes) {
    if (newgenes) {
      this.genes = newgenes;
    } else {
      // The genetic sequence
      // DNA is random floating point values between 0 and 1 (!!)
      // Speed
      // Food Sense Range
      // attraction range
      // reproduction rate
      // food rate
      // reproduction cooldown
      // natural lifespan
      this.genes = new Array(7);
      for (let i = 0; i < this.genes.length; i++) {
        this.genes[i] = random(0, 1);
      }
    }
  }

  copy(mate) {
    // should switch to fancy JS array copy
    let newgenes = [];
    for (let i = 0; i < this.genes.length; i++) {
      if (mate) {
        var chance = random(1);
        if (chance <= 0.5) {
          newgenes[i] = this.genes[i];
        }
        else {
          newgenes[i] = mate.dna.genes[i];
        }
      } else {
        newgenes[i] = this.genes[i];
      }
    }

    return new DNA(newgenes);
  }

  // Based on a mutation probability, picks a new random character in array spots
  mutate(m) {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < m) {
        this.genes[i] = random(0, 1);
      }
    }
  }
}