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
    const { staff_number, first_name, last_name } = req.body || {};

    if (!staff_number || !first_name || !last_name) {
        
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
        sql.connect(dbConfig);

        await sql.query`
            INSERT INTO wardens (staff_number, first_name, last_name)
            VALUES (${staff_number}, ${first_name}, ${last_name})
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully added a warden',
            }
        };
    } catch (err) {
        console.error('Error adding warden:', err);
        
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error adding warden',
            }
        };
    }
};
