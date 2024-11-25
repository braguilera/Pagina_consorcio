import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Contexto from '../contexto/Contexto';

const RutaProtegidaPorRol = ({ children, rolesPermitidos }) => {
    const { rol } = useContext(Contexto);

    if (!rolesPermitidos.includes(rol)) {
        return <Navigate to="/inicio" replace />;
    }

    return children;
};

export default RutaProtegidaPorRol;
