const pool = require('../db');
const path = require('path');

exports.getAllEnquiry = (req, res) => {
    pool.query("SELECT * FROM enquiry", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ success: true, enquiryList: results });
    })
}

exports.activeInactiveEnquiry = async (req, res) => {

    const { id, isActive } = req.body;

    // Input validation
    if (!id) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }
    else {
        await pool.query("UPDATE enquiry SET isActive = " + isActive + " WHERE id = " + id, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            else {

                return res.status(200).json({ success: true, message: isActive ? 'Enquiry Actived Successfully!' : 'Enquiry Inactived Successfully!' });
            }
        })
    }
}

exports.filterActiveInactiveEnquiry = async (req, res) => {
    const { isActive } = req.body;

    if (!isActive) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }
    else {
        await pool.query("SELECT * FROM enquiry WHERE isActive = " + isActive, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            else {

                return res.status(200).json({ success: true, enquiryList: results });
            }
        })
    }
}

exports.getAllEnquiryDocuments = async (req, res) => {
    pool.query("SELECT * FROM enquirydocuments", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ success: true, enquiryList: results });
    })
}

exports.saveEnquiryDocument = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Bad Request' });
        }

        // Extract file details
        const { filename, path: filePath, mimetype, size } = req.file;
        // const { feedback } = req.body.feedback;

        // Insert file details into the enquirydocuments table
        const query = `
            INSERT INTO enquirydocuments (feedback, filename, filepath, mimetype, size)
            VALUES (?, ?, ?, ?, ?)
        `;

        await pool.query(query, [req.body.feedback, filename, filePath, mimetype, size], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Something Went Wrong!' });
            }

            // Send success response
            return res.status(200).json({ success: true, message: 'File Uploaded Successfully!' });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Please Select a File!' });
    }
};

exports.downloadEnquiryDocument = async (req, res) => {
    try {
        const { id } = req.body;  // Get file ID from the POST request body

        // Query to get the file details based on the file ID
        const query = 'SELECT filename, filepath FROM enquirydocuments WHERE id = ?';
        pool.query(query, [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error retrieving file details from the database.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'File not found.' });
            }

            const file = results[0];
            const filePath = path.join(__dirname, '..', file.filepath);

            res.download(filePath, file.filename, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ success: false, message: 'Error downloading the file.' });
                }
            });


        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
    }
};
