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
    const { staff_number } = req.body || {};
    context.log('Request body:', req.body);

    if (!staff_number) {
        context.res = {
            status: 400,
            body: {
                success: false,
                message: 'Missing staff number',
            }
        };
        
        return;
    }

    try {
        await sql.connect(dbConfig);

        await sql.query`
            INSERT INTO wardens (staff_number)
            VALUES (${staff_number})
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully added a warden',
            }
        };
    } catch (err) {
        context.log('Error adding warden:', err); 
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error adding warden',
            }
        };
    }
};
