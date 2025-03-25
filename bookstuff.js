

const fs = require('fs');
const path = require('path');

let books = [];



function init() {
    const directoryPath = 'books';

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        files.forEach(function (file) {
            if (!file.endsWith(".txt")) { 
                return;
            }

            const filePath = path.join(directoryPath, file);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }
                const fileName = path.basename(file, '.txt');
                const content = data.toString();
                let sentences = content.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/);
                // Remove empty sentences
                sentences = sentences.filter(sentence => sentence.trim() !== '');
                // Remove newline characters
                sentences = sentences.map(sentence => sentence.replace(/\r\n/g, ' ').trim());
                sentences = sentences.map(sentence => sentence.replace(/\n/g, '').trim());
                


                books[`${fileName}`] = sentences;
            });
        });
    });
}

init();

function getRandomSentence(bookName, wordsInSentence) {
    if (!books[bookName]) {
        throw new Error(`Book ${bookName} not found`);
    }
    let sentences = books[bookName];
    // remove sentences with less than wordsInSentence words
    let filteredSentences = sentences.filter(sentence => {
        const words = sentence.split(/\s+/);
        return (words.length <= wordsInSentence);
    });
    if (filteredSentences.length === 0) {
        throw new Error(`No sentences found with at least ${wordsInSentence} words in book ${bookName}`);
    }
    const randomIndex = Math.floor(Math.random() * filteredSentences.length);
    return filteredSentences[randomIndex];
}

module.exports = {
    getRandomSentence
};