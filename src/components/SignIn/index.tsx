import React, {Component, FormEvent} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {SignUpLink} from '../SignUp';
import Firebase, {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {Box, Button, Container, Grid, TextField} from "@material-ui/core";
import {PaperBox} from "../MaterialUiTypeScriptHelper/PaperBox";

const SignInPage = () => (
    <Container maxWidth="lg">
        <h1>SignIn</h1>

        <Box display="flex" flexDirection="column" alignItems="center">
            <PaperBox p={4} my={4} elevation={3}>
                <SignInForm/>
            </PaperBox>
            <PaperBox maxWidth="16rem" display="inline-block" p={2} elevation={1} my={4}>
                <SignUpLink/>
            </PaperBox>
        </Box>
    </Container>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null
};

type SignInFormState = {
    email: string,
    password: string,
    error: Error | null
}

interface SignInFormProps extends RouteComponentProps
    <any> {
    firebase: Firebase
}

class SignInFormBase extends Component<SignInFormProps, SignInFormState> {
    constructor(props: any) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event: FormEvent) => {
        const {email, password} = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(userCredential => {
                this.setState({...INITIAL_STATE});
                this.props.history.push(ROUTES.HOME);
                console.log(userCredential);
            })
            .catch(error => {
                this.setState({error});
            });

        event.preventDefault();
    };

    render() {
        const minLengthInputProps = {
            minLength: 8
        };

        return (
            <form onSubmit={this.onSubmit}>
                <Grid container spacing={4} justify="center">
                    <Grid item xs={12} lg={6}>
                        <TextField
                            name="email"
                            value={this.state.email}
                            onChange={e => this.setState({email: e.target.value})}
                            type="text"
                            required={true}
                            label="E-Mail-Adresse"
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
                    <Grid item>
                        <Button variant="contained" color="primary" size="large"
                                type="submit">
                            Sign In
                        </Button>
                    </Grid>

                    {this.state.error && <Grid item xs={12}><p>{this.state.error.message}</p></Grid>}
                </Grid>
            </form>
        );
    }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default SignInPage;

export {SignInForm};