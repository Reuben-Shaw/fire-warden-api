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
    const { entry_id, time_now } = req.body || {};
    context.log('Request body:', req.body);

    if (!entry_id || !time_now) {
        context.res = {
            status: 400,
            body: {
                success: false,
                message: 'Missing required values',
            }
        };
        return;
    }

    try {
        await sql.connect(dbConfig);

        await sql.query`
            UPDATE entries SET exit_datetime = ${time_now} WHERE id = ${entry_id}
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully updated entry',
            }
        };
    } catch (err) {
        context.log('Error updating entry:', err); 
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error updating entry',
            }
        };
    }
};
