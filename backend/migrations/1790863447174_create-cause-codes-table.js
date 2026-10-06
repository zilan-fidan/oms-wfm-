exports.up = (pgm) => {
    pgm.createTable('cause_codes', {
        id: {
            type: 'serial',
            primaryKey: true
        },

        code: {
            type: 'varchar(50)',
            notNull: true,
            unique: true
        },

        description: {
            type: 'varchar(255)',
            notNull: true
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('cause_codes');
};