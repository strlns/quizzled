import React, {Component, FormEvent} from 'react';
import {Link, withRouter, RouteComponentProps} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

import {withFirebase} from "../Firebase/context";
import Firebase from "../Firebase";

type SignUpFormState = {
    username: string,
    email: string,
    password: string,
    passwordRepeat: string,
    error: Error|null,
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

    constructor(props: any) {
        super(props);

        this.state = { ...INITIAL_STATE }; //shallow clone
    }

    onSubmit = (event: FormEvent) => {
        const { email, password } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, password)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                console.log(authUser);
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
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
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="username"
                    value={this.state.username}
                    onChange={e => this.setState(() => ({username: e.target.value}))}
                    type="text"
                    required={true}
                    placeholder="Full Name"
                />
                <input
                    name="email"
                    value={this.state.email}
                    onChange={e => this.setState(() => ({email: e.target.value}))}
                    type="email"
                    required={true}
                    placeholder="Email Address"
                />
                <input
                    name="password"
                    value={this.state.password}
                    onChange={e => this.setState(() => ({password: e.target.value}))}
                    type="password"
                    minLength={8}
                    required={true}
                    placeholder="Password"
                />
                <input
                    name="passwordRepeat"
                    value={this.state.passwordRepeat}
                    onChange={e => this.setState(() => ({passwordRepeat: e.target.value}))}
                    type="password"
                    minLength={8}
                    required={true}
                    placeholder="Confirm Password"
                />
                <button disabled={this.isInvalid()}
                        type="submit">
                    Sign Up
                </button>

                {this.state.error && <p>{this.state.error.message}</p>}
            </form>
        );
    }
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
        <SignUpForm />
    </div>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };