let character;
let platforms = []; // Array for multiple platforms
let characterImg; // Variable for the character image
let canFallThrough = false; // State to track if the player is allowed to fall through a platform
let upperPlatformWidth = 150; // Adjustable width for the upper platform
let mirroredPlatformWidth = 150;
let levelWidth = 1200; // Width of the entire level
let levelHeight = 10; // Height of the level
// Define keys state
let keys = {};

function preload() {
  // Load the character image
  characterImg = loadImage('Player1.png');
}

function setup() {
  createCanvas(2000, 1000);
  
  // Define the character
  character = {
    x: 500,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    gravity: 0.6,
    velocityY: 0,
    jumping: false,
    jumpForce: -15
  };
    
  platforms.push({ x: 500, y: 450, width: 900, height: 150 }); // Bottom platform
  
  
  platforms.push({ x: 650, y: 270, width: upperPlatformWidth, height: 20 }); // Upper platform (adjustable width)
  
  // Add a new parallel platform on the opposite side with adjustable width
  platforms.push({ x: width - 750 - mirroredPlatformWidth, y: 270, width: mirroredPlatformWidth, height: 20 }); // Mirrored upper platform
  
  
  platforms.push({x: 800, y: 150, width: 300, height: 20});
  // Mirrored upper platform
}


function draw() {
  background(200);
  
     // Handle character movement
  handleMovement();
  
  // Display platforms
  fill(92, 64, 47);
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

  // Fall through platform when 'S' key (key code 83) is pressed
  if (keys[83]) {
    canFallThrough = true;
  } else {
    canFallThrough = false;
  }
}

function updateCharacter() {
  // Gravity effect
  character.velocityY += character.gravity;
  character.y += character.velocityY;

  // Check collision with platforms
  for (let platform of platforms) {
    if (!canFallThrough && // Only check for platform collision when 'S' key is not pressed
        character.y + character.height >= platform.y && 
        character.y + character.height <= platform.y + platform.height && 
        character.x + character.width > platform.x && 
        character.x < platform.x + platform.width) {
      
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
