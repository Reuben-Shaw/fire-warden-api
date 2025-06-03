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
    context.log('HERE!!!!');
    const staff_number = req.params.staff_number;
    context.log('Request params:', req.params);

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

        const result = await sql.query`
            SELECT 
                e.id,
                b.building_name,
                e.entry_datetime,
                e.exit_datetime
            FROM entries e
            JOIN buildings b ON e.building_id = b.id
            WHERE e.staff_number = ${staff_number}
            ORDER BY e.entry_datetime DESC
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Entries fetched successfully',
                data: result.recordset
            }
        };
    } catch (err) {
        context.log.error('Error retrieving entries:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error retrieving entries'
            }
        };
    }
};