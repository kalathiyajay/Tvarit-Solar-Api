// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const folderName = file.fieldname;
//         const uploadPath = path.join('public', folderName);

//         fs.mkdir(uploadPath, { recursive: true }, function (err) {
//             if (err) {
//                 return cb(err);
//             }
//             cb(null, uploadPath);
//         });
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname.replaceAll(' ', '')}`);
//     }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'dealerImage') {
        const maxSize = 2 * 1024 * 1024; // 2MB for dealerImage

        // Check file size only for dealerImage
        if (file.size > maxSize) {
            cb(new Error('File size too large. Maximum size is 2MB for dealerImage'), false);
            return;
        }
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = file.fieldname;
        const uploadPath = path.join('public', folderName);

        fs.mkdir(uploadPath, { recursive: true }, function (err) {
            if (err) {
                return cb(err);
            }
            cb(null, uploadPath);
        });
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replaceAll(' ', '')}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: file => {
            // Apply 2MB limit only for dealerImage, unlimited for others
            if (file.fieldname === 'dealerImage') {
                return 2 * 1024 * 1024; // 2MB
            }
            return Infinity; // No limit for other fields
        }
    }
});

module.exports = upload;