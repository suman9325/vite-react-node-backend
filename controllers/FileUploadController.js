const pool = require('../db');
const path = require('path');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const { category, is_default } = req.body;
        // Extract file details
        const files = req.files; // Array of uploaded files
        const fileData = files.map(file => ({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype
        }));

        // Insert file details into the database
        const query = `
            INSERT INTO tbl_files (name, type, path, category, is_default)
            VALUES ($1, $2, $3, $4, $5)
        `;

        for (const file of fileData) {
            await pool.query(query, [file.filename, file.mimetype, file.path, category, is_default]);
        }

        return res.status(200).json({ success: true, message: 'Files uploaded successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Something went wrong!' });
    }
};

exports.getAllFiles = async (req, res) => {
    const baseUrl = 'http://localhost:5000'; // Base URL for your server

    pool.query('SELECT * FROM tbl_files', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const response = results.rows.map((file) => {
            // Construct full path dynamically by combining base URL with file path
            const fullPath = `${baseUrl}/${file.path.replace(/\\/g, '/')}`; // Replace backslashes with forward slashes
            return {
                ...file,
                fullPath, // Add fullPath to each file object
            };
        });

        res.json({ success: true, data: response });
    });
};
