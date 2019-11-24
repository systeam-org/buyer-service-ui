import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios"
import "./Products.css"
import config from "../config";
import LoaderButton from "../components/LoaderButton";



export default function PlaceOrder(props) {
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
        // return axios.get(config.SELLER_BASE_URL + config.SELLER_PRODUCTS_API, {
        //     params: {
        //         email: 'seller1@gmail.com'
        //     }
        // }).then(res => {
        //     return res.data
        // })
    }

    function renderProductsList(products) {
        return [{}].concat(products).map((product, i) =>
            i !== 0 ? (
                <LinkContainer key={product.product_id} to={`/products/${product.product_id}`}>
                    <ListGroupItem header={product.product_name.trim().split("\n")[0]}>
                        {"Product Description: " + product.description}
                    </ListGroupItem>
                </LinkContainer>

            ) : (
                <LinkContainer key="new" to="/products/new">
                    <ListGroupItem>
                        <h4>
                            <b>{"\uFF0B"}</b> Add a new product
                        </h4>
                    </ListGroupItem>
                </LinkContainer>
            )
        );
    }


    function renderLander() {
        return (
            <div className="lander">
                <h1></h1>
                <p></p>
            </div>
        );
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

    async function handlePlaceOrder(event) {
        //event.preventDefault();

        setIsLoading(true);

        try {
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
            "email" : "buyer@gmail.com",
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

        return axios.post(config.BUYER_BASE_URL + config.BUYER_PLACE_ORDER,rawData).then(res => {
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
                <table>
                    <tbody>
                    <tr>{!isLoading && renderProductsTableHeader()}</tr>
                    {renderProductsTableData()}
                    </tbody>
                </table>

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