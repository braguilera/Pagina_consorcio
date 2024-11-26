import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Contexto from '../contexto/Contexto';
import imglogout from '../iconos/logout.svg';
import logo from '../iconos/logo_empresa.svg'

const Nav = () => {
    const navegacion = useNavigate();
    const location = useLocation();
    const { deslogearse, setUsuario, setPassword, nombreUsuario, rol } = useContext(Contexto);
    const [activo, setActivo] = useState(false);

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
        const isReclamosRoute = location.pathname === '/verReclamos' || location.pathname === '/crearReclamo';
        if (!isReclamosRoute) {
            setActivo(false);
        }
    }, [location.pathname]);
    

    return (
        <>
            <nav className='navegador'>

                <header>

                    <img
                        src={logo}
                    />
                    <h2>All-Blue</h2>

                    <h3>{nombreUsuario}</h3>
                    <small>{rol}</small>

                    <NavLink to="perfil" className={({ isActive }) => (isActive ? 'ver_perfil_nav_activado' : 'ver_perfil_nav')}>
                        Ver perfil
                    </NavLink>
                </header>



                <div className='navegador_contenedor'>
                    <NavLink to="inicio" className={({ isActive }) => (isActive ? 'activado' : null)}>
                        Inicio
                    </NavLink>
                    {rol !== 'Empleado' && (
                    <div
                        className={activo ? 'reclamos_details_activo' : 'reclamos_details_desactivado'}
                        onClick={cambiarClase}
                    >
                        <h2>Reclamos</h2>
                        <strong>{activo ? '-' : '+'}</strong>
                    </div>
                    )}

                    {rol !== 'Empleado' && (
                        <div
                            className={activo ? 'reclamos_summary_activo' : 'reclamos_summary_desactivado'}
                        >
                            <NavLink
                                to="verReclamos"
                                className={({ isActive }) => (isActive ? 'activado_secundario' : 'reclamo_secundario')}
                            >
                                Ver reclamos
                            </NavLink>
                        
                        
                            <NavLink
                                to="crearReclamo"
                                className={({ isActive }) => (isActive ? 'activado_secundario' : 'reclamo_secundario')}
                            >
                                Crear reclamo
                            </NavLink>
                        </div>
                    )}

                    {rol === 'Empleado' && (
                        <NavLink
                            to="manejarReclamo"
                            className={({ isActive }) => (isActive ? 'activado' : null)}
                        >
                            Reclamos
                        </NavLink>
                    )}

                    {/* Condicionales para asignar los navs */}
                    {rol === 'Duenio' && (
                        <NavLink to="misViviendas" className={({ isActive }) => (isActive ? 'activado' : null)}>
                            Mis Viviendas
                        </NavLink>
                    )}

                    {rol === 'Empleado' && (
                        <>
                            <NavLink to="personas" className={({ isActive }) => (isActive ? 'activado' : null)}>
                                Personas
                            </NavLink>
                            <NavLink to="cuentas" className={({ isActive }) => (isActive ? 'activado' : null)}>
                                Cuentas
                            </NavLink>
                            <NavLink to="unidades" className={({ isActive }) => (isActive ? 'activado' : null)}>
                                Unidades
                            </NavLink>
                            <NavLink to="edificios" className={({ isActive }) => (isActive ? 'activado' : null)}>
                                Edificios
                            </NavLink>
                        </>
                    )}
                </div>

                <div className='navegador_contenedor_botones'>
                    <button 
                        className='boton_cerrar_sesion'
                        onClick={logout}
                    >
                        <img src={imglogout} alt="Logout" />
                        Cerrar sesión
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Nav;
