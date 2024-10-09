let characters = []; // Array for multiple characters
let platforms = []; // Array for multiple platforms
let characterImg; // Variable for the character image
let upperPlatformWidth = 150; // Adjustable width for the upper platform
let mirroredPlatformWidth = 150;
let levelWidth = 1200; // Width of the entire level
let levelHeight = 10; // Height of the level
let keys = {}; // Define keys state
let bubbleOffset = 50; // Distance of bubble from character
let miniScreenDiameter = 100; // Size of the bubble
let characterImgs = []; // Array to hold character images for mini display
let animationFrame = 0; // Current animation frame (if using multiple frames)

// spawn positions for Player 1 og Player 2
let initialPositions = [
  { x: 500, y: 300 },
  { x: 1350, y: 300 },
];

function preload() {
  characterImg = loadImage("Player1.png");
  characterImgs.push(characterImg); // Assuming one image for now, you can add more for animation
}

function setup() {
  createCanvas(1905, 900);

  // Player 1
  let character1 = {
    x: initialPositions[0].x,
    y: initialPositions[0].y,
    width: 40,
    height: 40,
    speed: 5,
    gravity: 0.6,
    velocityY: 0,
    jumping: false,
    jumpForce: -15,
    // Individual state for fall through
    canFallThrough: false,
  };

  // Player 2
  let character2 = {
    x: initialPositions[1].x,
    y: initialPositions[1].y,
    width: 40,
    height: 40,
    speed: 5,
    gravity: 0.6,
    velocityY: 0,
    jumping: false,
    jumpForce: -15,
    canFallThrough: false,
  };

  characters.push(character1);
  characters.push(character2);

  // Big platform
  platforms.push({
    x: 500,
    y: 450,
    width: 900,
    height: 150,
    color: [92, 64, 47],
  });
  // death platform
  platforms.push({
    x: 0,
    y: 700,
    width: 2000,
    height: 200,
    color: [173, 216, 230],
  });
  // Upper platform (adjustable width)
  platforms.push({
    x: 650,
    y: 270,
    width: upperPlatformWidth,
    height: 20,
    color: [90, 90, 90],
  });
  // Mirrored upper platform
  platforms.push({
    x: width - 650 - mirroredPlatformWidth,
    y: 270,
    width: mirroredPlatformWidth,
    height: 20,
    color: [90, 90, 90],
  });
  // Another upper platform
  platforms.push({
    x: 800,
    y: 150,
    width: 300,
    height: 20,
    color: [90, 90, 90],
  });
}

function draw() {
  background(200);

  // Player movement
  handleMovement();

  // Tegn platforms
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
  // Controls for Player 1 (WASD)
  if (keys[65]) {
    // A key
    characters[0].x -= characters[0].speed;
  }

  if (keys[68]) {
    // D key
    characters[0].x += characters[0].speed;
  }

  if (keys[87] && !characters[0].jumping) {
    // W key for jumping
    characters[0].velocityY += characters[0].jumpForce;
    characters[0].jumping = true; // Prevent double jumping
  }

  // Controls for Player 2 (Arrow keys)
  if (keys[LEFT_ARROW]) {
    characters[1].x -= characters[1].speed;
  }

  if (keys[RIGHT_ARROW]) {
    characters[1].x += characters[1].speed;
  }

  if (keys[UP_ARROW] && !characters[1].jumping) {
    // Up arrow for jumping
    characters[1].velocityY += characters[1].jumpForce;
    characters[1].jumping = true; // Prevent double jumping
  }

  // Fall through platform when 'S' key is pressed for the first character
  characters[0].canFallThrough = keys[83]; // Fall through for the first character

  // Fall through for second character if DOWN_ARROW is pressed
  characters[1].canFallThrough = keys[DOWN_ARROW]; // Separate fall-through control for the second character
}

function updateCharacter(character) {
  // Gravity
  character.velocityY += character.gravity;
  character.y += character.velocityY;

  // Check collision with platforms
  for (let platform of platforms) {
    if (
      !character.canFallThrough && // Only check for platform collision when not falling through
      character.y + character.height >= platform.y &&
      character.y + character.height <= platform.y + platform.height &&
      character.x + character.width > platform.x &&
      character.x < platform.x + platform.width
    ) {
      character.y = platform.y - character.height; // Place character on top of platform
      character.velocityY = 0; // Reset velocity
      character.jumping = false; // Allow jumping again
    }

    // Check for collision
    if (
      platform.color[0] === 173 &&
      platform.color[1] === 216 &&
      platform.color[2] === 230
    ) {
      // Light blue platform
      if (
        character.y + character.height >= platform.y &&
        character.x + character.width > platform.x &&
        character.x < platform.x + platform.width
      ) {
        // Respawn the character to their initial position
        if (characters.indexOf(character) === 0) {
          character.x = initialPositions[0].x;
          character.y = initialPositions[0].y;
        } else if (characters.indexOf(character) === 1) {
          character.x = initialPositions[1].x;
          character.y = initialPositions[1].y;
        }
        character.velocityY = 0; // Reset velocity
      }
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
  image(
    characterImg,
    character.x,
    character.y,
    character.width,
    character.height
  );
}

function displayMiniScreen(character) {
  let bubbleY = character.y + bubbleOffset; // Position of the bubble below the character
  if (character.y < 0 || character.y > height) {
    // Draw bubble background
    fill(255, 255, 255, 150); // Semi-transparent white
    // Position the bubble directly below the character
    ellipse(
      character.x + character.width / 2,
      bubbleY,
      miniScreenDiameter,
      miniScreenDiameter
    ); // Draw the bubble

    // Draw character on mini screen (bubble)
    let miniCharacterX =
      character.x + character.width / 2 - character.width / 4; // Center the character in the bubble
    let miniCharacterY = bubbleY - character.height / 4; // Place the character within the bubble
    image(
      characterImgs[animationFrame],
      miniCharacterX,
      miniCharacterY,
      character.width * 0.5,
      character.height * 0.5
    ); // Scale down character image
  }
}

function keyPressed() {
  // Track keys pressed
  keys[keyCode] = true;

  // Prevent default action (scrolling) when arrow keys are pressed
  if (
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW ||
    keyCode === LEFT_ARROW ||
    RIGHT_ARROW
  ) {
    return false;
  }
}

function keyReleased() {
  // Track keys released
  keys[keyCode] = false;
}
