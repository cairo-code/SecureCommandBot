# SecureCommandBot

This Telegram bot allows users to pair with a server and execute commands remotely. It generates a unique access code for each session, ensuring secure access to the server.

## Features

1. **Pairing**: Users must pair with the bot using the `/pair` command and entering the generated access code.

2. **Command Execution**: Paired users can execute commands on the server using the `/execute` command.

3. **Security Measures**: The bot implements security measures to prevent unauthorized access and spamming.

4. **Single User Access**: Only one user can access the server at a time. If the server is in use, others will be notified.

5. **Access Code Format**: The access code is in the format (XXXX-XXXX-XXXX-XXXX), consisting of a mixture of letters and numbers.

6. **Mini Help Guide**: A brief help guide is provided when users start the bot using the `/start` command.

## Commands

1. **/start**: Displays a mini help guide.

2. **/pair**: Initiates the pairing process. Users need to enter the access code to pair.

3. **/execute [command]**: Executes a command on the server. (After pairing)

## Setup

1. **Install Dependencies**: Install the required Node.js packages using `npm install`.

2. **Set Up Environment Variables**: Store your Telegram bot token in the environment variable `BOT_TOKEN`.

3. **Run the Bot**: Execute the bot script using `node app.js`.

## Usage

1. **Pairing Process**: 
    - Use the `/pair` command.
    - Enter the access code provided by the bot.

2. **Executing Commands**:
    - Use the `/execute [command]` command after successfully pairing.

3. **Security Measures**:
    - Only one user can access the server at a time.
    - Incorrect access code attempts are tracked.

4. **Access Code Format**:
    - The access code is in the format (XXXX-XXXX-XXXX-XXXX).

## Security Measures

1. **Single User Access**:
    - The server can be accessed by only one user at a time.
    - If the server is in use, others are notified to try again later.

2. **Incorrect Access Code Attempts**:
    - Incorrect attempts to enter the access code are tracked.
    - After five attempts, the user is notified of a temporary timeout.

## Example Session

1. User starts the bot: `/start`
    - Receives a mini help guide.

2. User initiates pairing: `/pair`
    - Receives an access code in the format (XXXX-XXXX-XXXX-XXXX).

3. User enters the access code to pair.

4. Paired user executes a command: `/execute ls -l`

5. Server executes the command and sends the output to the user.

6. Only one user can access the server at a time.

## Error Handling

1. **Access Code Mismatch**:
    - If the user enters an incorrect access code, they are prompted to enter the correct one.

2. **Command Execution Error**:
    - If there is an error executing the command, the user is notified.

3. **Server in Use**:
    - If the server is already in use, the user is notified to try again later.

4. **Timeout for Incorrect Attempts**:
    - After five incorrect attempts, the user is temporarily timed out.

## Notes

- Ensure that Node.js and npm are installed on your machine.
- Set up the necessary environment variables, including the Telegram bot token.

## Conclusion

This Telegram bot provides a secure and controlled environment for remote command execution. Users can pair with the bot, receive a unique access code, and execute commands on the server in a single-user access mode. The bot includes security measures to prevent unauthorized access and misuse.
