const pool = require('../db');

exports.getAllCountry = (req, res) => {
    pool.query("SELECT * FROM country", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        const response = results.rows;
        res.json({ success: true, data: response });
    });

}

exports.getAllStateByCountry = (req, res) => {
    pool.query("SELECT * FROM state WHERE cid IN (" + req.body.cid + ")", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        const response = results.rows;
        res.json({ success: true, data: response });
    })

}

exports.getCountryState = (req, res) => {
    pool.query(
        "SELECT * FROM tbl_dpd_country_state WHERE id = $1",
        [req.body.id], // Pass id as a parameter
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            const response = results.rows;
            res.json({ success: true, data: response[0] });
        }
    );

}

exports.addUpdateCountryState = (req, res) => {
    let values;
    let query;
    if (req.body.id) {
        values = [
            req.body.id,
            req.body.cid,
            req.body.sid,
            req.body.cname,
            req.body.sname,
        ];
        query = `
                UPDATE tbl_dpd_country_state
                SET
                    cid = $2,
                    sid = $3,
                    cname = $4,
                    sname = $5
                WHERE id = $1
            `;
    }
    else {
        values = [
            req.body.cid,
            req.body.sid,
            req.body.cname,
            req.body.sname,
        ];
        query = `
                INSERT INTO tbl_dpd_country_state 
                (
                    cid, 
                    sid,
                    cname,
                    sname
                ) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id
            `;
    }

    pool.query(query, values, (error, result) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Something Went Wrong!', error: error });
        } else {
            if ('id' in req.body)
                return res.status(200).json({ success: true, message: 'Location Updated Successfully' });
            else
                return res.status(200).json({ success: true, message: 'Location Added Successfully', locationId: result.rows[0].id });
        }
    });
};

exports.getAllLocations = (req, res) => {
    pool.query("SELECT * FROM tbl_dpd_country_state", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        const response = results.rows;
        res.json({ success: true, data: response });
    });
};

exports.deleteLocation = (req, res) => {
    if (req.body.id) {
        const values = [req.body.id];
        const query = `
            DELETE FROM tbl_dpd_country_state
            WHERE id = $1
        `;

        pool.query(query, values, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Something Went Wrong!',
                    error: error,
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Location Deleted Successfully',
                });
            }
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Invalid Request! ID is required.',
        });
    }

}