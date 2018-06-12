var fs = require('fs');

var library = new Library("Buhari");

var express = require('express');
var app = express();

var sv = app.listen(3000, function(){
    console.log("Server is listening on 3000");
});

app.get('/', function(request, response){
    response.send(library.getBooks());
})


function Book(title, author, year, id){
    this.title = title;
    this.author = author;
    this.year = year;
    this.id = id;
}

function Library(name){
    this.name = name;
    //this.books = fs.readFileSync('./data.json', 'utf-8');
    this.books = [];
}

Library.prototype.readFile= function (){
    return JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
}

Library.prototype.updateLibrary = function(books){
    fs.writeFileSync('./data.json', JSON.stringify(this.books));
}

Library.prototype.addBook = function(book){
    this.books.push(book);
    //this.updateLibrary();
    // fs.writeFileSync('./data.json', JSON.stringify(this.books));
}

Library.prototype.getBooks = function(){
    this.readFile();
    // this.books = JSON.parse(fs.readFileSync('./data.json'));
    return this.books;
}

Library.prototype.getBookById = function(id){
    // var book = this.books.filter(book => book.id == id);

    this.books = this.readFile();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id === id){
            return this.books[i];
            }
    }
    return `Book with id: ${id} not found.`;
}

Library.prototype.getBookIndex = function(id){

    this.book = this.readFileSync();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id === id){
            return i;
        }
    }
    return `Book with id: ${id} not found.`;
}  

Library.prototype.deleteBook = function(id){
    let bookIndex = this.getBookIndex(id);
    var message = "You just deleted the book, '" + this.books[bookIndex].title +
                  " by " + this.books[bookIndex].author +"("+this.books[bookIndex].year + ")'."; 
    this.books.splice(bookIndex, 1);

    this.updateLibrary(this.books);
    return message;
}

Library.prototype.updateBook = function(id, updatedBook){
    let bookIndex = this.getBookIndex(id);
    this.books[bookIndex] = updatedBook;
}

Library.prototype.getBooksByParam = function(param, value){
    var books = [];
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i][param] === value){
            books.push(this.books[i]);
        }
    }
    return books;
}

var book1 = new Book('The Girl', 'Chidera', 2016, 1);
var book2 = new Book('The Boy', 'Jeni', 2018, 2);
var book3 = new Book('The Lovers', 'Olibie', 2018, 3);

var lib = new Library('Lib');

// lib.addBook(book1);
// lib.addBook(book2);
// lib.addBook(book3);

// console.log(lib.getBooks());
// console.log(lib.books);
// console.log(lib.getBookById(2));
// console.log(lib.getBookIndex(2));
// console.log(lib.getBooksByParam('year', 2018));
// console.log(lib.deleteBook(1));
// console.log(lib.books);

app.post('/api/book', function(request,response){
    let params = request.query;
    let book = new Book(params.name, params.author, params.year, Math.random());
   
    library.addBook(book);
    response.send(library.getBooks());

});






