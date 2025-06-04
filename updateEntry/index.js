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
    const { entry_id, building_id, entry_datetime, exit_datetime } = req.body || {};
    context.log('Request body:', req.body);

    if (!entry_id || !building_id || !entry_datetime) {
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
            UPDATE entries
            SET building_id = ${building_id},
                entry_datetime = ${entry_datetime},
                exit_datetime = ${exit_datetime || null}
            WHERE id = ${entry_id}
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully updated the entry',
            }
        };
    } catch (err) {
        context.log.error('Error updating entry:', err); 
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error updating entry',
            }
        };
    }
};
