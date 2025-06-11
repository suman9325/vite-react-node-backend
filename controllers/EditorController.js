const pool = require('../db');

exports.getAllFields = (req, res) => {
    pool.query('SELECT * FROM tbl_chkbx_field', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        const response = results.rows;
        res.json({ success: true, data: response });
    });
}
