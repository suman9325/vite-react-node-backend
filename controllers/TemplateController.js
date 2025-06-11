const pool = require('../db');

exports.addUpdateTemplate = (req, res) => {

    let values;
    let query;
    if ('id' in req.body) {
        values = [
            req.body.id,
            req.body.template_name,
            req.body.template_country,
            req.body.template_type
        ];
        query = `
        UPDATE tbl_template_master
        SET 
            template_name = $2,
            template_country = $3,
            template_type = $4
        WHERE id = $1
    `;
    }
    else {
        values = [
            req.body.template_name,
            req.body.template_country,
            req.body.template_type
        ];
        query = `
            INSERT INTO tbl_template_master 
            (
                template_name, 
                template_country, 
                template_type
            ) 
            VALUES ($1, $2, $3) 
            RETURNING id
        `;
    }

    pool.query(query, values, (error, result) => {
        console.log(error, '**');
        
        if (error) {
            return res.status(500).json({ success: false, message: 'Something Went Wrong!', error: error });
        } else {
            if ('id' in req.body)
                return res.status(200).json({ success: true, message: 'Template Updated Successfully' });
            else
                return res.status(200).json({ success: true, message: 'Template Added Successfully', templateId: result.rows[0].id });
        }
    });
};

exports.getTamplate = (req,res)=>{
    const id = req.body.id;

    if (id == '' || id == null) {
        pool.query('SELECT * FROM tbl_template_master', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            const response = results.rows;
            res.json({ success: true, data: response });
        });
    } else {
        pool.query('SELECT * FROM tbl_template_master WHERE id = $1', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            const response = results.rows[0];
            res.json({ success: true, data: response });
        });
    }
}