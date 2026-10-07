module.exports = {
  apps: [{ name: "pixstock", script: "npm", args: "start", env: { NODE_ENV: "production" }, max_memory_restart: "800M" }],
};
