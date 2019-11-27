import React, { useState } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Login.css";

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        var data = {
            "username" : fields.email,
            "password": fields.password
        }
        var header = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
        };

        const options = {
            method : 'POST',
            headers: header,
            body: JSON.stringify(data)
        };

        props.userHasAuthenticated(true);
        props.history.push("/products");

    }

    return (
        <div/>
    );
}