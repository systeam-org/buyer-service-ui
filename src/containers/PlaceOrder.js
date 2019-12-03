import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios"
import "./Products.css"
import config from "../config";
import LoaderButton from "../components/LoaderButton";
import {CardElement, injectStripe} from 'react-stripe-elements';

 function PlaceOrder(props) {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState("");
    useEffect(() => {
        async function onLoad() {
            try {
                const prods = await loadProducts();
                setProducts(prods)
            } catch (e) {
                alert(e);
            }
            setIsLoading(false);
        }

        onLoad();
    }, [props.isAuthenticated]);

    function loadProducts() {
        return [props.location.state.product]
    }

    function camelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index)
        {
            return index == 0 ?  word.toUpperCase() : word.toLowerCase();
        }).replace(/\s+/g, ' ');
    }

    function renderProductsTableHeader() {
        let header = ["Image", 'Category', "Product Name", "Product Description", "Price", "Quantity"]
        return header.map((key, index) => {
            //return <th key={index}>{camelCase(key.toUpperCase().replace('_', "  "))}</th>
            return <th key={index}>{key}</th>
        })
    }
     function downloadURI(uri, name) {
         console.log("@uri",uri)
         var link = document.createElement("a");
         link.download = name;
         link.href = uri;
         link.click();
     }

    function charge(token,total_amount){
        return fetch(config.getBuyerEndPoint() + config.PAYMENT,{
              method: 'post',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  stripeToken:token.id,
                  amount:total_amount * 100,
                  currency: "usd",
                  description: "example",
                  source: 'tok_visa'})
          }).then(res => res.json())
     }

    async function handlePlaceOrder(event) {

        // event.preventDefault();

        setIsLoading(true);
         let total_amount = props.location.state.product.price * quantity

        try {
            const {token}= await props.stripe.createToken();
            const pay = await charge(token,total_amount);
            pay && downloadURI(pay.receipt_url);
            await placeOrder();
            props.history.push("/products");
        } catch (e) {
            alert(e);
            setIsLoading(false);
        }

        setIsLoading(false)
    }

    function placeOrder() {

        let total_amount = props.location.state.product.price * quantity

        let rawData =
        {
            "total_amount": total_amount,
            "created_on": new Date().toISOString().slice(0, 19).replace('T', ' '),
            "email" : config.getCookie("email"),
            "products":
            [
                {
                    "product_name" : props.location.state.product.product_name,
                    "product_id": props.location.state.product.product_id,
                    "quantity": quantity,
                    "unit_cost": props.location.state.product.price
                }
            ]
        }

        console.info(rawData)

        return axios.post(config.getBuyerEndPoint() + config.BUYER_PLACE_ORDER,rawData).then(res => {
            return res.data
        })
    }

    function renderProductsTableData() {
        return products.map((product, index) => {
            const {product_id, product_name, category_name, description, price, available_quantity, image } = product //destructuring
            let i = "data:image/jpeg;base64,"+ image
            return (
                <tr key={product_id}>
                    <td>{<img src={i}/>}</td>
                    <td>{category_name}</td>
                    <td>{product_name}</td>
                    <td>{description}</td>
                    <td>${price}</td>
                    <td>
                        <input type="text" className="form-control" id="orderQuantity" onChange={e => setQuantity(e.target.value)}/>
                    </td>
                </tr>
            )
        })
    }

    function renderProducts() {
        return (
            <div>
                <h1 id='title'>Place Order</h1>
                <table class="table">
                    <tbody>
                    <tr>{!isLoading && renderProductsTableHeader()}</tr>
                    {renderProductsTableData()}
                    </tbody>
                </table>
        <div className="payment-container">
          <h1 id='title'>Payment Details</h1>
          <div className="payment-content">
        <CardElement style={{base: {fontSize: '18px', width:'100%'}}} />
        </div>
          </div>
        <Button onClick={() => {handlePlaceOrder()}}>Place Order</Button>
            </div>
        )
    }

    return (
        <div className="Home">
        { renderProducts()}
        </div>
    );
}
export default injectStripe(PlaceOrder);