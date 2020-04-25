var express = require('express');
var Hospital = require('../models/hospital.model');
var Doctor = require('../models/doctor.model');
var User = require('../models/user.model');

var app = express();


// ========================================================================
// Búsqueda general
// ========================================================================

app.get('/general/:term', (req, res, next) => {
    var searchedTerm = req.params.term
    searchedTerm = new RegExp(searchedTerm, 'i');
    Promise.all([
        searchDoctors(searchedTerm),
        searchHospitals(searchedTerm),
        searchUsers(searchedTerm)
    ])
    .then(results => {
        res. status(200).json({
            ok: true,
            doctors: results[0],
            hospitals: results[1],
            users: results[2]
        })
    })
});

// ========================================================================
// Búsqueda específica
// ========================================================================
app.get('/specific/:table/:term', (req, res, next)=> {
    var table = req.params.table;
    var searchedTerm = req.params.term
    searchedTerm = new RegExp(searchedTerm, 'i');
    switch (table) {
        case 'doctors':
            promise = searchDoctors(searchedTerm)
            break;
        case 'users':
            promise = searchUsers(searchedTerm)
            break;
        case 'hospitals':
            promise = searchHospitals(searchedTerm)
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de búsqueda solo son: doctors, users, hospitals',
                err: { message: 'Tipo de tabla no válido' }
            })
    }
    promise.then( results => {
        res.status(200).json({
            ok: false,
            [table]: results
        })
    } )
})




function searchHospitals(searchedTerm) {
    return new Promise((resolve, reject)=>{
        Hospital.find({ name: searchedTerm})
        .populate('user', 'name email')
        .exec(
            (err, hospitals) => {
                if (err) {
                    reject('Falló la búsqueda', err)
                } else {
                    resolve(hospitals)
                }
            }
        )
    })
};

function searchDoctors(searchedTerm) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: searchedTerm })
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
            (err, doctors) => {
                if (err) {
                    reject('Falló la búsqueda', err)
                } else {
                    resolve(doctors)
                }
            }
        )
    })
};

function searchUsers(searchedTerm) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email')
            .or([{ name: searchedTerm }, { email: searchedTerm}])
            .populate('user', 'name email')
            .populate('hospital')
            .exec(
                (err, doctors) => {
                    if (err) {
                        reject('Falló la búsqueda', err)
                    } else {
                        resolve(doctors)
                    }
                }
            )
    })
};




module.exports = app;
