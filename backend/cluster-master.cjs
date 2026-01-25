const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  console.log(`Creating ${numCPUs * 4} workers for 40,000 user capacity...`);
  
  // Create multiple workers per CPU core for higher capacity
  for (let i = 0; i < numCPUs * 4; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  require('./server.js');
}
