const { pool } = require('../config/database');

const outageFields = [
    'started_at',
    'ended_at',
    'description',
    'component_id',
    'type',
    'address_description',
    'cause_id'
];

const outageSelectFields = `
    o.id,
    ${outageFields.map(field => `o.${field}`).join(', ')},
    c.name AS component_name,
    cc.code AS cause_code,
    cc.description AS cause_description
`;

async function getAllOutages(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `
            SELECT ${outageSelectFields}
            FROM outages o
                     JOIN components c
                          ON o.component_id = c.id
                     LEFT JOIN cause_codes cc
                               ON o.cause_id = cc.id
            ORDER BY o.id
                LIMIT $1
            OFFSET $2
        `,
        [limit, offset]
    );

    return result.rows;
}

async function getOutageById(id) {
    const result = await pool.query(
        `
            SELECT ${outageSelectFields}
            FROM outages o
                     JOIN components c
                          ON o.component_id = c.id
                     LEFT JOIN cause_codes cc
                               ON o.cause_id = cc.id
            WHERE o.id = $1
        `,
        [id]
    );

    return result.rows[0];
}

async function createOutage(data) {
    const values = outageFields.map(field => data[field] ?? null);

    const placeholders = outageFields
        .map((_, index) => `$${index + 1}`)
        .join(', ');

    const result = await pool.query(
        `
        INSERT INTO outages (${outageFields.join(', ')})
        VALUES (${placeholders})
        RETURNING *
        `,
        values
    );

    return result.rows[0];
}

async function updateOutage(id, data) {
    const values = outageFields.map(field => data[field] ?? null);

    const setClause = outageFields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');

    const result = await pool.query(
        `
        UPDATE outages
        SET ${setClause}
        WHERE id = $${outageFields.length + 1}
        RETURNING *
        `,
        [...values, id]
    );

    return result.rows[0];
}

async function deleteOutage(id) {
    const result = await pool.query(
        `
            DELETE FROM outages
            WHERE id = $1
                RETURNING *
        `,
        [id]
    );

    return result.rows[0];
}

async function componentExists(componentId) {
    const result = await pool.query(
        `
        SELECT id
        FROM components
        WHERE id = $1
        `,
        [componentId]
    );

    return result.rows.length > 0;
}

async function causeExists(causeId) {
    const result = await pool.query(
        `
        SELECT id
        FROM cause_codes
        WHERE id = $1
        `,
        [causeId]
    );

    return result.rows.length > 0;
}

module.exports = {
    getAllOutages,
    getOutageById,
    createOutage,
    updateOutage,
    deleteOutage,
    componentExists,
    causeExists
};