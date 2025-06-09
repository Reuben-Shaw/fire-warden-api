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
    const { staff_number, is_warden } = req.body || {};
    context.log('Request body:', req.body);

    if (!staff_number || is_warden == null) {
        context.res = {
            status: 400,
            body: {
                success: false,
                message: 'Missing details',
            }
        };
        
        return;
    }

    try {
        await sql.connect(dbConfig);

        if (is_warden) {
            await sql.query`
                DELETE FROM wardens WHERE staff_number = ${staff_number}
            `;
        } else {
            await sql.query`
                DELETE FROM health_team WHERE id = ${staff_number}
            `;
        }
        

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully deleted user',
            }
        };
    } catch (err) {
        context.log('Error updating:', err); 
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error deleting user',
            }
        };
    }
};
