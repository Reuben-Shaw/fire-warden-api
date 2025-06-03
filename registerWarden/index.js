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
    const { staff_number, first_name, last_name, password } = req.body || {};
    context.log('Request body:', req.body);

    if (!staff_number || !first_name || !last_name || !password) {
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

        const wardenExists = await sql.query`
            SELECT * FROM wardens WHERE staff_number = ${staff_number}
        `;

        if (wardenExists.recordset.length === 0) {
            context.res = {
                status: 401,
                body: {
                    success: false,
                    message: 'Warden with that staff number is not in the system',
                }
            };
            return;
        }

        await sql.query`
            INSERT INTO users (first_name, last_name, password, warden_id)
            VALUES (${first_name}, ${last_name}, ${password}, ${staff_number})
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully registered a warden',
            }
        };
    } catch (err) {
        context.error('Error registering warden:', err); 
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error registering warden',
            }
        };
    }
};
