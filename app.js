import express from 'express';
import cors from 'cors';
import {getUsers, getUser, createUser, deleteUser} from "./database.js";


const app = express();
app.use(cors());
app.use(express.json());// for read and parse json in req.body


app.get('/emails', async (req, res) => {
    const users = await getUsers();
    res.send(users);
});

// TODO: error handling when the user is not found
app.get('/emails/:id', async (req, res) => {
    const id = req.params.id;
    const user = await getUser(id);
    res.send(user);
});

app.post('/emails', async (req, res) =>{
    const {first_name, last_name, email_address} = req.body;
    const newUser = await createUser(first_name, last_name, email_address);
    res.status(201).send(newUser);
});

// app.delete('/emails/:id', async (req, res) =>{
//    await deleteUser(req.params.id);
//    res.status(204);
// });



// Error handling middleware sends a status code of 500 and console logs the error stack
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

// listens on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});