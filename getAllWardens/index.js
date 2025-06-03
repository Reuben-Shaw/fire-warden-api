require('dotenv').config();
const sql = require("mssql");

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = async function (context, req) {
    try {
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT * FROM wardens`;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Wardens fetched successfully',
                data: result.recordset
            }
        };
    } catch (err) {
        context.error('Error retrieving wardens:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error retrieving wardens'
            }
        };
    }
};