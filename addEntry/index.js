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
    const { staff_number, building_id, entry_datetime } = req.body || {};
    context.log('Request body:', req.body);

    if (!staff_number || !building_id || !entry_datetime) {
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
            INSERT INTO entries (staff_number, building_id, entry_datetime)
            VALUES (${staff_number}, ${building_id}, ${entry_datetime})
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully added an entry',
            }
        };
    } catch (err) {
        context.error('Error adding entry:', err); 
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error adding entry',
            }
        };
    }
};
