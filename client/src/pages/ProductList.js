import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Modal, Form, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../components/Message/errorMessage';
import SuccessMessage from '../components/Message/successMessage';
import TableLoader from '../components/Loader/TableLoader';
import {
  Button as MaterialButton,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { productListForAdmin, deleteProduct, createProduct } from '../actions/productAction';
import * as routes from '../constants/routes';
import { interpolate } from '../utils/string';
import * as productConstants from '../constants/productConstants';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ProductList = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, products, count, error, success } = productList;

  const deleteProductData = useSelector((state) => state.deleteProduct);
  const { success: deleteSuccess, error: deleteFail } = deleteProductData;

  const createProductDetails = useSelector((state) => state.createProductDetails);
  const { success: createSuccess, error: createFail, loading: createLoading } = createProductDetails;

  const [name, setName] = useState('');
  const [productImage, setProductImage] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (createSuccess) {
      setOpenForm(false);
      setName('');
      setProductImage('');
      setBrand('');
      setPrice('');
      setCategory('');
      setCountInStock('');
      setDescription('');

      dispatch({ type: productConstants.CREATE_PRODUCT_RESET });
    }

    dispatch(productListForAdmin(initialLoading));

    // eslint-disable-next-line
  }, [dispatch, deleteSuccess, createSuccess]);


  async function imageToBase64 (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    console.log(reader.result)
    return reader.result;
}

  useEffect(() => {
    if (success && initialLoading) {
      setInitialLoading(false);
    }
    // eslint-disable-next-line
  }, [dispatch, success]);

  const cancelCreateProduct = () => {
    setOpenForm(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(productImage)
    if (
      name === '' ||
      category === '' ||
      productImage === '' ||
      description === '' ||
      brand === '' ||
      price === '' ||
      countInStock === ''
    ) {
      return;
    }


    const formData = new FormData();

    formData.append('name', name);
    formData.append('productImage', productImage);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    formData.append('description', description);
    dispatch(createProduct(formData));
  };

  const uploadFile = (e) => {
    console.log(e);
    const file = e.target.files[0];
    const maxSizeInBytes = 1024 * 256;

    if (file && file.size > maxSizeInBytes)
      return alert("File size exceeds the allowed limit (256 MB).");
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result)
      setProductImage(reader.result)
    };
    reader.onerror = (e) => console.log("Error : ", e);
  };

  

  const openNewProductForm = () => {
    if (openForm) {
      return (
        <>
          <Modal show={openForm} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">Add Product</Modal.Title>
            </Modal.Header>
            {createFail && (
              <ErrorMessage
                header="Something went wrong"
                message={createFail}
                reset={productConstants.CREATE_PRODUCT_RESET}
              />
            )}
            <Form onSubmit={submitHandler}>
              <Modal.Body className="show-grid">
                <Container>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        type="text"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        type="text"
                        margin="normal"
                        required
                        fullWidth
                        id="brand"
                        label="Brand"
                        name="brand"
                        autoComplete="brand"
                        autoFocus
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        id="price"
                        label="Price"
                        name="price"
                        autoComplete="price"
                        autoFocus
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        id="countInStock"
                        label="CountInStock"
                        name="countInStock"
                        autoComplete="countInStock"
                        autoFocus
                        value={countInStock}
                        onChange={(e) => setCountInStock(Number(e.target.value))}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        type="file"
                        margin="normal"
                        required
                        fullWidth
                        id="file"
                        name="file"
                        autoComplete="file"
                        autoFocus
                        onChange={uploadFile}
                        // onChange={(e) => setProductImage(e.target.files[0])}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <FormControl variant="outlined" sx={{margin: "16px", minWidth: 330, top: 6, left: -4,}}>
                        <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          onChange={(e) => setCategory(e.target.value)}
                          label="Category"
                          value={category}
                        >
                          <MenuItem value="Shirt">T-shirt</MenuItem>
                          <MenuItem value="Pants">Pant</MenuItem>
                          <MenuItem value="Vest">Vest</MenuItem>
                        </Select>
                      </FormControl>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <TextField
                        variant="outlined"
                        type="text"
                        margin="normal"
                        required
                        fullWidth
                        id="description"
                        label="Description"
                        name="description"
                        autoComplete="description"
                        autoFocus
                        value={description}
                        multiline
                        rows={5}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <MaterialButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="mr-2"
                  disabled={createLoading}
                >
                  {createLoading ? <CircularProgress color="inherit" sx={{color: '#fff'}}  /> : <>Submit</>}
                </MaterialButton>{' '}
                <MaterialButton variant="contained" color="primary" onClick={cancelCreateProduct}>
                  Close
                </MaterialButton>
              </Modal.Footer>
            </Form>
          </Modal>
        </>
      );
    }
  };

  const deleteHandler = (id, e) => {
    e.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1 className="font-weight-bold text-white">Are you sure?</h1>
            <p>You want to delete this product?</p>
            <MaterialButton
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(deleteProduct(id));
                onClose();
              }}
            >
              Yes, Delete it !
            </MaterialButton>
            <MaterialButton variant="contained" color="primary" onClick={onClose}>
              No
            </MaterialButton>
          </div>
        );
      },
    });
  };

  return (
    <>
      {deleteSuccess && (
        <SuccessMessage
          header="Done"
          message="Product Deleted Successfully"
          reset={productConstants.DELETE_PRODUCT_RESET}
        />
      )}
      {deleteFail && (
        <ErrorMessage
          header="Something went wrong"
          message={deleteFail}
          reset={productConstants.DELETE_PRODUCT_RESET}
        />
      )}
      <Row>
        <Col>
          <h1>Products({count})</h1>
        </Col>
        <Col className="text-right">
          <MaterialButton variant="contained" color="primary" onClick={() => setOpenForm(true)}>
            <i className="fas fa-plus mr-2"></i> Add Product
          </MaterialButton>
        </Col>
      </Row>
      {loading ? (
        <TableLoader />
      ) : error ? (
        <ErrorMessage header="Something went wrong" message={error} />
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer
                      to={interpolate(routes.PRODUCT_EDIT, {
                        productId: product._id,
                      })}
                    >
                      <Button variant="light" className="btn-sm">
                        EDIT
                      </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm" onClick={(e) => deleteHandler(product._id, e)}>
                      DELETE
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      {openNewProductForm()}
    </>
  );
};

export default ProductList;
