let characters = []; // Array for multiple characters
let platforms = []; // Array for multiple platforms
let upperPlatformWidth = 150; // Adjustable width for the upper platform
let mirroredPlatformWidth = 150;
let levelWidth = 1200; // Width of the entire level
let levelHeight = 10; // Height of the level
let keys = {}; // Define keys state
let bubbleOffset = 50; // Distance of bubble from character
let miniScreenDiameter = 100; // Size of the bubble
let bubbleYOffset = 40; // Variblen som justere på boblens højde på y-aksen
let playerRightImgs = []; // Array for the character moving right animation frames
let playerLeftImgs = []; // Array for the character moving left animation frames
let animationSpeed = 5; // Animation speed
let frameCounter = 0; // To control frame rate for animation

function preload() {
  // Load right movement frames
  playerRightImgs.push(loadImage('Player1.png'));
  playerRightImgs.push(loadImage('Player2.png'));
  playerRightImgs.push(loadImage('Player3.png'));

  // Load left movement frames
  playerLeftImgs.push(loadImage('Mirror1.png'));
  playerLeftImgs.push(loadImage('Mirror2.png'));
  playerLeftImgs.push(loadImage('Mirror3.png'));
}

function setup() {
  createCanvas(2000, 900);
  
  // Define the first character
  let character1 = {
    x: 500,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    gravity: 0.6,
    velocityY: 0,
    jumping: false,
    jumpForce: -15,
    canFallThrough: false, // Individual state for fall through
    movingLeft: false, // Track if moving left
    movingRight: false, // Track if moving right
    lastDirection: "right", // Track the last movement direction
    animationFrame: 0 // Track the current animation frame
  };
  
  // Define the second character with a different initial position
  let character2 = {
    x: 800,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    gravity: 0.6,
    velocityY: 0,
    jumping: false,
    jumpForce: -15,
    canFallThrough: false,
    movingLeft: false,
    movingRight: false,
    lastDirection: "right",
    animationFrame: 0
  };
  
  characters.push(character1); // Add the first character to the array
  characters.push(character2); // Add the second character to the array

  platforms.push({ x: 500, y: 450, width: 900, height: 150, color: [92,64,47]}); // Bottom platform
  platforms.push({ x: 0, y: 700, width: 2000, height: 200, color: [173,216,230]}); // Bottom platform
  platforms.push({ x: 650, y: 270, width: upperPlatformWidth, height: 20, color: [90,90,90] });
  platforms.push({ x: width - 750 - mirroredPlatformWidth, y: 270, width: mirroredPlatformWidth, height: 20, color: [90,90,90] });
  platforms.push({ x: 800, y: 150, width: 300, height: 20, color: [90,90,90] });
}

function draw() {
  background(200);
  
  // Handle character movement
  handleMovement();
  
  // Display platforms
  for (let platform of platforms) {
    fill(platform.color);
    rect(platform.x, platform.y, platform.width, platform.height);
  }
  
  // Update and display both characters
  for (let character of characters) {
    updateCharacter(character);
    displayCharacter(character);
    displayMiniScreen(character); // Show bubble if character is out of bounds
  }
}

function handleMovement() {
  // Frame control for animation
  frameCounter++;
  if (frameCounter >= animationSpeed) {
    for (let character of characters) {
      if (character.movingLeft || character.movingRight) {
        character.animationFrame = (character.animationFrame + 1) % playerRightImgs.length;
      }
    }
    frameCounter = 0;
  }

  // First character (WASD)
  if (keys[65]) { // 'A' key for moving left
    characters[0].x -= characters[0].speed;
    characters[0].movingLeft = true;
    characters[0].movingRight = false;
    characters[0].lastDirection = "left";
  } else if (keys[68]) { // 'D' key for moving right
    characters[0].x += characters[0].speed;
    characters[0].movingRight = true;
    characters[0].movingLeft = false;
    characters[0].lastDirection = "right";
  } else {
    characters[0].movingLeft = false;
    characters[0].movingRight = false;
  }

  if (keys[87] && !characters[0].jumping) { // 'W' key for jumping
    characters[0].velocityY += characters[0].jumpForce;
    characters[0].jumping = true;
  }

  // Second character (Arrow keys)
  if (keys[LEFT_ARROW]) { // Left arrow for moving left
    characters[1].x -= characters[1].speed;
    characters[1].movingLeft = true;
    characters[1].movingRight = false;
    characters[1].lastDirection = "left";
  } else if (keys[RIGHT_ARROW]) { // Right arrow for moving right
    characters[1].x += characters[1].speed;
    characters[1].movingRight = true;
    characters[1].movingLeft = false;
    characters[1].lastDirection = "right";
  } else {
    characters[1].movingLeft = false;
    characters[1].movingRight = false;
  }

  if (keys[UP_ARROW] && !characters[1].jumping) { // Jump
    characters[1].velocityY += characters[1].jumpForce;
    characters[1].jumping = true;
  }

  // Fall-through logic
  characters[0].canFallThrough = keys[83]; // 'S' key
  characters[1].canFallThrough = keys[DOWN_ARROW]; // Down arrow
}

function updateCharacter(character) {
  character.velocityY += character.gravity;
  character.y += character.velocityY;

  // Check collision with platforms
  for (let platform of platforms) {
    if (!character.canFallThrough &&
        character.y + character.height >= platform.y && 
        character.y + character.height <= platform.y + platform.height && 
        character.x + character.width > platform.x && 
        character.x < platform.x + platform.width) {
      
      character.y = platform.y - character.height;
      character.velocityY = 0;
      character.jumping = false;
    }
  }

  // Prevent falling off the canvas
  if (character.y > height) {
    character.y = height;
    character.velocityY = 0;
  }
}

function displayCharacter(character) {
  let img;

  if (character.movingLeft) {
    img = playerLeftImgs[character.animationFrame]; // Use left movement frames
  } else if (character.movingRight) {
    img = playerRightImgs[character.animationFrame]; // Use right movement frames
  } else {
    // When the character stops, choose based on the last direction
    if (character.lastDirection === "left") {
      img = playerLeftImgs[0]; // Use 'Mirror1.png' when stopped after moving left
    } else {
      img = playerRightImgs[0]; // Use 'Player1.png' when stopped after moving right
    }
  }

  image(img, character.x, character.y, character.width, character.height);
}

function displayMiniScreen(character) {
  let bubbleY = character.y + bubbleOffset + bubbleYOffset; // NEW: Adjust the bubble's Y offset based on the user setting
  if (character.y < 0 || character.y > height) {
    fill(255, 255, 255, 150);
    ellipse(character.x + character.width / 2, bubbleY, miniScreenDiameter, miniScreenDiameter);
    let miniCharacterX = character.x + character.width / 2 - character.width / 4;
    let miniCharacterY = bubbleY - character.height / 4;
    image(playerRightImgs[character.animationFrame], miniCharacterX, miniCharacterY, character.width * 0.5, character.height * 0.5);
  }
}

function keyPressed() {
  keys[keyCode] = true;

  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    return false;
  }
}

function keyReleased() {
  keys[keyCode] = false;
}
