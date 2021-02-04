const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path');
const Transaction = require("../models/transaction");
const Category = require("../models/category");
const mongoose = require('mongoose');
const history = require('connect-history-api-fallback');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(history());

mongoose.connect('mongodb+srv://julianscheiner:2t1z3i9o@cluster0-m07la.mongodb.net/money-control?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connection to Mongoose Succeeded");
});

var ids = [];

// Add new Transaction
app.post('/transactions', (req, res) => {
  const reqBody = req.body;
  let newTransaction = new Transaction({
    amount: reqBody.amount,
    date: reqBody.date,
    wiederkehrend: reqBody.wiederkehrend,
    category: reqBody.category,
    note: reqBody.note
  })

  newTransaction.save(error => {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Transaction saved successfully!'
    })
  })
})

// Fetch all Transactions
app.get('/transactions', (req, res) => {
  Transaction.find({}, 'amount date wiederkehrend category note', (error, transactions) => {
    if (error) { console.error(error); }
    res.send({
      transactions: transactions
    })
  })
  .sort({date:1})
})

// Fetch single Transaction
app.get('/transaction/:id', (req, res) => {
  Transaction.findById(req.params.id, 'amount date wiederkehrend category note', (error, transaction) => {
    if (error) { console.error(error); }
    res.send(transaction)
  })
})

// Delete a Transaction
app.delete('/transactions/:id', (req, res) => {
  Transaction.remove({
    _id: req.params.id
  }, function(err){
    if (err) res.send(err);
    res.send({
      success: true
    })
  })
})

// Update a transaction
app.put('/transactions/:id', (req, res) => {
  Transaction.findById(req.params.id, 'amount date wiederkehrend category note', (error, transaction) => {
    if (error) { console.error(error); }
    let reqBody = req.body;
    transaction.amount = reqBody.amount;
    transaction.date = reqBody.date;
    transaction.wiederkehrend = reqBody.wiederkehrend;
    transaction.category = reqBody.category;
    transaction.note = reqBody.note;
    transaction.save(function (err) {
      if (err) {
        res.send(err)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete all Transactions
app.delete('/transactions', (req, res) => {
  Transaction.count({}, function(err, count){
    let number = count;
    Transaction.find({}, 'amount date wiederkehrend category note', function (err, transactions) {
      if (err) { console.error(err); }
      ids = transactions;
    })
    .sort({_id:-1})
    setTimeout( function(){
      for(var a=0;a<number;a++){
        Transaction.remove({
          _id: ids[a]
        }, function(err){
          if (err)
            res.send(err)
        })
      }
      console.log("Datensätze gelöscht!")
    } , 10000);
  })
})

// Fetch all Categories
app.get('/categories', (req, res) => {
  Category.find({}, 'name', function (err, categories) {
    if (err) { console.error(err); }
    res.send({
      categories: categories
    })
  })
  .sort({name:1})
})

// Add new category
app.post('/categories', (req, res) => {
  var newCategory = new Category({
    name: req.body.name
  })

  newCategory.save(function (err) {
    if (err) {
      console.log(err)
    }
    res.send({
      success: true,
      message: 'Category saved successfully!'
    })
  })
})
/*
const staticFileMiddleware = express.static(__dirname + '/dist/');
app.use(staticFileMiddleware);
app.use(history());
app.use(staticFileMiddleware);*/
//app.get(/.*/, (req, res) => res.sendFile(__dirname + 'dist/index.html'))

app.listen(process.env.PORT || 8081, () => {
  console.log('Connection successful!')
})