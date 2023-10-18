import React, { createContext } from 'react';

// const AuthContext = createContext();
// Context Creation & Default Value: Typically, when creating a context, it's a good practice to provide a default value, especially when you're going to be reading properties from that value:
const AuthContext = React.createContext({ currentUser: null });

export default AuthContext;
