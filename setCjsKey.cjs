const { generateKeyPairSync } = require('crypto');
const { spawn } = require('child_process');

// 1. Generate a valid PKCS#8 key
const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

console.log("Generated Key (preview):");
console.log(privateKey.substring(0, 50) + "...");

// 2. Set it using npx convex env set
// We use spawn to avoid shell interpretation of newlines
const child = spawn('npx.cmd', ['convex', 'env', 'set', 'JWT_PRIVATE_KEY', privateKey], {
    stdio: 'inherit',
    shell: true
});

child.on('close', (code) => {
    if (code === 0) {
        console.log("Successfully set JWT_PRIVATE_KEY!");
    } else {
        console.error("Failed to set key, exit code:", code);
        process.exit(code);
    }
});
