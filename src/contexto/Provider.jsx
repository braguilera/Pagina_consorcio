import React, { useReducer, useState } from 'react'
import Contexto from './Contexto'
import miReducer from './miReducer'
import types from './types'

const init=()=>{
    const user=localStorage.getItem("valor")
    return {
        logeado:!!user,
        usuario:user
    }
}

const Provider = ({children}) => {

    const [autentificacion, dispatch] = useReducer(miReducer,{},init)
    const [usuario, setUsuario] = useState();
    const [password, setPassword] = useState();
    const [usuarioDni,setUsuarioDni] = useState();
    const [rol,setRol] = useState();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mostrarError, setMostrarError] = useState(false);
    const [idBusqueda, setIdBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);


    const logearse=(user)=>{
        const action={
            type:types.login,
            payload: user
        }
        localStorage.setItem("valor",user)
        dispatch(action )
    }

    const deslogearse=(user)=>{
        const action={
            type:types.logout,
            payload: null
        }
        localStorage.removeItem("valor")
        dispatch(action )
    }
    

    return (
        <Contexto.Provider value={{
            ...autentificacion,
            logearse,
            deslogearse,
            usuario,
            setUsuario,
            password,
            setPassword,
            usuarioDni,
            setUsuarioDni,
            rol,
            setRol,
            error,
            setError,
            loading,
            setLoading,
            mostrarError,
            setMostrarError,
            idBusqueda,
            setIdBusqueda,
            paginaActual,
            setPaginaActual
            }}>
            {children}
        </Contexto.Provider>
    )
}

export default Provider
