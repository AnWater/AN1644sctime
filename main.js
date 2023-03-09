const { Int32, ObjectId } = require('bson')
var express = require('express')
var app = express()
const { insertToy, updateToy, getAllToys, deleteToysById, findToyById, searchToyByName } = require('./databaseHandler')
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.post('/search', async (req, res) => {
    const search = req.body.search
    const results = await searchToyByName(search)
    console.log(results)
    res.render('view', { 'results': results })
})
app.post('/new', async (req, res) => {
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPic
    let year = req.body.txtYear
    let quantity = req.body.txtQuantity
    let newToy = {
        name: name,
        price: Number.parseInt(price),
        pictureURL: picture,
        year: Number.parseInt(year),
        quantity: Number.parseInt(quantity),
    };
    if (isNaN(quantity)) {
        let modelError = {
            quantityError: "Please enter a number",
        };
        res.render('newToy', { results: modelError });
    }
    else if (name.trim().length > 20) {
        let modelError = {
            nameError: "Name was too long",
        };
        res.render('newToy', { results: modelError });
    }
    else if (isNaN(price)) {
        let modelError = {
            priceError: "Please enter a number",
        };
        res.render('newToy', { results: modelError });
    }// < 20 nhap lai 
    else if (price < 20) {
        let modelError = {
            nameError: "Price more short",
        };
        res.render('newToy', { results: modelError });
    }
    else {
        let newId = await insertToy(newToy)
        console.log(newId.insertedId)
        res.render('home')
    }
})

app.get('/view', async (req, res) => {
    const results = await getAllToys()
    res.render('view', { 'results': results })
})
app.get('/delete', async (req, res) => {
    const id = req.query.id
    await deleteToysById(id)
    res.redirect('/view')
})
app.post('/edit', async (req, res) => {
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picture = req.body.txtPic
    let year = req.body.txtYear
    let quantity = req.body.txtQuantity
    await updateToy(id, name, price, picture, year, quantity)
    res.redirect('/view')
})

app.get('/edit', async (req, res) => {
    const id = req.query.id
    const toyToEdit = await findToyById(id)
    res.render('edit', { toy: toyToEdit })
})
app.get('/new', (req, res) => {
    res.render('newToy')
})

app.get('/', (req, res) => {
    res.render('home')
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let client = await MongoClient.connect(url)
    const db = client.db("Gundam_store");

    const user = await db.collection('users').findOne({ email });

    if (!user) {

        return res.status(401).send('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
    }
    res.redirect("/mainpage");

});
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log("Server is up!")


