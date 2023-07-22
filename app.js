import express from 'express';

const app = express();

app.get('/users')


// Error handling middleware sends a status code of 500 and console logs the error stack
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

// listens on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});