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
    const { staff_number, time_now } = req.body || {};
    context.log('Request body:', req.body);

    if (!staff_number || !time_now) {
        context.res = {
            status: 400,
            body: {
                success: false,
                message: 'Missing warden ID or time',
            }
        };
        return;
    }

    try {
        await sql.connect(dbConfig);

        await sql.query`
            UPDATE entries SET exit_datetime = ${time_now} WHERE exit_datetime IS NULL AND staff_number = ${staff_number}
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully updated entries',
            }
        };
    } catch (err) {
        context.log('Error updating entries:', err); 
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error updating entries',
            }
        };
    }
};
