exports.up = (pgm) => {
    pgm.createTable('outages', {
        id: {
            type: 'serial',
            primaryKey: true
        },

        started_at: {
            type: 'timestamp',
            notNull: true
        },

        ended_at: {
            type: 'timestamp'
        },

        description: {
            type: 'text'
        },

        component_id: {
            type: 'integer',
            notNull: true,
            references: 'components',
            onDelete: 'RESTRICT'
        },

        type: {
            type: 'varchar(20)',
            notNull: true
        },

        address_description: {
            type: 'text'
        },

        cause_id: {
            type: 'integer',
            references: 'cause_codes',
            onDelete: 'SET NULL'
        }
    });

    pgm.addConstraint('outages', 'outages_type_check', {
        check: "type IN ('planned', 'unplanned')"
    });
};

exports.down = (pgm) => {
    pgm.dropTable('outages');
};