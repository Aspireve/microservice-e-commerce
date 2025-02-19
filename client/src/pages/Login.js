import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../components/Message/errorMessage';
import FormContainer from '../components/FormContainer/FormContainer';
import { TextField, Button, CircularProgress } from '@mui/material';
import * as routes from '../constants/routes';
import * as userAction from '../actions/userAction';
import * as userConstants from '../constants/userConstants';
const Login = ({ location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userAuthData = useSelector((state) => state.userLogin);
  const navigate = useNavigate()
  const { userInfo, error, loading } = userAuthData;

  const redirect = location?.search ? location.search.split('=')[1] : routes.HOME;

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      navigate(-1)
    }
  }, [dispatch, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userAction.auth(email, password));
  };

  const redirectUserToRegisterRoute = redirect ? routes.REGISTER + `?redirect=${redirect}` : routes.REGISTER;

  return (
    <>
      {error && <ErrorMessage header="Auth Error" message={error} reset={userConstants.RESET} />}
      <FormContainer>
        <h1>Sign In</h1>

        <Form onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            type="email"
            margin="normal"
            placeholder="ex:- JohnDoe@gmail.com"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            type="password"
            placeholder="***********"
            required
            fullWidth
            name="password"
            label="Password"
            id="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress color="inherit" sx={{color: '#fff'}} /> : <>Sign In</>}
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New Customer?
            <Link to={redirectUserToRegisterRoute}>Register</Link>
          </Col>
          <Col className="text-right">
            <Link to={routes.FORGOT_PASSWORD}>Forgot Password</Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default Login;
