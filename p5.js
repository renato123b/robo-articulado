let pos;        // posição do robô (p5.Vector)
let vel;        // velocidade do robô (p5.Vector)
let facing = 1; // 1 = direita, -1 = esquerda (espelhamento)
let t0;         // tempo inicial

function setup() {
  createCanvas(900, 520);
  angleMode(RADIANS);
  rectMode(CENTER);
  noStroke();

  pos = createVector(width * 0.2, height * 0.75); // começa à esquerda, no "chão"
  vel = createVector(1.5, 0);                      // velocidade horizontal
  t0 = millis();
}

function draw() {
  drawSunsetSky();
  drawGround();

  // Tempo contínuo em segundos
  const t = (millis() - t0) / 1000;

  // Movimento lateral + leve "quique" vertical
  const walkCadence = 2.0;
  const step = sin(TWO_PI * walkCadence * t);
  const bob  = abs(step) * 6;
  pos.add(vel);
  pos.y = height * 0.75 - bob;

  // Limites de tela e mudança de direção
  if (pos.x > width - 100) {
    vel.x = -abs(vel.x);
    facing = -1;
  } else if (pos.x < 100) {
    vel.x = abs(vel.x);
    facing = 1;
  }

  // --- Pernas (caminhada) ---
  const hipAmp   = radians(28);
  const kneeAmp  = radians(22);
  const phase = TWO_PI * walkCadence * t;

  const hipR   =  hipAmp * sin(phase);
  const kneeR  =  kneeAmp * max(0, -sin(phase + 0.2));
  const hipL   = -hipAmp * sin(phase);
  const kneeL  =  kneeAmp * max(0, -sin(phase + PI + 0.2));

  // --- Braços BALANÇANDO ---
  const armAmp   = radians(35);   // amplitude do ombro
  const elbowAmp = radians(15);   // leve flexão do cotovelo
  const shoulderR =  armAmp * sin(phase + PI); // contra-fase com perna direita
  const shoulderL = -armAmp * sin(phase + PI); // simétrico
  const elbowR    =  elbowAmp * sin(phase + 0.3);
  const elbowL    =  elbowAmp * sin(phase + PI + 0.3);

  // Desenho do robô
  push();
  translate(pos.x, pos.y);
  scale(facing, 1);

  drawRobot({
    torsoH: 90,
    torsoW: 60,
    neckH:  16,
    headW:  56,
    headH:  56,  // cabeça redonda (mesma largura/altura)
    upperArm: 48,
    lowerArm: 42,
    upperLeg: 56,
    lowerLeg: 50,
    shoulderR, elbowR,
    shoulderL, elbowL,
    hipR, kneeR,
    hipL, kneeL
  });

  pop();

}

function drawGround() {
  // Chão
  fill(44, 150, 105);
  rect(width/2, height*0.82 + 36, width, 120);
}

// Céu alaranjado em degradê + sol
function drawSunsetSky() {
  // Degradê vertical (topo → base)
  const top = color(255, 140, 60);   // laranja
  const mid = color(255, 95, 70);    // laranja-rosado
  const bot = color(90, 40, 80);     // roxo escuro (horizonte)

  for (let y = 0; y < height; y++) {
    let c;
    const p = y / height;
    if (p < 0.6) {
      c = lerpColor(top, mid, map(p, 0, 0.6, 0, 1));
    } else {
      c = lerpColor(mid, bot, map(p, 0.6, 1, 0, 1));
    }
    stroke(c);
    line(0, y, width, y);
  }
  noStroke();

  // Sol no horizonte
  const sx = width * 0.15;
  const sy = height * 0.78;
  for (let r = 140; r >= 60; r -= 12) {
    fill(255, 200, 90, map(r, 60, 140, 160, 20));
    ellipse(sx, sy, r, r);
  }
  fill(255, 220, 120);
  ellipse(sx, sy, 70, 70);
}

// Desenha o robô com hierarquia de transformações
function drawRobot(cfg) {
  // Paleta vermelho-vinho
  const cTorso = color(120, 20, 35);  // vinho escuro
  const cJoint = color(230, 210, 90); // juntas
  const cLimb  = color(170, 30, 60);  // vinho claro
  const cDark  = color(50, 12, 20);   // escuro

  push();

  // Ancoragem nos pés → subir ao quadril
  const hipY = -cfg.lowerLeg - cfg.upperLeg;
  translate(0, hipY);

  // Torso
  push();
  fill(cTorso);
  rect(0, -cfg.torsoH/2, cfg.torsoW, cfg.torsoH, 10);

  // Pescoço
  push();
  translate(0, -cfg.torsoH/2);
  fill(cDark);
  rect(0, -cfg.neckH/2, 10, cfg.neckH, 3);
  translate(0, -cfg.neckH);
  fill(240);
  ellipse(0, -cfg.headH/2 + cfg.headH/2, cfg.headW, cfg.headH); // cabeça circular

  // Olhos
  fill(255, 80, 95);
  ellipse(-12, -cfg.headH/4, 12, 8);
  ellipse( 12, -cfg.headH/4, 12, 8);

  // “boca”/visor
  fill(80, 20, 30);
  rect(0, 0, cfg.headW * 0.55, 8, 3);
  pop();

  // Ombro direito
  push();
  translate(cfg.torsoW/2, -cfg.torsoH/2 + 10);
  drawArm(cfg.upperArm, cfg.lowerArm, cfg.shoulderR, cfg.elbowR, cJoint, cLimb);
  pop();

  // Ombro esquerdo
  push();
  translate(-cfg.torsoW/2, -cfg.torsoH/2 + 10);
  scale(-1, 1);
  drawArm(cfg.upperArm, cfg.lowerArm, cfg.shoulderL, cfg.elbowL, cJoint, cLimb);
  pop();

  pop(); // fim torso

  // Pernas
  push();
  translate(cfg.torsoW/3, 0);
  drawLeg(cfg.upperLeg, cfg.lowerLeg, cfg.hipR, cfg.kneeR, cJoint, cLimb);
  pop();

  push();
  translate(-cfg.torsoW/3, 0);
  drawLeg(cfg.upperLeg, cfg.lowerLeg, cfg.hipL, cfg.kneeL, cJoint, cLimb);
  pop();

  pop();
}

function drawArm(upperLen, lowerLen, shoulderAngle, elbowAngle, cJoint, cLimb) {
  fill(cJoint);
  ellipse(0, 0, 14, 14);

  push();
  rotate(shoulderAngle);
  fill(cLimb);
  rect(0, upperLen/2, 16, upperLen, 6);

  translate(0, upperLen);
  fill(cJoint);
  ellipse(0, 0, 12, 12);

  push();
  rotate(elbowAngle);
  fill(cLimb);
  rect(0, lowerLen/2, 14, lowerLen, 6);

  translate(0, lowerLen);
  fill(240);
  rect(0, 6, 18, 12, 4);
  pop();
  pop();
}

function drawLeg(upperLen, lowerLen, hipAngle, kneeAngle, cJoint, cLimb) {
  fill(cJoint);
  ellipse(0, 0, 16, 16);

  push();
  rotate(hipAngle);
  fill(cLimb);
  rect(0, upperLen/2, 18, upperLen, 6);

  translate(0, upperLen);
  fill(cJoint);
  ellipse(0, 0, 12, 12);

  push();
  rotate(kneeAngle);
  fill(cLimb);
  rect(0, lowerLen/2, 16, lowerLen, 6);

  translate(0, lowerLen);
  fill(240);
  rect(10, 6, 36, 12, 4);
  pop();
  pop();
}

// Espaço = pausa/retoma
let paused = false;
function keyPressed() {
  if (key === ' ') {
    if (!paused) { noLoop(); paused = true; }
    else         { loop();   paused = false; }
  }
}
