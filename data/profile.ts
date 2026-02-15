export const PROFILE = {
    name: "Sudhanshu Singh",
    title: "Backend & DevOps Engineer",
    tagline: "Backend & DevOps Engineer (Node.js) • Event-driven Systems • Integrations",
    email: "singhsudhanshuwork@gmail.com",
    location: "Gurgaon, India",
    socials: [
      { name: "GitHub", url: "https://github.com/Sudhanshu069" },
      { name: "LinkedIn", url: "https://linkedin.com/in/sudhanshusinghwork" },
      { name: "LeetCode", url: "https://leetcode.com/u/sudhanshu069/" },
    ],
    experience: [
      {
        company: "RegisterKaro (Safe Ledger Pvt Ltd)",
        role: "Software Engineer (Backend & DevOps / Integrations)",
        period: "Mar 2025 - Present",
        location: "Gurgaon, IN",
        highlights: [
          "Launched IVR/telephony integration (webhooks, routing, searchable recordings); 100+ calls/day; reduced issue resolution time by 35%.",
          "Built Redis Pub/Sub fan-out for real-time events across multi-worker Node.js; achieved sub-500ms delivery latency.",
          "Hardened Socket.IO for multi-process deployments (sticky sessions + cluster strategy) and tuned Nginx WebSocket proxying; reduced disconnects by 46% and improved upgrade success from 77% to 91%.",
          "Delivered customer tagging + rule-based task assignment with capacity caps; auto-balanced 100+ tasks/day and removed 40% manual assignment overhead.",
          "Designed grievance + ops task system (MongoDB domain model with 5 collections, indexes, access controls, routing, bulk reassignment, ticket–task linkage); improved ops productivity by 26%.",
          "Optimized MongoDB search by auditing slow queries and redesigning compound indexes / pruning; decreased search latency by 12% and reduced DB cost via lower CPU/IO overhead.",
          "Automated releases via GitHub Actions CI/CD with blue-green Docker deploys + rollback across 10+ microservices; 2-min deploys and 3-min rollbacks with availability maintained.",
          "Implemented DB-driven CronJob scheduler with role/flag gating and multi-worker safeguards; eliminated duplicate executions and reduced incidents by 30%.",
          "Eliminated recurring 502s by introducing a load balancer with health checks and safe traffic shifting; reduced occurrences from daily to none.",
        ],
      },
      {
        company: "Segwitz",
        role: "Software Engineer (Frontend)",
        period: "May 2024 - Jan 2025",
        location: "Remote / Kuala Lumpur",
        highlights: [
          "Improved React dashboard performance using code splitting and optimized asset delivery; reduced load time by 20%.",
          "Implemented OAuth authentication with token refresh, protected routes, and secure session handling for SPA dashboards.",
        ],
      },
    ],
    skills: [
      // Languages
      "TypeScript",
      "JavaScript",
      "Go (learning)",
      // Backend
      "Node.js",
      "Express.js",
      "REST APIs",
      "Webhooks",
      "JWT / OAuth",
      // Data
      "MongoDB",
      "PostgreSQL",
      "Redis / Valkey",
      "Indexing & Query Optimization",
      // Messaging / Realtime
      "RabbitMQ",
      "Retries / DLQ",
      "Idempotency",
      "Redis Pub/Sub",
      "Socket.IO",
      "WebSockets",
      // Infra / DevOps
      "Docker",
      "Nginx",
      "Linux",
      "GitHub Actions",
      "AWS",
      "DigitalOcean",
      // Observability
      "Prometheus",
      "Grafana",
      "Loki",
    ],
  };