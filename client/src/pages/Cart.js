import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { addToCart, removeItemFromCart } from '../actions/cartAction';
import { Select, Button, FormControl, MenuItem } from '@mui/material';
import { interpolate } from '../utils/string';
import * as routes from '../constants/routes';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate()
  const { cartItems } = cart;
  const dispatch = useDispatch();

  const removeFromCartHandler = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleCheckout = () => {
    navigate(routes.PAYMENT);
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {!cartItems.length ? (
          <>
            Your cart is empty <Link to={routes.HOME}>Go Back</Link>
          </>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.productId}>
                <Row>
                  <Col md={2}>
                    <Image src={item.productImage} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link
                      to={interpolate(routes.PRODUCT, {
                        productId: item.productId,
                      })}
                    >
                      {item.productName}
                    </Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <FormControl sx={{margin: "16px", minWidth: 120,}}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Qty"
                        value={item.qty}
                        onChange={(e) => dispatch(addToCart(item.productId, Number(e.target.value)))}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <MenuItem key={x + 1} value={x + 1}>
                            {x + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Col>
                  <Col md={2}>
                    <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.productId)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>$
              {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                fullWidth
                disabled={!cartItems.length}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default Cart;
