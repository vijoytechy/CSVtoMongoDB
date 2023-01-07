const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const csv = require('csvtojson')
const userSchema = require('./models/UserModel')
const cors = require("cors");
var corsOptions = {
    origin: "http://localhost:4200"
};
const app = express()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})
const uploads = multer({ storage: storage })
mongoose
    .connect('mongodb://localhost:27017/bulk-uploads', { useNewUrlParser: true })
    .then(() => console.log('Connected'))
    .catch((err) => console.log(err))

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, 'public')))
app.get('/', (req, res) => {
    userSchema.find((err, data) => {
        if (err) {
        } else {
            if (data != '') {
                res.json(data);
            } else {
                console.log("no data");
                res.json(data);
            }
        }
    })
})
const userData = [];
app.post('/upload', uploads.single('csvFile'), (req, res) => {
    csv()
        .fromFile(req.file.path)
        .then((response) => {
            for (var x = 0; x < response; x++) {
                userData = (response[x].Name)
                response[x].Name = userData
                userData = (response[x].Email)
                response[x].Email = userData
                userData = (response[x].Designation)
                response[x].Designation = userData
                userData = (response[x].Mobile)
                response[x].Mobile = userData
            }
            userSchema.insertMany(response, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("data inserted", data);
                }
            })
        })
})
var port = process.env.PORT || 5555
app.listen(port, () => console.log('App connected on: ' + port))