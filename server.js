// server.js
const express = require('express');
const cors = require('cors'); // Import CORS middleware

// ---------------------- FILE UPLOAD CONFIG START ----------------------------

const multer = require('multer');
const path = require('path');

// Set up storage and filename handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/enquiry_docs'); // Directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename to save as
    }
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/fileUploads'); // Directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename to save as
    }
});

const userAvatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/user_avatar'); // Directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename to save as
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'application/pdf'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

// Initialize multer with storage configuration
const upload = multer({ storage: storage, fileFilter });
const fileHandler = multer({ storage: fileStorage, fileFilter });
const userAvatarHandler = multer({ storage: userAvatarStorage, fileFilter });

// Create uploads directory if it doesn't exist (optional)

// const fs = require('fs');
// const uploadDir = 'uploads';
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }


// ---------------------- FILE UPLOAD CONFIG END ----------------------------

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// controllers declaration
const usersController = require('./controllers/UserController');
const countryStateCityController = require('./controllers/CountryStateCityController');
const enquiryController = require('./controllers/EnquiryController');
const fileUploadController = require('./controllers/FileUploadController');
const editorController = require('./controllers/EditorController');
const templateController = require('./controllers/TemplateController');

// Routes
app.post('/api/getUser', usersController.getUser);
app.post('/api/getActiveInactiveUser', usersController.getActiveInactiveUser);
app.post('/api/getFilteredUsers', usersController.getFilteredUsers);
app.post('/api/addUpdateUser', userAvatarHandler.single('avatar'), usersController.addUpdateUser);
app.post('/api/searchUser', usersController.searchUser);
app.post('/api/toggleActiveInactiveUser', usersController.toggleActiveInactiveUser);
app.post('/api/updateActiveInactiveUser', usersController.updateActiveInactiveUser);
app.post('/api/getPayslipList', usersController.getPayslipList);
app.post('/api/getInterest', usersController.getInterest);

app.get('/api/getAllCountry', countryStateCityController.getAllCountry);
app.post('/api/getAllStateByCountry', countryStateCityController.getAllStateByCountry);
app.post('/api/addUpdateCountryState', countryStateCityController.addUpdateCountryState);
app.post('/api/getCountryState', countryStateCityController.getCountryState);
app.get('/api/getAllLocations', countryStateCityController.getAllLocations);
app.post('/api/deleteLocation', countryStateCityController.deleteLocation);

app.get('/api/getAllEnquiry', enquiryController.getAllEnquiry);
app.post('/api/activeInactiveEnquiry', enquiryController.activeInactiveEnquiry);
app.post('/api/filterActiveInactiveEnquiry', enquiryController.filterActiveInactiveEnquiry);

app.get('/api/getAllEnquiryDocuments', enquiryController.getAllEnquiryDocuments);
app.post('/api/saveEnquiryDocument', upload.single('document'), enquiryController.saveEnquiryDocument);
app.post('/api/downloadEnquiryDocument', enquiryController.downloadEnquiryDocument);

app.post(
    '/api/uploadFile',
    fileHandler.array('documents', 10), // Allows up to 10 files with the field name "documents"
    fileUploadController.uploadFile
);
app.post('/api/getAllFiles', fileUploadController.getAllFiles);
app.get('/api/getAllFields', editorController.getAllFields);
app.post('/api/addUpdateTemplate', templateController.addUpdateTemplate);
app.post('/api/getTamplate', templateController.getTamplate);

// Middleware

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
