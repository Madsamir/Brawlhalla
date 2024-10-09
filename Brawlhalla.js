let characters = []; // Array for multiple characters
let platforms = []; // Array for multiple platforms
let characterImg; // Variable for the character image
let canFallThrough = false; // State to track if the player is allowed to fall through a platform
let upperPlatformWidth = 150; // Adjustable width for the upper platform
let mirroredPlatformWidth = 150;
let levelWidth = 1200; // Width of the entire level
let levelHeight = 10; // Height of the level

// Define keys state
let keys = {};

// Variables for bubble display
let bubbleOffset = 50; // Distance of bubble from character
let miniScreenDiameter = 100; // Size of the bubble
let characterImgs = []; // Array to hold character images for mini display
let animationFrame = 0; // Current animation frame (if using multiple frames)

function preload() {
  // Load the character image
  characterImg = loadImage('Player1.png');
  characterImgs.push(characterImg); // Assuming one image for now, you can add more for animation
}

function setup() {
  createCanvas(2000, 1000);
  
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
    jumpForce: -15
  };
  
  // Define the second character with a different initial position
  let character2 = {
    x: 800, // Different starting position
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    gravity: 0.6,
    velocityY: 0,
    jumping: false,
    jumpForce: -15
  };
  
  characters.push(character1); // Add the first character to the array
  characters.push(character2); // Add the second character to the array

  platforms.push({ x: 500, y: 450, width: 900, height: 150 }); // Bottom platform
  platforms.push({ x: 650, y: 270, width: upperPlatformWidth, height: 20 }); // Upper platform (adjustable width)
  platforms.push({ x: width - 750 - mirroredPlatformWidth, y: 270, width: mirroredPlatformWidth, height: 20 }); // Mirrored upper platform
  platforms.push({ x: 800, y: 150, width: 300, height: 20 }); // Another upper platform
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
  
  // Update and display both characters
  for (let character of characters) {
    updateCharacter(character);
    displayCharacter(character);
    displayMiniScreen(character); // Show bubble if character is out of bounds
  }
}

function handleMovement() {
  // Controls for the first character (WASD)
  if (keys[65]) { // 'A' key
    characters[0].x -= characters[0].speed;
  }
  
  if (keys[68]) { // 'D' key
    characters[0].x += characters[0].speed;
  }

  if (keys[87] && !characters[0].jumping) { // 'W' key for jumping
    characters[0].velocityY += characters[0].jumpForce;
    characters[0].jumping = true; // Prevent double jumping
  }

  // Controls for the second character (Arrow keys)
  if (keys[LEFT_ARROW]) {
    characters[1].x -= characters[1].speed;
  }
  
  if (keys[RIGHT_ARROW]) {
    characters[1].x += characters[1].speed;
  }

  if (keys[UP_ARROW] && !characters[1].jumping) { // Up arrow for jumping
    characters[1].velocityY += characters[1].jumpForce;
    characters[1].jumping = true; // Prevent double jumping
  }

  // Fall through platform when 'S' key (key code 83) is pressed
  canFallThrough = keys[83]; // Fall through for the first character
}

function updateCharacter(character) {
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

function displayCharacter(character) {
  // Display the character image instead of a rectangle
  image(characterImg, character.x, character.y, character.width, character.height);
}

function displayMiniScreen(character) {
  let bubbleY = character.y + bubbleOffset; // Position of the bubble below the character
  if (character.y < 0 || character.y > height) {
    // Draw bubble background
    fill(255, 255, 255, 150); // Semi-transparent white
    // Position the bubble directly below the character
    ellipse(character.x + character.width / 2, bubbleY, miniScreenDiameter, miniScreenDiameter); // Draw the bubble

    // Draw character on mini screen (bubble)
    let miniCharacterX = character.x + character.width / 2 - character.width / 4; // Center the character in the bubble
    let miniCharacterY = bubbleY - character.height / 4; // Place the character within the bubble
    image(characterImgs[animationFrame], miniCharacterX, miniCharacterY, character.width * 0.5, character.height * 0.5); // Scale down character image
  }
}

function keyPressed() {
  // Track keys pressed
  keys[keyCode] = true;
}

function keyReleased() {
  // Track keys released
  keys[keyCode] = false;
}
