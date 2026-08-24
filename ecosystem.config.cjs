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
    // Backs the static version's chat feature (static/arsenic.html has no
    // server of its own — see AGENTS.md's "Static version" section). The
    // static build talks to this cross-origin, so give it its own Caddy
    // vhost (e.g. chat.example.com) pointed at this port — no reverse-proxy
    // trick needed, since static/arsenic.html can be hosted anywhere.
    {
      name: "arsenic-chat",
      script: "npm",
      args: "start",
      env: { PORT: 5002, ARSENIC_CHAT_ENABLED: "true" },
    },
  ],
};
