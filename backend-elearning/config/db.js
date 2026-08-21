const mysql = require('mysql2');

// Config pilotée par variables d'environnement (Docker/K8s injectent ces valeurs
// via ConfigMap + Secret). Les valeurs par défaut permettent de garder
// `npm start` fonctionnel en local sans rien configurer.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elearning',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Un pool évite de faire planter le process si la base n'est pas encore prête
// au démarrage (utile en conteneur, où l'ordre de démarrage n'est pas garanti).
pool.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL: connexion impossible pour l'instant -", err.message);
        return;
    }
    console.log("MySQL connecté");
    connection.release();
});

module.exports = pool;
