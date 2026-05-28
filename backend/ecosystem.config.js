/**
 * FILE: ecosystem.config.js
 * LOCATION: backend/ecosystem.config.js
 * PURPOSE: PM2 Configuration for Production Clustering and High Availability.
 *          This runs the Node.js backend on all available CPU cores, dramatically
 *          increasing the server capacity to handle 10,000+ concurrent users.
 * 
 * FEATURES:
 *  - instances: "max" (Uses all available CPU cores)
 *  - exec_mode: "cluster" (Load balances incoming traffic automatically)
 *  - max_memory_restart: Restarts automatically if memory leaks occur
 *  - env_production: Explicit production environment variables
 */

module.exports = {
  apps: [
    {
      name: "eduquest-backend-cluster",
      script: "./dist/index.js", // Path to compiled TypeScript code
      
      // Scale across all CPU cores for maximum concurrency
      instances: "max", 
      exec_mode: "cluster", 
      
      // Auto-restart configuration for zero-downtime
      autorestart: true,
      watch: false,
      max_memory_restart: "1G", // Protects against OOM crashes
      
      // Application environment variables
      env: {
        NODE_ENV: "development",
        PORT: 4000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000
      },
      
      // Logging
      error_file: "./logs/pm2-err.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      time: true
    }
  ]
};
