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
    const staff_number = req.params.staff_number;

    if (!staff_number) {
        context.res = {
        status: 400,
        body: "Missing staff number"
        };
        return;
    }

    try {
        sql.connect(dbConfig);

        const result = await sql.query`
        SELECT * FROM wardens WHERE staff_number = ${staff_number}
        `;

        if (result.recordset.length === 0) {
        context.res = {
            status: 404,
            body: "Warden not found"
        };
        } else {
        context.res = {
            status: 200,
            body: result.recordset[0]
        };
        }
    } catch (err) {
        console.error("Error retrieving warden:", err);
        context.res = {
        status: 500,
        body: "Error retrieving warden"
        };
    }
};