import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Contexto from '../contexto/Contexto';

const Nav = () => {
    const navegacion = useNavigate();
    const location = useLocation(); // Hook para obtener la ubicación actual
    const { deslogearse } = useContext(Contexto);
    const [activo, setActivo] = useState(false);
    const [cambiar, setCambiar] = useState(false);

    const logout = () => {
        deslogearse();
        navegacion('/login', { replace: true });
    };

    const cambiarClase = () => {
        setActivo(!activo);
    };

    useEffect(() => {
        if (location.pathname === '/inicio') {
            setActivo(false);
            setCambiar(false);
        }
    }, [location]);


    const handleNavLinkClick = () => {
        setCambiar(true);
    };

    return (
        <>
            <nav className='navegador'>
                <div className='navegador_contenedor'>
                    <NavLink to="inicio" className={
                        ({ isActive }) => (isActive ? "activado" : null)
                    }>Inicio</NavLink>

                    <div className={(activo) 
                        ? (cambiar) ? "reclamos_details_activo" : "reclamos_details"
                        : "reclamos_details_desactivado"
                    }
                    onClick={cambiarClase}>
                        <h2>Reclamos</h2>
                        <strong>{activo ? "-" : "+"}</strong>
                    </div>

                    <div className={(activo) 
                        ? (cambiar) ? "reclamos_summary_activo" : "reclamos_sumary"
                        : "reclamos_summary_desactivado"
                    }>
                        <NavLink
                            to="verReclamos" 
                            className={
                                ({ isActive }) => (isActive ? "activado_secundario" : "reclamo_secundario")
                            }
                            onClick={handleNavLinkClick} // Maneja el click
                        >
                            Ver reclamos
                        </NavLink>

                        <NavLink 
                            to="crearReclamo" 
                            className={
                                ({ isActive }) => (isActive ? "activado_secundario" : "reclamo_secundario")
                            }
                            onClick={handleNavLinkClick} // Maneja el click
                        >
                            Crear reclamo
                        </NavLink>
                    </div>
                </div>
                <div className='navegador_contenedor_botones'>
                    <button onClick={logout}>Cerrar sesión</button>
                </div>
            </nav>
        </>
    );
};

export default Nav;
