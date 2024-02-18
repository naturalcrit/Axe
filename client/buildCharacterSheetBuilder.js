// scripts/buildCharacterSheetBuilder.js

const fs = require('fs');
const less = require('less');

// Function to compile Less files to CSS
async function compileLess() {
  try {
    // Read the Less file
    const lessFile = fs.readFileSync('src/styles/main.less', 'utf8');

    // Compile Less to CSS
    const { css } = await less.render(lessFile);

    // Write the compiled CSS to a file
    fs.writeFileSync('src/styles/main.css', css);

    console.log('Less files compiled successfully.');
  } catch (error) {
    console.error('Error compiling Less files:', error);
  }
}

// Function to perform other custom build tasks
function performCustomTasks() {
  // Perform any other custom build tasks here...
  console.log('Custom build tasks executed.');
}

// Main function to execute build tasks
async function main() {
  // Compile Less files
  await compileLess();

  // Perform other custom build tasks
  performCustomTasks();
}

// Execute the main function
main();
