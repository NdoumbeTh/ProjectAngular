// Utilisé par HEALTHCHECK dans le Dockerfile.
// On évite d'installer curl/wget dans l'image alpine : http est déjà
// disponible nativement avec Node.
const http = require('http');

const options = {
  host: '127.0.0.1',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000
};

const req = http.get(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => process.exit(1));
req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});
