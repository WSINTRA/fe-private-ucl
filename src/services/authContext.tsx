import { createContext } from 'react';

export const AuthContext = createContext(
    { token: '' }
);

export const AuthProvider = ({ children, token }: any) => {
    return (
        <AuthContext.Provider value={{ token: token }}>
            {children}
        </AuthContext.Provider>
    );
};
