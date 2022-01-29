import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import axios from '../../axios';
import useForm from './useForm';
import { Form } from './useForm';
import "./SignUpLogin.css";


const initialValues = { 
    firstName:'', 
    lastName:'',
    email: '',
    password:'',
    confirmPassword:'',
    kind: 1
}

function SignUp({ modalFunc /*changeUser*/ }) { 

    const addUser = e => {
        //prevent the default html submit behavior to take place 
        modalFunc()
        e.preventDefault();
        axios.post('/user/register', values);
        axios.post('/user/login', values)
            .then(response => { 
                console.log(response.data);
                // changeUser(response.data);
            })
    }

    const {
        values, 
        setValues, 
        handleInputChange
    } = useForm(initialValues);

    return (
        <div className="Login">
            <Form> 
                <Grid item>
                    <TextField
                        required 
                        variant="outlined"
                        label="First Name"
                        name="firstName"
                        color="secondary"
                        fullWidth
                        value={ values.firstName } 
                        onChange={ handleInputChange }
                    />
                </Grid>
                <Grid item>
                    <TextField
                        required 
                        variant="outlined"
                        label="Last Name"
                        name="lastName"
                        color="secondary"
                        fullWidth
                        value={ values.lastName } 
                        onChange={ handleInputChange }
                    />
                </Grid>
                <Grid item>
                    <TextField
                        required 
                        variant="outlined"
                        label="Email"
                        name="email"
                        color="secondary"
                        fullWidth
                        value={ values.email } 
                        onChange={ handleInputChange }
                    />
                </Grid>
                <Grid item>
                    <TextField 
                    required 
                        variant="outlined"
                        label="Password"
                        name="password"
                        type="password"
                        color="secondary"
                        fullWidth
                        value={ values.password }
                        onChange={ handleInputChange }
                    />
                </Grid>
                <Grid item>
                    <TextField 
                    required 
                        variant="outlined"
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        color="secondary"
                        fullWidth
                        value={ values.confirmPassword }
                        onChange={ handleInputChange }
                    />
                </Grid>
                <Grid item> 
                    <Button variant="contained"
                    fullWidth
                    onClick={ addUser }
                    >Sign Up</Button>
                </Grid>
            </Form>
        </div>
    )
}

export default SignUp
