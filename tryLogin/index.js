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

        if (resultWarden.recordset.length !== 0) {
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

        if (resultHealth.recordset.length === 0) {
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
        context.error('Error logging in:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error logging in'
            }
        };
    }
};