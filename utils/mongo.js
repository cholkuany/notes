const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@myatlasclusteredu.xazg4rm.mongodb.net/testNoteApp?appName=myAtlasClusterEDU`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
const Note = mongoose.model('Note', noteSchema)

// const note1 = new Note({
//   content: 'Supertest testing DB',
//   important: true
// })

// note1.save().then((note) => {
//   console.log(`saved ${note}`)
//   mongoose.connection.close()
// })

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
