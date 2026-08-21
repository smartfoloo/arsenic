module.exports = {
  apps: [
    {
      name: "arsenic-real",
      script: "npm",
      args: "start",
      env: { PORT: 5000 },
    },
    {
      name: "arsenic-decoy",
      script: "npm",
      args: "start",
      env: { PORT: 5001, ARSENIC_DECOY_ENABLED: "true" },
    },
  ],
};
