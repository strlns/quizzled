import React from 'react';
import Firebase from "./firebase";

export const FirebaseContext = React.createContext<Firebase|null>(null);

/*
* with "any" type for component and props, because i dont understand this:
* https://gist.github.com/thehappybug/88342c122cfb1df9f14c9a10fb4926e4
* */
export const withFirebase = (Component: any) => (props: any) => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);
