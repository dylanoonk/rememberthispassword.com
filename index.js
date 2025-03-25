const express = require('express');
const path = require('path');
const config = require('./config.json');
const fs = require('fs');
const bookstuff = require('./bookstuff.js');

const app = express();
const port = config.port || 3000;


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function flipACoin(option1, option2) {
    const coin = Math.random();
    if (coin < 0.5) {
        return option1;
    } else {
        return option2;
    }
}

function addRandomCharactersToEnd(password) {
    const characters = '0123456789!@#';
    const amountOfCharacters = Math.floor(Math.random() * 5) + 2;
    password += '_';
    for (let i = 0; i < amountOfCharacters; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

function passwordify(sentence) {
    let password = '';
    for(let i = 0; i < sentence.length; i++) {
        
        //if (sentence[i].match(/^[A-Za-z]+$/)) { sentence[i] = flipACoin(sentence[i].toUpperCase(), sentence[i].toLowerCase() ); }
        //console.log(sentence[i]);
        
        if (sentence[i].match(/[!@#$%^&*(),.?"“”':{}|<>]/)) { continue; }
        else if (sentence[i] === ' ') { password += '_'; }
        else if (sentence[i].match(/[0-9]/)) { password += sentence[i]; }
        else if (sentence[i].toLowerCase() === 'a') { password += flipACoin('4', 'a'); }
        else if (sentence[i].toLowerCase() === 'e') { password += flipACoin('3', 'e'); }
        else if (sentence[i].toLowerCase() === 'i') { password += flipACoin('1', 'i'); }
        else if (sentence[i].toLowerCase() === 'o') { password += flipACoin('0', 'o'); }
        else if (sentence[i].toLowerCase() === 's') { password += flipACoin('$', 's'); }
        else if (sentence[i].toLowerCase() === 'l') { password += flipACoin('1', 'l'); }
        else { password += sentence[i]; }


    }

    let passwordArr = password.split("");
    for (let i = 0; i < passwordArr.length; i++) {
        if (passwordArr[i].match('[a-zA-Z]')) { passwordArr[i] = flipACoin(passwordArr[i].toUpperCase(), passwordArr[i].toLowerCase() ); }
    }
    password = passwordArr.join("");

    return addRandomCharactersToEnd(password);
}

function getAllBooks() {
    const directoryPath = 'books';
    const books = [];

    fs.readdirSync(directoryPath).forEach(file => {
        if (file.endsWith('.txt')) {
            const fileName = path.basename(file, '.txt');
            books.push(fileName);
        }
    });

    return books;
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', message: 'Welcome to Express with EJS!' });
});

app.get('/assets/:asset_name', (req, res) => {
    const assetName = req.params.asset_name;
    const assetPath = path.join(__dirname, 'assets', assetName)
   
    if (!fs.existsSync(assetPath)) {
        return res.status(404).send('Asset not found');
    }

    res.sendFile(assetPath);
});

app.post('/passphrase', (req, res) => {
    const books = getAllBooks();
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const sentence = bookstuff.getRandomSentence(randomBook, 5);

    if (!sentence) {
        return res.status(500).send('Error generating passphrase');
    }
    res.send({ "passphrase": passwordify(sentence) , "book": randomBook, "original": sentence });


});

// Handle 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404', message: 'Page not found' });
});

// Handle 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: '500', message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});