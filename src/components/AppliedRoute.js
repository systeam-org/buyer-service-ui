import { Route } from "react-router-dom";
import React from "react";


export default function AppliedRoute({ component: C, appProps, ...rest }) {
    return (
        <Route {...rest} render={props => <C {...props} {...appProps} />} />
    );
}