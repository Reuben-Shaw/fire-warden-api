const sql = require("mssql");

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = async function (context, req) {
    try {
        sql.connect(dbConfig);

        const result = await sql.query`SELECT * FROM wardens`;

        context.res = {
            status: 200,
            body: result.recordset
        };
        } catch (err) {
            console.error("Error retrieving wardens:", err);
            context.res = {
                status: 500,
                body: "Error retrieving wardens"
        };
    }
};