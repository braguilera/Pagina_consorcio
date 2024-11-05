import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Contexto from '../contexto/Contexto';
import personas from '../datos/personas';

const Nav = () => {
    const navegacion = useNavigate();
    const location = useLocation();
    const { deslogearse, setUsuario, setPassword, usuarioDni } = useContext(Contexto);
    const [activo, setActivo] = useState(false);
    const [cambiar, setCambiar] = useState(false);
    const [rol, setRol] = useState('');

    useEffect(() => {
        // Find the role of the user based on the DNI stored in the context
        const persona = personas.find(persona => persona.dni === usuarioDni);
        if (persona) {
            setRol(persona.rol);
        }
    }, [usuarioDni]);

    const logout = () => {
        deslogearse();
        navegacion('/login', { replace: true });
        setUsuario('');
        setPassword('');
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
                    <NavLink to="inicio" className={({ isActive }) => (isActive ? 'activado' : null)}>
                        Inicio
                    </NavLink>

                    <div
                        className={activo ? (cambiar ? 'reclamos_details_activo' : 'reclamos_details') : 'reclamos_details_desactivado'}
                        onClick={cambiarClase}
                    >
                        <h2>Reclamos</h2>
                        <strong>{activo ? '-' : '+'}</strong>
                    </div>

                    <div
                        className={activo ? (cambiar ? 'reclamos_summary_activo' : 'reclamos_sumary') : 'reclamos_summary_desactivado'}
                    >
                        <NavLink
                            to="verReclamos"
                            className={({ isActive }) => (isActive ? 'activado_secundario' : 'reclamo_secundario')}
                            onClick={handleNavLinkClick}
                        >
                            Ver reclamos
                        </NavLink>

                        <NavLink
                            to="crearReclamo"
                            className={({ isActive }) => (isActive ? 'activado_secundario' : 'reclamo_secundario')}
                            onClick={handleNavLinkClick}
                        >
                            Crear reclamo
                        </NavLink>
                    </div>

                    {/* Condicionales para asignar los navs */}
                    {rol === 'dueño' ? (
                        <NavLink to="misViviendas" className={({ isActive }) => (isActive ? 'activado' : null)}>
                            Mis Viviendas
                        </NavLink>
                    ) : null}

                    {rol === 'empleado' ? (
                        <NavLink to="unidades" className={({ isActive }) => (isActive ? 'activado' : null)}>
                            Unidades
                        </NavLink>
                    ) : null}
                    {rol === 'empleado' ? (
                        <NavLink to="personas" className={({ isActive }) => (isActive ? 'activado' : null)}>
                            Personas
                        </NavLink>
                    ) : null}
                    {rol === 'empleado' ? (
                        <NavLink to="edificios" className={({ isActive }) => (isActive ? 'activado' : null)}>
                            Edificios
                        </NavLink>
                    ) : null}
                </div>

                <div className='navegador_contenedor_botones'>
                    <button onClick={logout}>Cerrar sesión</button>
                </div>
            </nav>
        </>
    );
};

export default Nav;
