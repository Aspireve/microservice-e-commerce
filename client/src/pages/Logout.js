import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as routes from '../constants/routes';
import * as userAction from '../actions/userAction';

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userAction.Logout());
  }, [dispatch]);
  console.log(routes.HOME)
  return <Navigate to={routes.HOME} />;
};

export default Logout;
