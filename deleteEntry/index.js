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
    const { entry_id } = req.body || {};
    context.log('Request body:', req.body);

    if (!entry_id) {
        context.res = {
            status: 400,
            body: {
                success: false,
                message: 'Missing required value: entry_id',
            }
        };
        return;
    }

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`
            DELETE FROM entries WHERE id = ${entry_id}
        `;

        if (result.rowsAffected[0] === 0) {
            context.res = {
                status: 404,
                body: {
                    success: false,
                    message: 'No entry found with the given ID',
                }
            };
            return;
        }

        context.res = {
            status: 200,
            body: {
                success: true,
                message: 'Successfully deleted the entry',
            }
        };
    } catch (err) {
        context.log.error('Error deleting entry:', err);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: 'Error deleting entry',
            }
        };
    }
};
