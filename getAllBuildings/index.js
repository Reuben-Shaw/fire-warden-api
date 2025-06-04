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
        context.log('Getting buildings');
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT * FROM buildings`;

        context.log('Returning buildings');
        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Buildings fetched successfully',
                data: result.recordset
            }
        };
    } catch (err) {
        context.error('Error retrieving buildings:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error retrieving buildings'
            }
        };
    }
};