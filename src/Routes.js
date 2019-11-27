import React, { useState }from "react";
import {Route, Switch } from "react-router-dom";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Products from "./containers/Products";
import PlaceOrder from "./containers/PlaceOrder";
import Orders from "./containers/Orders";
import AppliedRoute from "./components/AppliedRoute";


export default function Routes({ appProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Products} appProps={appProps} />
            <AppliedRoute path="/products" exact component={Products} appProps={appProps} />
            <AppliedRoute path="/orders" exact component={Orders} appProps={appProps} />
            <AppliedRoute path="/placeorder" exact component={PlaceOrder} appProps={appProps} />
            { /* Finally, catch all unmatched routes */ }
            <Route component={NotFound} />
        </Switch>
    );
}