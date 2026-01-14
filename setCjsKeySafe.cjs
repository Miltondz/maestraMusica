const { generateKeyPairSync } = require('crypto');
const { spawn } = require('child_process');

const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

console.log("Generated Key (preview):");
console.log(privateKey.substring(0, 50) + "...");

// Using shell: false should pass the argument as a single string
const child = spawn('npx.cmd', ['convex', 'env', 'set', 'JWT_PRIVATE_KEY', privateKey], {
    stdio: 'inherit',
    shell: false
});

child.on('close', (code) => {
    if (code === 0) {
        console.log("Successfully set JWT_PRIVATE_KEY!");
    } else {
        console.error("Failed to set key, exit code:", code);
        process.exit(code);
    }
});
