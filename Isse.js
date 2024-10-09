let character;
let platforms = []; // Array for multiple platforms
let rightFacingImgs = []; // Array for the right-facing images
let leftFacingImgs = [];  // Array for the left-facing images
let currentAnimationImgs = []; // Array for the currently active images
let canFallThrough = false; // State to track if the player is allowed to fall through a platform
let upperPlatformWidth = 150; // Adjustable width for the upper platform
let mirroredPlatformWidth = 150;
let animationFrame = 0; // To track the current frame for animation
let animationSpeed = 5; // Speed of the animation
let frameCounter = 0; // Counter to switch frames
let lastDirection = 'right'; // Track the last direction of movement ('right' or 'left')

// Define keys state
let keys = {};
const miniScreenDiameter = 150; // Diameter of the mini screen (bubble)
let bubbleOffset = 150; // Distance below the character where the bubble appears (adjustable)

function preload() {
  // Load the right-facing images
  rightFacingImgs.push(loadImage('Player1.png')); // Frame 1
  rightFacingImgs.push(loadImage('Player2.png')); // Frame 2
  rightFacingImgs.push(loadImage('Player3.png')); // Frame 3

  // Load the left-facing (mirrored) images
  leftFacingImgs.push(loadImage('Mirror1.png')); // Frame 1 for left
  leftFacingImgs.push(loadImage('Mirror2.png')); // Frame 2 for left
  leftFacingImgs.push(loadImage('Mirror3.png')); // Frame 3 for left

  // Set default to right-facing images
  currentAnimationImgs = rightFacingImgs;
}

function setup() {
  createCanvas(2000, 1000);

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
    jumpForce: -15
  };

  platforms.push({ x: 100, y: 400, width: width, height: 150 }); // Bottom platform
  platforms.push({ x: 350, y: 200, width: upperPlatformWidth, height: 20 }); // Upper platform (adjustable width)
  platforms.push({ x: width - 350 - mirroredPlatformWidth, y: 200, width: mirroredPlatformWidth, height: 20 }); // Mirrored upper platform
  platforms.push({ x: 600, y: 75, width: upperPlatformWidth, height: 20 });
  platforms.push({ x: width - 600 - mirroredPlatformWidth, y: 75, width: mirroredPlatformWidth, height: 20 }); // Mirrored upper platform
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

  // Update character
  updateCharacter();

  // Display the character with animation
  displayCharacter();

  // Display the mini screen if the character is out of bounds
  displayMiniScreen();
}

function handleMovement() {
  let moving = false; // To check if the character is moving

  // Move left when 'A' key (key code 65) is pressed
  if (keys[65]) {
    character.x -= character.speed;
    moving = true;
    lastDirection = 'left'; // Update last direction
    currentAnimationImgs = leftFacingImgs; // Use left-facing images
  }

  // Move right when 'D' key (key code 68) is pressed
  if (keys[68]) {
    character.x += character.speed;
    moving = true;
    lastDirection = 'right'; // Update last direction
    currentAnimationImgs = rightFacingImgs; // Use right-facing images
  }

  // Fall through platform when 'S' key (key code 83) is pressed
  if (keys[83]) {
    canFallThrough = true;
  } else {
    canFallThrough = false;
  }

  // Update animation frame if moving
  if (moving) {
    frameCounter++;
    if (frameCounter >= animationSpeed) {
      animationFrame = (animationFrame + 1) % currentAnimationImgs.length; // Loop through frames
      frameCounter = 0; // Reset counter
    }
  } else {
    animationFrame = 0; // Reset to the first frame when not moving
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
  // Display the character image based on the current animation frame
  image(currentAnimationImgs[animationFrame], character.x, character.y, character.width, character.height);
}

function displayMiniScreen() {
  // Check if character is out of bounds (above the canvas)
  let bubbleY = character.y + bubbleOffset; // Position of the bubble below the character
  if (character.y < 0 || character.y > height) {
    // Draw bubble background
    fill(255, 255, 255, 150); // Semi-transparent white
    // Position the bubble directly below the character
    ellipse(character.x + character.width / 2, bubbleY, miniScreenDiameter, miniScreenDiameter); // Draw the bubble

    // Draw character on mini screen (bubble)
    let miniCharacterX = character.x + character.width / 2 - character.width / 4; // Center the character in the bubble
    let miniCharacterY = bubbleY - character.height / 4; // Place the character within the bubble
    image(currentAnimationImgs[animationFrame], miniCharacterX, miniCharacterY, character.width * 0.5, character.height * 0.5); // Scale down character image
  }
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
