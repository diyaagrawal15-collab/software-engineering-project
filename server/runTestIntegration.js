const { spawn } = require('child_process');

console.log('Spawning server.js...');
const server = spawn('node', ['server.js'], { stdio: ['inherit', 'pipe', 'inherit'] });

server.stdout.on('data', (data) => {
  const str = data.toString();
  process.stdout.write(str);
  if (str.includes('Healthcheck:')) {
    console.log('\n>>> Server is listening! Running testApis.js now...\n');
    const tester = spawn('node', ['testApis.js'], { stdio: 'inherit' });
    tester.on('close', (code) => {
      console.log(`\nTests finished with exit code ${code}`);
      server.kill();
      process.exit(code);
    });
  }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
