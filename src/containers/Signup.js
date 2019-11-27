import React, { useState } from "react";
import {
    FormGroup,
    FormControl

} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";

export default function Signup(props) {
    const [fields, handleFieldChange] = useFormFields({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: ""
    });
    const [newUser, setNewUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.firstname.length > 0 &&
            fields.lastname.length > 0 &&
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        setIsLoading(false);
        var data = {
            "firstname" : fields.firstname,
            "lastname" : fields.lastname,
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

        const request = new Request('http://localhost:8080/api/v1/users', options )
        const response = await fetch(request);


    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);
        var data = {
            "firstname" : fields.firstname,
            "lastname" : fields.lastname,
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

        const request = new Request('http://localhost:8080/api/v1/users', options )
        const response = await fetch(request);

        //props.userHasAuthenticated(true);
//props.history.push("/");
    }

    function renderForm() {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" value={fields.firstname} className="form-control" id="firstname" onChange={handleFieldChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input type="text" value={fields.lastname} className="form-control" id="lastname" onChange={handleFieldChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" value={fields.email} className="form-control" id="email" onChange={handleFieldChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" value={fields.password} className="form-control" id="password" onChange={handleFieldChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="confirmpassword">Confirm Password</label>
                    <input type="password" value={fields.confirmPassword} className="form-control" id="confirmpassword" onChange={handleFieldChange}/>
                </div>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="small"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Signup
                </LoaderButton>
            </form>
        );
    }

    return (
        <div className="Signup">
            {renderForm()}
        </div>
    );
}