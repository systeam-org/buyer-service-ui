import React from "react";
//import "./LoaderButton.css";
import { Button } from "react-bootstrap";

export default function LoaderButton({
                                         isLoading,
                                         className = "",
                                         disabled = false,
                                         ...props
                                     }) {
    return (
        <Button
            className={`LoaderButton ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {props.children}
        </Button>
    );
}