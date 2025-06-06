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
    const { staff_number, password } = req.body || {};
    context.log('Request body:', req.body);

    if (!staff_number || !password) {
        context.log('Missing data');
        context.res = {
            status: 400,
            body: {
                success: false,
                message: 'Staff number and password are required'
            }
        };
        return;
    }

    try {
        await sql.connect(dbConfig);

        const resultWarden = await sql.query`
            SELECT * FROM users WHERE warden_id = ${staff_number} AND password = ${password}
        `;

        context.log('Query has run');

        if (resultWarden.recordset.length !== 0) {
            context.log('Returning warden');
            context.res = {
                status: 200,
                body: {
                    success: true,
                    isWarden: true,
                    message: 'Logged in successfully',
                    data: resultWarden.recordset[0]
                }
            };
            return; 
        }

        const resultHealth = await sql.query`
            SELECT * FROM users WHERE health_id = ${staff_number} AND password = ${password}
        `;
        context.log('Second query run');

        if (resultHealth.recordset.length === 0) {
            context.log('Returning nothing');
            context.res = {
                status: 401,
                body: {
                    success: false,
                    message: 'Invalid staff number or password',
                    data: resultHealth.recordset[0]
                }
            };
            return;
        }
        
        context.log('Returning health and safety');
        context.res = {
            status: 200,
            body: {
                success: true,
                isWarden: false,
                message: 'Logged in successfully',
                data: resultHealth.recordset[0]
            }
        };
    } catch (err) {
        context.log('Error logging in:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error logging in'
            }
        };
    }
};