class Particle {
  PVector pos;
  PVector vel;
  color col;
  float life;
  float maxLife;
  float size;
  boolean isDark;

  Particle(float x, float y, color c, boolean dark) {
    pos = new PVector(x, y);
    vel = new PVector(random(-0.5, 0.5), random(-1.5, -0.5));
    col = c;
    isDark = dark;
    maxLife = random(180, 300);
    life = maxLife;
    size = random(20, 50);
  }

  void update() {
    pos.add(vel);
    vel.x += random(-0.05, 0.05);
    vel.y *= 0.995;
    life--;
  }

  void display() {
    float alpha = map(life, 0, maxLife, 0, 100);
    noStroke();
    fill(red(col), green(col), blue(col), alpha);
    ellipse(pos.x, pos.y, size, size);
  }

  boolean isDead() {
    return life <= 0;
  }
}
