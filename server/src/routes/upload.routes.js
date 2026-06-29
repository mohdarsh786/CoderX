const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const { upload } = require('../config/upload')
const { extractText } = require('../services/fileExtract.service')

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const fileData = await extractText(req.file)
    res.json(fileData)
  } catch (err) {
    console.error('Upload error:', err.message)
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
