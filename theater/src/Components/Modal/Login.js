import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import "./SignUpLogin.css";
import axios from '../../axios';
import useForm from './useForm';
import { Form } from './useForm';


const initialValues = { 
    email: '',
    password: ''
}

function Login({ modalFunc /*changeUser*/ }) { 

    const LoginUser = e => { 
        console.log("INSIDE LOGIN USER");
        modalFunc();
        e.preventDefault();
        axios.post('/user/login', values, {withCredentials: true})
            .then(response => { 
                console.log("in login user");
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
                    <Button 
                        variant="contained"
                        fullWidth
                        onClick = { LoginUser }>
                    Login
                    </Button>
                </Grid>
            </Form>
        </div>
    )
}

export default Login
