//this is a Node Express server
var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var cors = require('cors')
var mongoose = require('mongoose')

//the model
var Project = require('./project-model')
var Type = require('./type-model')
var User = require('./user-model')


//setup express server
var app = express()
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(logger('dev'))

//setup database connection
var connectionString = 'mongodb://admin:pass@cluster0-shard-00-00.qiabj.mongodb.net:27017,cluster0-shard-00-01.qiabj.mongodb.net:27017,cluster0-shard-00-02.qiabj.mongodb.net:27017/testdb?ssl=true&replicaSet=atlas-id226f-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(connectionString,{ useNewUrlParser: true })
var  db = mongoose.connection
db.once('open', () => console.log('Database connected'))
db.on('error', () => console.log('Database error'))



//setup routes
var router = express.Router();

router.get('/testing', (req, res) => {
	res.send('<h1>Testing is working</h1>')
})

//CRUD projects
router.get('/projects', (req, res) => {
  	Project.find()
  	.populate('type')
	.then((projects) => {
	    res.json(projects);
  	})
})

router.get('/projects/:id', (req, res) => {
  	Project.findOne({id:req.params.id})
  	.populate('type')
	.then((project) => {
	    res.json(project)
 	})
})

router.post('/projects', (req, res) => {

  	var project = new Project()
	project.id = Date.now()
	
	var data = req.body
	// console.log(data)
	Object.assign(project,data)
	project.save()
	.then((project) => {
	  	res.json(project)
  	})
  
})

router.put('/projects/:id', (req, res) => {

	Project.findOne({id:req.params.id})
	.then((project) => {
		var data = req.body
		Object.assign(project,data)
		return project.save()	
	})
	.then((project) => {
		 res.json(project)
	})

})

router.delete('/projects/:id', (req, res) => {

	Project.deleteOne({ id: req.params.id })
	.then(() => {
		res.json('deleted')
	})
	
})

//CRUD types
router.get('/types', (req, res) => {

	Type.find()
	.then((types) => {
	    return res.json(types)
	})

})

router.get('/types/:id', (req, res) => {
	Type.findOne({id:req.params.id})
	.populate('projects')
	// .populate({ 		
	// 	path:'projects',	//deep population
	// 	populate:'type'
	// })
	.then((type) => {
	    return res.json(type)
	})
})

//CRUD users
router.get('/users/:id', (req, res) => {


	User.findOne({id:req.params.id})
	.then((user) => {
	    return res.json(user);
	});
})

router.post('/users', (req, res) => {

	var user = new User()
	user.id = Date.now()
	
	var data = req.body
	Object.assign(user,data)
	
	user.save()
	.then((user) => {
	  	return res.json(user)
	})
})

router.put('/users/:id', (req, res) => {
	User.findOne({id:req.params.id})
	.then((user) => {
		var data = req.body
		Object.assign(user,data)
		return user.save()	
	})
	.then((user) => {
		return res.json(user)
	})
})


//use server to serve up routes
app.use('/api', router)

// launch our backend into a port
const apiPort = 4000;
app.listen(apiPort, () => console.log('Listening on port '+apiPort));