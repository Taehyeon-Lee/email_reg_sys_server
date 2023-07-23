import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import {getUsers, getUser, createUser, deleteUser} from "./database.js";


const app = express();
app.use(cors());
app.use(express.json());// for read and parse json in req.body


// transporter object to send email
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "required-address-test@outlook.com",
        pass: "testpassword486"
    }
});


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


app.post('/emails', async (req, res) => {
    const {first_name, last_name, email_address} = req.body;
    // console.log(req.body);
    // console.log(first_name, last_name, email_address)


    // confirmation email details
    const mailOptions = {
        from: "required-address-test@outlook.com",
        to: `${email_address}`,
        subject: 'Email Confirmation',
        text: `Dear ${first_name} ${last_name}, thank you for registering. Your email (${email_address}) has been registered.`,
    };
    // console.log(mailOptions.to);
    // console.log(mailOptions.text);


    // transporter.sendMail(mailOptions, async (error, info) => {
    //     if (error) {
    //         console.error(error.stack);
    //         res.status(500).json({message: "Error occur while sending email"});
    //     } else {
    //         console.log("Email sent successfully");
    //         const newUser = await createUser(first_name, last_name, email_address);
    //         res.status(201).send(newUser);
    //     }
    // });






    // send confirmation email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

        // After successfully sending the email, create the user in the database
        const newUser = await createUser(first_name, last_name, email_address);
        res.status(201).send(newUser);
    } catch (e) {
        console.error(e.stack);
        res.status(500).json({message: "Error occur while sending email"});
    }

});

app.delete('/emails/:id', async (req, res) => {
    const id = req.params.id;
    await deleteUser(id);
    res.status(204).json();
});


// Error handling middleware sends a status code of 500 and console logs the error stack
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

// listens on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});