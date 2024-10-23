import React, { useContext } from 'react'
import Contexto from '../contexto/Contexto'
import { Navigate } from 'react-router-dom';

const RutaPublica = ({children}) => {
    const {logeado}=useContext(Contexto);

    return (!logeado)
    ? children
    : <Navigate to="/inicio"/>
}

export default RutaPublica
