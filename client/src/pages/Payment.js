import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer/FormContainer";
import CheckoutSteps from "../components/CheckoutStep/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartAction";
import * as routes from "../constants/routes";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (paymentMethod === "") {
      return;
    }
    dispatch(savePaymentMethod(paymentMethod));
    navigate(routes.PLACE_ORDER);
  };

  useEffect(() => {
    if (!localStorage.getItem("shippingAddress")) {
      navigate(routes.SHIPPING);
    }
  });
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select Method</FormLabel>
          <Row>
            <Col md="8">
              <RadioGroup
                aria-label="paymemtMethod"
                name="paymemtMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="PayPal"
                  control={<Radio color="primary" />}
                  label="PayPal or Credit Card"
                />
              </RadioGroup>
            </Col>
            <Col md="4">
              <RadioGroup
                aria-label="paymemtMethod"
                name="paymemtMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="esewa"
                  control={<Radio color="primary" />}
                  label="Esewa"
                />
              </RadioGroup>
            </Col>
          </Row>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentMethod;
