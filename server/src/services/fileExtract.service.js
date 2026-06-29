const pdf = require('pdf-parse')

const CODE_EXTS = ['py','js','ts','jsx','tsx','java','cpp','c','cs','go','rs','sql','html','css']
const TEXT_EXTS = ['txt','md']

const getExt = (filename) => filename.split('.').pop().toLowerCase()

const extractText = async (file) => {
  const ext = getExt(file.originalname)
  const buffer = file.buffer

  if (ext === 'pdf') {
    const { PDFParse } = require('pdf-parse')
    const parser = new PDFParse({ data: buffer })
    const data = await parser.getText()
    await parser.destroy()
    return {
      type: 'document',
      filename: file.originalname,
      content: data.text.slice(0, 8000),
    }
  }

  if (CODE_EXTS.includes(ext)) {
    return {
      type: 'code',
      filename: file.originalname,
      language: ext,
      content: buffer.toString('utf-8').slice(0, 8000),
    }
  }

  if (TEXT_EXTS.includes(ext)) {
    return {
      type: 'document',
      filename: file.originalname,
      content: buffer.toString('utf-8').slice(0, 8000),
    }
  }

  throw new Error('Unsupported file type')
}

module.exports = { extractText }
