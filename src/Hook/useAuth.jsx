import React, { use } from 'react';
import { AuthContext } from '../Auth/AuthContext';

const useAuth = () => {
    const authInfo = use(AuthContext);
    return authInfo;
};

export default useAuth;