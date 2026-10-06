exports.up = (pgm) => {
    pgm.sql(`
        INSERT INTO components (name, component_type, description)
        VALUES
        ('TR-101', 'Transformer', 'Çankaya bölgesi dağıtım trafosu'),
        ('CBL-201', 'Cable', 'Yeraltı enerji kablosu'),
        ('LINE-301', 'Line', 'Orta gerilim hattı');
    `);

    pgm.sql(`
        INSERT INTO cause_codes (code, description)
        VALUES
        ('CBL_FAULT', 'Kablo bağlantı arızası'),
        ('WIRE_BREAK', 'Tel kopukluğu'),
        ('MAINTENANCE', 'Planlı bakım çalışması');
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
        DELETE FROM cause_codes
        WHERE code IN ('CBL_FAULT', 'WIRE_BREAK', 'MAINTENANCE');
    `);

    pgm.sql(`
        DELETE FROM components
        WHERE name IN ('TR-101', 'CBL-201', 'LINE-301');
    `);
};