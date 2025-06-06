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
    const staff_number = req.query?.staff_number;

    if (!staff_number) {
        context.res = {
            status: 400,
            body: {
                success: false,
                message: 'Missing staff number'
            }
        };
        return;
    }

    try {
        await sql.connect(dbConfig);

        const wardenResult = await sql.query`
        SELECT * FROM wardens WHERE staff_number = ${staff_number}
        `;
        const healthResult = await sql.query`
        SELECT * FROM health_team WHERE id = ${staff_number}
        `;

        const available = wardenResult.recordset.length === 0 && healthResult.recordset.length === 0;
        context.res = {
            status: 200,
            body: {
                success: true,
                available: available
            }
        };
    } catch (err) {
        context.log('Error checking staff number:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error checking staff number'
            }
        };
    }
};