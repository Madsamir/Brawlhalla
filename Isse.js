let character;
let platforms = []; // Array for multiple platforms
let characterImg; // Variable for the character image
let upperPlatformWidth = 100; // Adjustable width for the upper platform
let mirroredPlatformWidth = 100; // Adjustable width for the mirrored platform

let levelWidth = 1200; // Width of the wentire level
let levelHeight = 600; // Height of the level

// Define keys state (initialize as an empty object)
let keys = {}; 

function preload() {
  // Load the character image
  characterImg = loadImage('Player1.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas is the visible window
  
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
    jumpForce: -17
  };
  
  // Define platforms (inside smaller level)
  platforms.push({ x: 0, y: 350, width: levelWidth, height: 20 }); // Bottom platform
  platforms.push({ x: 200, y: 100, width: upperPlatformWidth, height: 20 }); // Upper platform
  
  // Add a new parallel platform on the opposite side with adjustable width
  platforms.push({ x: levelWidth - 200 - mirroredPlatformWidth, y: 100, width: mirroredPlatformWidth, height: 20 }); // Mirrored upper platform
}

function draw() {
  background(200);

  // Calculate the camera position to follow the character in both x and y directions
  let camX = constrain(character.x - width / 2, 0, levelWidth - width);  // Keep camera within level bounds horizontally
  let camY = constrain(character.y - height / 2, 0, levelHeight - height); // Keep camera within level bounds vertically

  // Apply camera translation to follow the character
  translate(-camX, -camY);  // Translate the world to follow the player
  
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
  if (character.y > levelHeight) {
    character.y = levelHeight;
    character.velocityY = 0;
  }
}

function displayCharacter() {
  // Display the character image instead of a rectangle
  image(characterImg, character.x, character.y, character.width, character.height);
}

function keyPressed() {
  // Track keys pressed
  keys[keyCode] = true;

  // Jump when spacebar (key code 87) is pressed
  if (keyCode === 87 && !character.jumping) {
    character.velocityY += character.jumpForce;
    character.jumping = true; // Prevent double jumping
  }
}

function keyReleased() {
  // Track keys released
  keys[keyCode] = false;
}
