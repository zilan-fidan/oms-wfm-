exports.up = (pgm) => {
    pgm.createTable('components', {
        id: {
            type: 'serial',
            primaryKey: true
        },

        name: {
            type: 'varchar(100)',
            notNull: true
        },

        component_type: {
            type: 'varchar(50)',
            notNull: true
        },

        description: {
            type: 'text'
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('components');
};