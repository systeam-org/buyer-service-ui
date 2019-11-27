import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios"
import "./Products.css"
import config from "../config";
import LoaderButton from "../components/LoaderButton";

export default function Products(props) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
        return axios.get(config.getBuyerEndPoint() + config.BUYER_PRODUCTS_API, {
            params: {
                email: config.getCookie("email")
            }
        }).then(res => {
            return res.data
        })
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
        let header = ["Image", 'Category', "Product Name", "Product Description", "Price", "Buy"]
        return header.map((key, index) => {
            //return <th key={index}>{camelCase(key.toUpperCase().replace('_', "  "))}</th>
            return <th key={index}>{key}</th>
        })


    }


    function renderProductsTableData() {
        return products.map((product, index) => {
            const {product_id, product_name, category_name, description, price, image } = product //destructuring
            let i = "data:image/jpeg;base64,"+ image
            return (
                <tr key={product_id}>
                    <td>{<img src={i}/>}</td>
                    <td>{category_name}</td>
                    <td>{product_name}</td>
                    <td>{description}</td>
                    <td>${price}</td>
                    <td>
                        <LinkContainer key="new" to={{
                            pathname: '/placeorder',
                            state: { product }
                        }}>
                            <LoaderButton
                                block
                                type="submit"
                                bsSize="large"
                                bsStyle="primary"
                                isLoading={isLoading}
                            >
                                Buy Now
                            </LoaderButton>
                        </LinkContainer>
                    </td>
                </tr>
            )
        })
    }

    function renderProducts() {
        return (
            <div>
                <h1 id='title'></h1>
                <table>
                    <tbody>
                    <tr>{renderProductsTableHeader()}</tr>
                    {renderProductsTableData()}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="Home">
            { renderProducts()}
        </div>
    );
}