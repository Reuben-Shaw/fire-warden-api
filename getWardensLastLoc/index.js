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

module.exports = async function (context) {
    try {
        await sql.connect(dbConfig);

        const result = await sql.query`
            SELECT 
                e.id,
                e.staff_number,
                e.entry_datetime,
                e.exit_datetime,
                u.first_name,
                u.last_name,
                b.building_name
            FROM entries e
            JOIN users u ON u.warden_id = e.staff_number
            LEFT JOIN buildings b ON e.building_id = b.id
            WHERE e.id IN (
                SELECT MAX(e2.id)
                FROM entries e2
                GROUP BY e2.staff_number
            )
            ORDER BY e.staff_number
        `;

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Warden entries fetched successfully',
                data: result.recordset
            }
        };
    } catch (err) {
        context.log.error('Error retrieving warden entries:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error retrieving warden entries'
            }
        };
    }
};