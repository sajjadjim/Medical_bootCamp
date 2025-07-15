import React  from 'react';
import useAuth from '../Hook/useAuth';
import { useLocation } from 'react-router';
import { Navigate } from 'react-router';
const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth()
       // State Navigate the user thr previous route 
    const location = useLocation()
    //  console.log(location)
   if(loading){
        // Show a loading spinner for 0.5 seconds on page load
        const [showSpinner, setShowSpinner] = React.useState(true);

        React.useEffect(() => {
            const timer = setTimeout(() => setShowSpinner(false), 1000);
            return () => clearTimeout(timer);
        }, []);

        if (showSpinner) {
            return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid #ccc',
                borderTop: '4px solid #333',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
                }} />
                <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
                </style>
            </div>
            );
        }
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