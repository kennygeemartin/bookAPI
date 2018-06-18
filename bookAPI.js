/*A Book API that manages the books in the library with Express*/


// Defining and importing the express library and file system to use in our API
var fs = require('fs');

var library = new Library("Buhari");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');


//Initializing the server with port 3000
var sv = app.listen(3000, function(){
    console.log("Server is listening on 3000");
});

//Calling the parser to make a middleware between the server and the database
app.use(parser.json());

app.get('/', function(request, response){
    response.send(library.getBooks());
});

//Creating the prototype for the book
function Book(title, author, year, id){
    this.title = title;
    this.author = author;
    this.year = year;
    this.id = id;
}


//Creating the Library prototype 
function Library(name){
    this.name = name;
    this.books = [];
    this.borrowBooks = [];
}

Library.prototype.readFile= function (){
    return JSON.parse(fs.readFileSync('./data.json'));
}

//This function updates the information on the library
Library.prototype.updateLibrary = function(books){
    fs.writeFileSync('./data.json', JSON.stringify(this.books));
}

// This function adds books to the library
Library.prototype.addBook = function(book){
    this.books = this.getBooks();
    this.books.push(book);
    this.updateLibrary();
  
}

//This function is used to get the books in the library
Library.prototype.getBooks = function(){
    this.books =  this.readFile();
    return this.books;
}

//Function that gets a book from the library using the id provided
Library.prototype.getBookById = function(id){
    
    this.books = this.readFile();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id === id){
            return this.books[i];
            }
    }
    return `Book with id: ${id} not found.`;
}


//Function that gets the index of a book which the id was provided
Library.prototype.getBookIndex = function(id){

    this.book = this.readFileSync();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id === id){
            return i;
        }
    }
    return `Book with id: ${id} not found.`;
}  

//Function that deletes a book with specified id from the library
Library.prototype.deleteBook = function(id){
    let bookIndex = this.getBookIndex(id);
    var message = "You just deleted the book, '" + this.books[bookIndex].title +
                  " by " + this.books[bookIndex].author +"("+this.books[bookIndex].year + ")'."; 
    this.books.splice(bookIndex, 1);

    this.updateLibrary(this.books);
    return message;
}

//Function updates the library with an id
Library.prototype.updateBook = function(id, updatedBook){
    let bookIndex = this.getBookIndex(id);
    if (inNan(bookIndex)) return 'Book not found and thus cannot be updated';
    else{
    this.books[bookIndex] = updatedBook;
    this.updateLibrary(this.books);
    }
}


//Function that searches and gets a book from the library using a provided parameter if the parameter is a match with a specific book in the library 
Library.prototype.getBooksByParam = function(param, value){
    var books = [];
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i][param] === value){
            books.push(this.books[i]);
        }
    }
    if (books.length<1) return 'Book not found';
    
    else return books;
}

//Function that allows user to borrow books from the library
Library.prototype.borrowBook = function(id){
    var book  = this.getBookById(id);
    this.borrowBooks.push(book);
    fs.writeFileSync('./borrowBooks.json', JSON.stringify(this.borrowBooks));

    var output = "You borrowed a book from the library Please return the book before thr specified time Thank you";
    this.deleteBook(id);
    return output;
}

//The function that returns a borrowed bok from the library
Library.prototype.returnBook = function(id){

    this.borrowBooks = JSON.parse(fs.readFileSync('./borrowedBooks.json'));
    for (let i = 0; i < this.borrowBooks.length; i++){
        if(this.borrowBooks[i].id == id){
            var book = this.borrowBook[i];
            var bookIndex = i;
        }
    }
    this.addBook(book);


    this.borrowBooks.splice(bookIndex, 1);

    var message = "You just returned a book you borrowed from the library";

    return message;
}

//Function that displays all the borrowed books
Library.prototype.viewBorrowedBooks = function(){

    this.borrowBooks = JSON.parse(fs.readFileSync('./borrowBooks.json'));
    if(this.borrowBooks.length < 1) return 'No ook have been borrowed';
    else return this.borrowBooks;
}

//Calling the add book function to add a book to the Library
app.post('/api/addBook', function(request, response){
    let params = request.body;
    let book = new Book(params.title, params.author, params.year, Math.random());
    library.addBook(book);
    response.send(library.getBooks());
});
//Calling the getBook Id function to get book Id from the library
app.get('/api/getBookById', function(request,response){
    response.send(library.getBookById(0.27225638204123714));
});
//Calling the delete book method
app.get('/api/deleteBook', function(request, response){
    library.getBookIndex(0.27225638204123714);
    response.send(library.deleteBook(0.27225638204123714));
})

//calling the update books
app.put('/api/books', function(request, response){
    let id = request.query.id;
    let body = request.body;
    library.updateBook(id, new Book(body.title, body.author, body.year, body.id));
    response.send(library.getBooks());
});

//The server calls the update book function
app.put('/app/updateBook', function(request, response){
     let id = request.query.id;
     let body = request.body;
     library.updateBook(id, new Book(body.title, body.author, body.year, id));
});

//Calling the getBookById function
app.get('/api/getBookById', function(request, response){
    let id = request.query.id;
    response.send(library.getBookById(id));
})

//Calling the delete book function
app.delete('/api/deleteBook', function(request, response){
    let id = request.query.id;
    respnse.send(library.deleteBook(id));
})

//Calling the get book by parameter function
app.get('/api/getBookByParam', function(request, response){
    let param = request.query.value;
    response.send(library.getBooksByParam(param));
})

//Calling the borrow book function
app.get('/api/borrowBook', function(request, response){
    let param = request.query.id;
    response.send(library.borrowBook(id));
})

//Callin the return book function
app.get('/api/returnBook', function(request, response){
    let id = request.query.id;
    response.send(library.returnBook(id));
})

//Calling the view borrowed books function
app.get('/api/viewBorrowedBooks', function(request, response){
    response.send(library.viewBorrowedBooks());
})
