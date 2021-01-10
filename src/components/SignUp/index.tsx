import React, {Component, FormEvent} from 'react';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

import {withFirebase} from "../Firebase";
import Firebase from "../Firebase";
import {Box, Button, Container, Grid, Paper, TextField} from "@material-ui/core";

type SignUpFormState = {
    username: string,
    email: string,
    password: string,
    passwordRepeat: string,
    error: Error | null,
}

interface SignUpFormProps extends RouteComponentProps<any> {
    firebase: Firebase
}

const INITIAL_STATE = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    error: null,
};

class SignUpFormBase extends Component<SignUpFormProps, SignUpFormState> {

    constructor(props: SignUpFormProps) {
        super(props);

        this.state = {...INITIAL_STATE}; //shallow clone
    }

    onSubmit = (event: FormEvent) => {
        const {email, password} = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, password)
            .then(authUser => {
                this.setState({...INITIAL_STATE});
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({error});
            });

        event.preventDefault();
    }

    isInvalid = () => {
        return this.state.password !== this.state.passwordRepeat ||
            this.state.password.length < 8 ||
            this.state.email === '' ||
            this.state.username === '';
    }

    render() {
        const minLengthInputProps = {
            minLength: 8
        };
        return (
            <Container maxWidth="lg">
                <Box p={4} component={Paper}>
                    <form onSubmit={this.onSubmit}>
                        <Grid container spacing={4} justify="center">
                            <Grid item xs={12} lg={6}>
                                <TextField
                                    name="username"
                                    value={this.state.username}
                                    onChange={e => this.setState({username: e.target.value})}
                                    type="text"
                                    required={true}
                                    label="Full Name"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField
                                    name="email"
                                    value={this.state.email}
                                    onChange={e => this.setState({email: e.target.value})}
                                    type="email"
                                    required={true}
                                    label="Email Address"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField
                                    name="password"
                                    value={this.state.password}
                                    onChange={e => this.setState({password: e.target.value})}
                                    type="password"
                                    inputProps={minLengthInputProps}
                                    required={true}
                                    label="Password"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField
                                    name="passwordRepeat"
                                    value={this.state.passwordRepeat}
                                    onChange={e => this.setState({passwordRepeat: e.target.value})}
                                    type="password"
                                    inputProps={minLengthInputProps}
                                    required={true}
                                    label="Confirm Password"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" size="large" disabled={this.isInvalid()}
                                        type="submit">
                                    Sign Up
                                </Button>
                            </Grid>

                            {this.state.error && <Grid item xs={12}><p>{this.state.error.message}</p></Grid>}
                        </Grid>
                    </form>
                </Box>
            </Container>
        );
    }
}

const SignUpLink = () => (
    <div>
        <p>
            Noch kein Account vorhanden?
        </p>
        <p>
            <Link to={ROUTES.SIGN_UP}>Hier</Link> Account erstellen
        </p>
    </div>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
        <SignUpForm/>
    </div>
);

export default SignUpPage;

export {SignUpForm, SignUpLink};