import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "../Rating/Rating";
import * as routes from "../../constants/routes";
import { interpolate } from "../../utils/string";
import "animate.css";

const Product = ({ product }) => {
  return (
    <Link to={interpolate(routes.PRODUCT, { productId: product._id })}>
      <Card className="my-3 p-3 rounded  animate__animated animate__fadeInUp">
        <Card.Img src={product.productImage} variant="top" style={{aspectRatio: "1/1.5", objectFit: "cover", width: "full"}} />

        <Card.Body>
          <Link to={interpolate(routes.PRODUCT, { productId: product._id })}>
            <Card.Title as="div">
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text as="div">
            <Rating
              value={product.averageRating}
              text={`${product.Reviews ? product.Reviews.length : 0} reviews`}
            />
          </Card.Text>

          <Card.Text as="h3">${product.price}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default Product;
