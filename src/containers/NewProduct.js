import React, { useRef, useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import axios from "axios";


export default function NewProduct(props) {
    const imagefile = useRef(null);
    const [content, setContent] = useState("");
    const [productname, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [image, setImage] = useState("");
    const [productdescription, setProductdescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [productcategories, setProductcategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {

        async function onLoad() {
            try {
                const categories = await getProductCategories()
                setProductcategories(categories)
            } catch (e) {
                alert(e);
            }
            setIsLoading(false);
        }

        onLoad();
    }, [props.isAuthenticated]);

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await addProduct();
            props.history.push("/sellerproducts");
        } catch (e) {
            alert(e);
            setIsLoading(false);
        }

        setIsLoading(false)
    }

    function handleFileChange(event) {
        imagefile.current = event.target.files[0];
    }

    function getProductCategories() {
        return axios.get(config.SELLER_BASE_URL + config.SELLER_PRODUCT_CATEGORIES
        ).then(res => {
            res.data.unshift('Select Category...')
            return res.data
        })
    }


    function addProduct() {

        let rawData = {
            category_name: selectedCategory,
            email: "seller@gmail.com",
            product_name: productname,
            description: productdescription,
            price: price,
            available_quantity: quantity
        }
        rawData = JSON.stringify(rawData)
        let formData = new FormData()
        formData.append('image', imagefile.current)
        formData.append('data', rawData)
        return axios.post(config.SELLER_BASE_URL + config.SELLER_ADD_PRODUCT,formData, {
            headers:{
                'content-type': 'application/x-www-form-urlencoded'
            },
        }).then(res => {
            return res.data
        })
    }


    function renderLander() {
        return (
            <div className="lander">
                <h1></h1>
                <p></p>
            </div>
        );
    }

    function renderProductsDetailsForm() {

        return <div className="NewProduct">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="inputProductCategory">Product Category</label>
                    <select id="inputProductCategory" className="form-control" defaultValue="Select Category..." onChange={e => setSelectedCategory(e.target.value)}>
                        {productcategories.map((category, index) => <option key={index} value={category}>{category}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="inputProductName">Product Name</label>
                    <input type="text" className="form-control" id="inputProductName" onChange={e => setProductName(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="inputProductDescription">Product Description</label>
                    <input type="text" className="form-control" id="inputProductDescription" onChange={e => setProductdescription(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="inputProductPrice">Product Price</label>
                    <input type="text" className="form-control" id="inputProductPrice" onChange={e => setPrice(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="inputProductQuantity">Product Quantity</label>
                    <input type="text" className="form-control" id="inputProductQuantity" onChange={e => setQuantity(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="inputProductImage">Product Image</label>
                    <input type="file" className="form-control" id="inputProductImage" onChange={handleFileChange}/>
                </div>

                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    bsStyle="primary"
                    isLoading={isLoading}
                >
                    Add Product
                </LoaderButton>
            </form>
        </div>
    }

    return (
        <div className="Home">
            {renderProductsDetailsForm()}
        </div>
    );
}