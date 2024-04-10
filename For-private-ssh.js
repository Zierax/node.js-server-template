const { Client } = require('ssh2');
const fs = require('fs').promises;
const path = require('path');

// Function to establish SSH connection
const connectSSH = async (sshConfig) => {
    return new Promise((resolve, reject) => {
        const sshConnection = new Client();
        sshConnection.on('error', reject);
        sshConnection.on('ready', () => {
            resolve(sshConnection);
        });
        sshConnection.connect(sshConfig);
    });
};

// Function to execute a command on the SSH connection
const executeCommand = async (sshConnection, command) => {
    return new Promise((resolve, reject) => {
        sshConnection.exec(command, (err, stream) => {
            if (err) {
                reject(err);
                return;
            }

            let output = '';
            stream.on('data', data => {
                output += data.toString();
            });

            stream.on('close', (code, signal) => {
                resolve(output);
            });
        });
    });
};

// Main function to execute SSH command
const main = async () => {
    try {
        // SSH connection configuration
        const sshConfig = {
            host: 'your_server_ip',
            port: 22,
            username: 'your_username',
            privateKey: await fs.readFile(path.resolve(__dirname, 'private_key.pem')), // Path to private key
        };

        // Command to execute remotely
        const command = 'ls -l';

        // Establish SSH connection
        const sshConnection = await connectSSH(sshConfig);
        console.log('SSH connection established');

        // Execute command
        const output = await executeCommand(sshConnection, command);
        console.log('Command output:', output);

        // Close SSH connection
        sshConnection.end();
        console.log('SSH connection closed');
    } catch (error) {
        console.error('Error:', error);
    }
};

// Run main function
main();
