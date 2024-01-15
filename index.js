const TelegramBot = require('node-telegram-bot-api');
const { spawn } = require('child_process');

// Access the bot token and PIN from Replit secrets
const botToken = "YOUR BOT TOKEN";

// Create a new Telegram bot with your bot token
const bot = new TelegramBot(botToken, { polling: true });

// Variable to store the generated access code
const accessCode = generateAccessCode();
console.log(`Generated access code: ${accessCode}`);

// Variable to track the current user using the server
let currentUser = null;

// Map to store user pairs (chatId => {paired, attempts})
const userPairs = new Map();

// Command handler for /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Display a mini help guide
    const helpGuide = `
    Welcome to SecureCommandBot!
    To pair, use /pair command and enter the access code.
    To execute commands, use /execute command (after pairing).

    This Bot is proudly developed with love by Cairo Code
    https://instagram.com/cairo.code
    https://github.com/cairo-code
    https://cairo-code.site
    `;
    bot.sendMessage(chatId, helpGuide);

    // Initialize user pair data
    if (!userPairs.has(chatId)) {
        userPairs.set(chatId, { paired: false, attempts: 0 });
    }
});

// Command handler for /execute
bot.onText(/\/execute (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const command = match[1];

    // Check if the user is paired
    const userData = userPairs.get(chatId);
    if (userData && userData.paired) {
        // Check if the server is already in use
        if (currentUser === null) {
            // Set the current user to the executing user
            currentUser = chatId;

            try {
                // Execute the command and send the result in real-time
                const commandProcess = spawn(command, { shell: true });

                commandProcess.stdout.on('data', (data) => {
                    bot.sendMessage(chatId, `Output: ${data}`);
                });

                commandProcess.stderr.on('data', (data) => {
                    bot.sendMessage(chatId, `Error: ${data}`);
                });

                commandProcess.on('close', (code) => {
                    // Reset the current user when the command execution is finished
                    currentUser = null;
                    bot.sendMessage(chatId, `Command execution finished with code ${code}`);
                });
            } catch (error) {
                // Reset the current user on error
                currentUser = null;
                bot.sendMessage(chatId, `Error executing command: ${error.message}`);
            }
        } else {
            // Server is already connected to another user
            bot.sendMessage(chatId, 'Server is connected to another user. Please wait and try again later.');
        }
    } else {
        // User is not paired, prompt them to pair first
        bot.sendMessage(chatId, 'Please pair with the bot using /pair before executing commands.');
    }
});

// Command handler for /pair
bot.onText(/\/pair/, (msg) => {
    const chatId = msg.chat.id;

    // Check if the server is already in use
    if (currentUser === null) {
        // Set the current user to the pairing user
        currentUser = chatId;

        bot.sendMessage(chatId, 'Please enter the access code to pair.');

        // Set up a listener for the next message to handle the access code input
        waitForAccessCode(chatId);
    } else {
        // Server is already connected to another user
        bot.sendMessage(chatId, 'Server is connected to another user. Please wait and try again later.');
    }
});

// Function to wait for access code input
function waitForAccessCode(chatId) {
    bot.once('text', async (msg) => {
        const enteredCode = msg.text;

        // Check if the entered code is correct
        if (enteredCode === accessCode) {
            // Correct access code, pair the user
            const userData = userPairs.get(chatId);
            if (userData) {
                userData.paired = true;
                userPairs.set(chatId, userData);
            }
            bot.sendMessage(chatId, 'Pairing successful. You can now use /execute to run commands.');
        } else {
            // Incorrect access code, track attempts
            const userData = userPairs.get(chatId);
            if (userData) {
                userData.attempts += 1;

                // Ask the user to enter the correct access code again
                bot.sendMessage(chatId, 'Incorrect access code. Please enter the correct access code.');

                // Recursive call to continue waiting for access code
                waitForAccessCode(chatId);
            }
        }

        // Reset the current user after handling the access code
        currentUser = null;
    });
}

// Function to generate a random code in the format (XXXX-XXXX-XXXX-XXXX)
function generateAccessCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
        if (i === 3 || i === 7 || i === 11) {
            code += '-';
        }
    }
    return code;
}

// Handle errors
bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error}`);
});

console.log('Bot is running...');