const sql = require("mssql");

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = async function (context, req) {
    const { staff_number, last_name } = req.body;

    if (!staff_number || !last_name) {
        context.res = {
            status: 400,
            body: {
                success: false,
                message: 'Staff number and last name are required'
            }
        };
        return;
    }

    try {
        sql.connect(dbConfig);

        const result = await sql.query`SELECT * FROM wardens WHERE staff_number = ${staff_number} AND last_name = ${last_name}`;

        if (result.recordset.length === 0) {
            context.res = {
                status: 401,
                body: {
                    success: false,
                    message: 'Invalid staff number or last name'
                }
            };
            return;
        }

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Logged in successfully',
                data: result.recordset[0]
            }
        };
    } catch (err) {
        console.error('Error retrieving wardens:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error retrieving wardens'
            }
        };
    }
};