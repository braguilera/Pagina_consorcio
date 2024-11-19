import React, { useReducer, useState, useEffect } from 'react';
import Contexto from './Contexto';
import miReducer from './miReducer';
import types from './types';

// Función de inicialización para recuperar datos de localStorage
const init = () => {
    const user = localStorage.getItem("valor");
    const usuarioDni = localStorage.getItem("usuarioDni");
    const rol = localStorage.getItem("rol");
    return {
        logeado: !!user,
        usuario: user,
        usuarioDni: usuarioDni || null,
        rol: rol || null,
    };
};

const Provider = ({ children }) => {
    const [autentificacion, dispatch] = useReducer(miReducer, {}, init);
    const [usuario, setUsuario] = useState(autentificacion.usuario || '');
    const [password, setPassword] = useState('');
    const [usuarioDni, setUsuarioDni] = useState(autentificacion.usuarioDni);
    const [rol, setRol] = useState(autentificacion.rol);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mostrarError, setMostrarError] = useState(false);
    const [idBusqueda, setIdBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);

    // Sincronizar usuarioDni y rol con localStorage cuando cambien
    useEffect(() => {
        if (usuarioDni) {
            localStorage.setItem("usuarioDni", usuarioDni);
        } else {
            localStorage.removeItem("usuarioDni");
        }

        if (rol) {
            localStorage.setItem("rol", rol);
        } else {
            localStorage.removeItem("rol");
        }
    }, [usuarioDni, rol]);

    // Función para logearse
    const logearse = (user) => {
        const action = {
            type: types.login,
            payload: user,
        };
        localStorage.setItem("valor", user);
        dispatch(action);
    };

    // Función para deslogearse
    const deslogearse = () => {
        const action = {
            type: types.logout,
            payload: null,
        };
        localStorage.removeItem("valor");
        localStorage.removeItem("usuarioDni");
        localStorage.removeItem("rol");
        setUsuarioDni(null);
        setRol(null);
        dispatch(action);
    };

    return (
        <Contexto.Provider
            value={{
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
                setPaginaActual,
            }}
        >
            {children}
        </Contexto.Provider>
    );
};

export default Provider;
