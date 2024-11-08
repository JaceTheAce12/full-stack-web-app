const express = require('express');
const app = express();
const port = 4000;
const scores = require('./public/modules/scores');
const course = require('./public/modules/courses');

app.use(express.json());
app.use(express.static('public'));

app.get('/api/scores', (req, res) => {
    res.send(scores);
});

app.get('/api/course', (req, res) => {
    res.send(course);
});

app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});
