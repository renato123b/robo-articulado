var robotX = 400;
var robotY = 400;

var waveSpeed = 0.12;   // velocidade
var waveAmp   = 0.35;   // amplitude
function setup() {
  createCanvas(520, 400);
  strokeWeight(2);
  ellipseMode(RADIUS);
  robotX = width/2 - 150;
  robotY = height/2 - 20;
}

function draw() {
  background(145, 19, 132);

  // retângulo da cabeça
  fill(200); stroke(40);
  rect(robotX + 5, robotY - 60, 70, 50); // head

  // olhos e boca simples
  noStroke();
  fill(20);
  ellipse(robotX + 25, robotY - 40, 4, 4); // olho esquerdo
  
  ellipse(robotX + 55, robotY - 40, 4, 4); // olho direito
  noFill(); stroke(20);
  arc(robotX + 40, robotY - 32, 18, 10, 0, PI); // sorriso

  //Pescoço 
  fill(180); noStroke();
  rect(robotX + 32, robotY - 10, 15, 10);

  //Tronco
  fill(100); stroke(40);
  rect(robotX + 10, robotY, 60, 35, 4);

  
  // ombro esquerdo relativo ao tronco
  let leftShoulderX = robotX + 8;
  let leftShoulderY = robotY + 8;

  stroke(60); strokeWeight(6);
  // braço esquerdo simples 
  line(leftShoulderX, leftShoulderY, leftShoulderX - 20, leftShoulderY + 18);
  
  // mão esquerda
  noStroke(); fill(230);
  ellipse(leftShoulderX - 22, leftShoulderY + 20, 4, 4);


  // ombro direito 
  let rightShoulderX = robotX + 72;     // encostado na lateral direita da cabeça
  let rightShoulderY = robotY + 15;     // mais ou menos no meio da cabeça

  // Comprimento dos segmentos do braço
  let upperLen = 24;   // braço 
  let lowerLen = 22;   // antebraço

  // Ângulo fixo do braço levantado (apontando ~45° para cima)
  let upperAngle = radians(-55);

  // O antebraço balança em torno do "cotovelo"
  let wave = sin(frameCount * waveSpeed) * waveAmp;

  // Desenhar braço direito com duas partes usando transformações
  push();
  translate(rightShoulderX, rightShoulderY);

  // Segmento superior (úmero)
  stroke(60); strokeWeight(6);
  push();
  rotate(upperAngle);
  line(0, 0, upperLen, 0);

  // Cotovelo é o fim do segmento superior
  translate(upperLen, 0);

  // Segmento inferior (antebraço) rotaciona em torno do cotovelo
  rotate(wave);
  line(0, 0, lowerLen, 0);

  // Mão circulo
  noStroke(); fill(230);
  ellipse(lowerLen, 0, 4, 4);

  // dedos mão
  stroke(230); strokeWeight(2);
  line(lowerLen, 0, lowerLen + 6, -6);
  line(lowerLen, 0, lowerLen + 6,  0);
  line(lowerLen, 0, lowerLen + 6,  6);

  pop(); // fecha segmento superior
  pop(); // fecha braço

  //  Antena simples no topo da cabeça 
  let antennaBaseX = robotX + 40;
  let antennaBaseY = robotY - 60;
  stroke(80); strokeWeight(2);
  line(antennaBaseX, antennaBaseY, antennaBaseX, antennaBaseY - 12);
  noStroke(); fill(255, 80, 80);
  ellipse(antennaBaseX, antennaBaseY - 14, 3, 3);
}
