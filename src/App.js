import React, { useState, useEffect, onLoad } from "react";
import logo from './logo.svg';
import { Link, withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, Form, FormControl, Button, Dropdown } from "react-bootstrap";
import Routes from "./Routes";
import config from "./config";

function App(props) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAuthenticated, userHasAuthenticated] = useState(false);
  return (
      <div className="App container">
          <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="#home"></Navbar.Brand>
              <Nav className="mr-auto">
                  <Nav.Link href="/products">Home</Nav.Link>
                  <Nav.Link href="/orders">Orders</Nav.Link>
                  <Nav.Link href={config.SELLER_UI_BASE_URL}>Seller Portal</Nav.Link>
              </Nav>
          </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </div>
  );
}

export default withRouter(App);
