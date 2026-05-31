import TUIO.*;

TuioProcessing tuioClient;
JSONObject userData;
ArrayList<Particle> particles;
PFont titleFont, bodyFont, bigFont;

int currentMarkerId = -1;
float phoneX = 0, phoneY = 0;
boolean newPhoneDetected = false;
float newPhoneX = 0, newPhoneY = 0;

color BG        = color(4, 52, 44);
color ACCENT    = color(29, 158, 117);
color ACCENT_L  = color(93, 202, 165);
color TEXT_P    = color(225, 245, 238);
color TEXT_S    = color(159, 225, 203);
color WARNING   = color(239, 159, 39);
color WARNING_L = color(250, 199, 117);

final int MARKER_NEW_PHONE   = 89;
final int MARKER_RECYCLE     = 102;
final int MARKER_SECOND_HAND = 67;

void setup() {
  size(1920, 1080);
  smooth(8);
  tuioClient = new TuioProcessing(this);
  particles = new ArrayList<Particle>();
  titleFont = createFont("Helvetica", 56);
  bodyFont  = createFont("Helvetica", 22);
  bigFont   = createFont("Helvetica-Bold", 180);
  loadUserData();
}

void draw() {
  background(BG);

  if (frameCount % 60 == 0) loadUserData();

  ArrayList<TuioObject> objects = tuioClient.getTuioObjectList();

  currentMarkerId = -1;
  newPhoneDetected = false;

  for (TuioObject obj : objects) {
    int id = obj.getSymbolID();
    float x = obj.getScreenX(width);
    float y = obj.getScreenY(height);

    if (id == MARKER_NEW_PHONE) {
      newPhoneDetected = true;
      newPhoneX = x;
      newPhoneY = y;
    } else {
      currentMarkerId = id;
      phoneX = lerp(phoneX, x, 0.15);
      phoneY = lerp(phoneY, y, 0.15);
    }
  }

  if (currentMarkerId >= 0 && userData != null) {
    drawPhoneSilhouette(phoneX, phoneY);
    spawnCloudParticles(phoneX, phoneY);

    if (newPhoneDetected) {
      float d = dist(phoneX, phoneY, newPhoneX, newPhoneY);
      float proximity = constrain(map(d, 100, 600, 1, 0), 0, 1);
      if (proximity > 0.1) {
        spawnDarkCloudParticles(newPhoneX, newPhoneY, proximity);
      }
    }

    drawAllParticles();
    drawHUD();
  } else {
    drawInstructionScreen();
  }
}

void loadUserData() {
  try {
    // Adjust path if needed: sketch is at processing-sketch/VidaUtilSketch/
    // data/ is at ../../data/state.json from the sketch file
    userData = loadJSONObject(sketchPath("../../data/state.json"));
  } catch (Exception e) {
    userData = null;
  }
}

void drawPhoneSilhouette(float x, float y) {
  pushMatrix();
  translate(x, y);
  noFill();
  stroke(TEXT_P);
  strokeWeight(3);
  rect(-60, -110, 120, 220, 18);
  noStroke();
  fill(BG);
  rect(-52, -100, 104, 195, 8);
  fill(ACCENT_L);
  ellipse(-15, -90, 6, 6);
  fill(TEXT_S);
  rect(-15, -90, 30, 2, 1);
  popMatrix();
}

void spawnCloudParticles(float x, float y) {
  float footprint = (userData != null && userData.hasKey("annualFootprint"))
    ? userData.getFloat("annualFootprint") : 20;
  int n = (int) map(footprint, 10, 50, 1, 4);
  for (int i = 0; i < n; i++) {
    float offsetX = random(-30, 30);
    float startY = y - 110 + random(-10, 10);
    particles.add(new Particle(x + offsetX, startY, ACCENT_L, false));
  }
  // Limit particle count
  while (particles.size() > 300) particles.remove(0);
}

void spawnDarkCloudParticles(float x, float y, float intensity) {
  int n = (int) (intensity * 5);
  for (int i = 0; i < n; i++) {
    float offsetX = random(-25, 25);
    particles.add(new Particle(x + offsetX, y - 80, WARNING, true));
  }
  while (particles.size() > 400) particles.remove(0);
}

void drawAllParticles() {
  for (int i = particles.size() - 1; i >= 0; i--) {
    Particle p = particles.get(i);
    p.update();
    p.display();
    if (p.isDead()) particles.remove(i);
  }
}

void drawHUD() {
  if (userData == null) return;

  int avoidedCO2 = userData.getInt("totalAvoidedCO2");
  String medal = userData.getString("medal");
  String phoneModel = userData.getString("phoneModel");
  int years = userData.getInt("yearsOfUse");

  textFont(bodyFont);
  fill(TEXT_S);
  textAlign(LEFT, TOP);
  text("TU HUELLA", 60, 50);

  textFont(titleFont);
  fill(TEXT_P);
  text(phoneModel, 60, 90);

  textFont(bodyFont);
  fill(TEXT_S);
  text(years + " años contigo  ·  medalla " + medal, 60, 160);

  textFont(bigFont);
  fill(ACCENT_L);
  textAlign(RIGHT, BOTTOM);
  text(avoidedCO2, width - 60, height - 100);

  textFont(bodyFont);
  fill(TEXT_S);
  textAlign(RIGHT, BOTTOM);
  text("kg de CO₂ no emitidos", width - 60, height - 60);

  if (newPhoneDetected) {
    int cost = userData.getInt("costOfChangeNow");
    textAlign(CENTER, TOP);
    textFont(titleFont);
    fill(WARNING);
    text("+" + cost + " kg si cambias ahora", width / 2, 60);
  }
}

void drawInstructionScreen() {
  textAlign(CENTER, CENTER);
  textFont(titleFont);
  fill(TEXT_P);
  text("VidaÚtil", width / 2, height / 2 - 60);
  textFont(bodyFont);
  fill(TEXT_S);
  text("Apunta tu código a la cámara", width / 2, height / 2 + 20);
}

void addTuioObject(TuioObject tobj) {}
void removeTuioObject(TuioObject tobj) {}
void updateTuioObject(TuioObject tobj) {}
void addTuioCursor(TuioCursor tcur) {}
void removeTuioCursor(TuioCursor tcur) {}
void updateTuioCursor(TuioCursor tcur) {}
void addTuioBlob(TuioBlob tblb) {}
void removeTuioBlob(TuioBlob tblb) {}
void updateTuioBlob(TuioBlob tblb) {}
void refresh(TuioTime bundleTime) {}
