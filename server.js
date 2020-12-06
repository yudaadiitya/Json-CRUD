const express = require('express');
const path = require('path');
const bp = require('body-parser');
const fs = require('fs');
var data = JSON.parse(fs.readFileSync(path.join(__dirname, './data.json')));
const writeData = (data) => {
    fs.writeFileSync(path.join(__dirname, './data.json'), JSON.stringify(data, null, 3), 'utf8')
};
const app = express();

// ----------- View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ----------- Body Parser
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

//------------ Set Static Path
app.use(express.static(path.join(__dirname, 'public')));
//------------- List Table
app.get('/', (req, res) => {
    res.render('index', { data: data })
})

app.post('/search', function (req, res, next) {
    const {id, string, integer, float, boolean} = req.body;
    res.render('index', { data: data });
});

// ----------- Add
app.get('/add', (req, res) => {
    res.render('add', { title: 'Add Data' });
});

app.post('/add', (req, res) => {
    let id = data.length + 1;
    data.push({ id: id, string: req.body.string, integer: req.body.integer, float: req.body.float, date: req.body.date, boolean: req.body.boolean });
    writeData(data);
    res.redirect('/');
});

// ----------- Edit
app.get('/edit/:id', (req, res) => {
    let id = req.params.id
    var index = 0;
    for (i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            index = i + 1;
            break;
        }
    } res.render('edit', { title: 'Edit Data', item: data[index] })
})

app.post('/edit/:id', (req, res) => {
    let id = req.params.id
    const { string, integer, float, date, boolean } = req.body;
    var index = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            index = i + 1;
            break;
        }
    }
    data[index].string = string;
    data[index].integer = integer;
    data[index].float = float;
    data[index].date = date;
    data[index].boolean = boolean;
    writeData(data);
    res.redirect('/')
})

// ----------- Delete
app.get('/delete/:id', (req, res) => {
    let deleteId = req.params.id
    data.splice(deleteId, 1);
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3));
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Web ini berjalan di port 3000!')
})