import React from 'react';
import useAuth from '../Hook/useAuth';
import { useLocation } from 'react-router';
import { Navigate } from 'react-router';
const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth()
       // State Navigate the user thr previous route 
    const location = useLocation()
    //  console.log(location)
    if (loading) {
        return <div></div>
    }
    // console.log(user)
    if (user && user.email) {
        return children
    }
    else {
        return <Navigate state={location.pathname} to='/auth/login'>
        </Navigate>
    }
};

export default PrivateRoute;