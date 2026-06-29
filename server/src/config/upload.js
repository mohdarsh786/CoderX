const multer = require('multer')

const ALLOWED_EXTS = ['py','js','ts','jsx','tsx','java','cpp','c','cs','go','rs','sql','html','css','pdf','txt','md']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase()
    if (ALLOWED_EXTS.includes(ext)) return cb(null, true)
    cb(new Error('File type not supported'))
  },
})

module.exports = { upload }
