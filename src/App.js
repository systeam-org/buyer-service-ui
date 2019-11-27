import React, { useState, useEffect, onLoad } from "react";
import logo from './logo.svg';
import { Link, withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, NavItem, Form, FormControl, Button, Dropdown } from "react-bootstrap";
import Routes from "./Routes";
import config, {getSellerUIEndPoint} from "./config";
import "./App.css"

function App(props) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAuthenticated, userHasAuthenticated] = useState(false);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        try {
            userHasAuthenticated(false);

            if(window.location.href.includes('id_token'))
            {
                let token = window.location.hash.replace("#id_token=","");
                let base64Url = token.split('.')[1];
                let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                config.setCookie("email",JSON.parse(jsonPayload).email,1);
                config.setCookie("first_name",JSON.parse(jsonPayload).given_name,1);
                config.setCookie("last_name",JSON.parse(jsonPayload).family_name,1);
                config.get_user(JSON.parse(jsonPayload).email)
                userHasAuthenticated(true)
            }
            else if(config.getCookie("email") && config.getCookie("role")) {
                userHasAuthenticated(true)
            }


        }
        catch(e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }
        setIsAuthenticating(false)

    }

    function handleLogout() {
        userHasAuthenticated(false);
        props.history.push("/login");
    }

  return (
      !isAuthenticating &&

      <div className="App container">
          <h1>Buyer Portal</h1>
          <Navbar bg="dark" variant="dark">
              <Nav>
                  {isAuthenticated
                      ?
                      <>
                          <Nav.Link href="/products">Products  |</Nav.Link>
                          <Nav.Link href="/orders">Orders  |</Nav.Link>
                          <Nav.Link href={config.getSellerUIEndPoint()}>Go to Seller Portal  |</Nav.Link>
                          <Nav.Link href="/" onClick={() => {config.deleteAllCookies()}}>Logout</Nav.Link>

                      </>
                      :
                      <>
                      <Nav.Link href={config.getLoginURL() + config.getRedirectURL()+ "/products"}>Login</Nav.Link>

                      </>
                  }
              </Nav>
          </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </div>
  );
}

export default withRouter(App);
