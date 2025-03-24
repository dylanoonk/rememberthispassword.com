const express = require('express');
const path = require('path');
const config = require('./config.json');
const fs = require('fs');

const app = express();
const port = config.port || 3000;


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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