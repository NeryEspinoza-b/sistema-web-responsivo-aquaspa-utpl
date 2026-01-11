const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/servicios')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = Date.now() + ext
    cb(null, uniqueName)
  }
})

const uploadServicio = multer({ storage })

module.exports = uploadServicio