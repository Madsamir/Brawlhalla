let character;
let platforms = []; // Array for multiple platforms

// Define keys state
let keys = {};

function setup() {
  createCanvas(800, 400);
  
  // Define the character
  character = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    gravity: 0.5,
    velocityY: 0,
    jumping: false,
    jumpForce: -10
  };
  
  // Define platforms
  platforms.push({ x: 0, y: 350, width: width, height: 20 }); // Bottom platform
  platforms.push({ x: 300, y: 250, width: 200, height: 20 }); // Upper platform
}

function draw() {
  background(200);
  
  // Handle character movement
  handleMovement();
  
  // Display platforms
  fill(100);
  for (let platform of platforms) {
    rect(platform.x, platform.y, platform.width, platform.height);
  }
  
  // Update and display the character
  updateCharacter();
  displayCharacter();
}

function handleMovement() {
  // Move left when 'A' key (key code 65) is pressed
  if (keys[65]) {
    character.x -= character.speed;
  }
  
  // Move right when 'D' key (key code 68) is pressed
  if (keys[68]) {
    character.x += character.speed;
  }
}

function updateCharacter() {
  // Gravity effect
  character.velocityY += character.gravity;
  character.y += character.velocityY;

  // Check collision with platforms
  for (let platform of platforms) {
    if (character.y + character.height >= platform.y && character.y + character.height <= platform.y + platform.height && 
        character.x + character.width > platform.x && character.x < platform.x + platform.width) {
      character.y = platform.y - character.height; // Place character on top of platform
      character.velocityY = 0; // Reset velocity
      character.jumping = false; // Allow jumping again
    }
  }

  // Prevent character from falling off the bottom of the canvas
  if (character.y > height) {
    character.y = height;
    character.velocityY = 0;
  }
}

function displayCharacter() {
  fill(255, 0, 0);
  rect(character.x, character.y, character.width, character.height);
}

function keyPressed() {
  // Track keys pressed
  keys[keyCode] = true;

  // Jump when spacebar (key code 32) is pressed
  if (keyCode === 32 && !character.jumping) {
    character.velocityY += character.jumpForce;
    character.jumping = true; // Prevent double jumping
  }
}

function keyReleased() {
  // Track keys released
  keys[keyCode] = false;
}
