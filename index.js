let express = require('express')
let app = express()
let fs = require('fs')
let path = require('path')
let _ = require('lodash')
let engines = require('consolidate')
let JSONStream = require('JSONStream')
let bodyParser = require('body-parser')

app.engine('hbs', engines.handlebars)

app.set('views', './views')
app.set('view engine', 'hbs')

app.use('/profilepics', express.static('images'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/favicon.ico', (req, res) => {
  res.end()
})

app.get('/', (req, res) => {

  let users = []
  fs.readdir('users', (err, files) => {
    if (err) throw err
    files.forEach((file) => {
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, (err, data) => {
        if (err) throw err
        let user = JSON.parse(data)
        user.name.full = _.startCase(`${user.name.first} ${user.name.last}`)
        users.push(user)
        if (users.length === files.length) res.render('index', {users: users})
      })
    })
  })
})

app.get('*.json', (req, res) => {
  res.download('./users/' + req.path, 'virus.exe')
})

app.get('/data/:username', (req, res) => {
  let username = req.params.username
  let readable = fs.createReadStream('./users/' + username + '.json')
  readable.pipe(res)
})

app.get('/users/by/:gender', (req, res) => {
  let gender = req.params.gender
  let readable = fs.createReadStream('users.json')

  readable
    .pipe(JSONStream.parse('*', (user) => {
      if (user.gender === gender) return user.name
    }))
    .pipe(JSONStream.stringify('[\n  ', ',\n  ', '\n]\n'))
    .pipe(res)
})

app.get('/error/:username', (req, res) => {
  res.status(404).send(`No user named ${ req.params.username } found!!`)
})

let userRouter = require('./username')
app.use('/:username', userRouter)

let server = app.listen(3000, () => {
  console.log(`Server running at http://localhost: ${ server.address().port }`);
})
