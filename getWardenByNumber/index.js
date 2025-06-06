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
    const staff_number = req.params.staff_number;
    context.log('Request body:', req.body);

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

        // Passed data using parameterisation, to prevent injection
        const result = await sql.query`
        SELECT * FROM wardens WHERE staff_number = ${staff_number}
        `;

        if (result.recordset.length === 0) {
            // 404 - missing content
            context.res = {
                status: 404,
                body: {
                    success: false,
                    message: 'Warden not found'
                }
            };
        } else {
            context.res = {
                // 200 - success
                status: 200,
                body: {
                    success: true,
                    message: 'Warden fetched successfully',
                    data: result.recordset[0]
                }
            };
        }
    } catch (err) {
        context.log('Error retrieving warden:', err);
        context.res = {
            // 500 - internal error
            status: 500,
            body: {
                success: false,
                message: 'Error retrieving warden'
            }
        };
    }
};