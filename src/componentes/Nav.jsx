import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Contexto from '../contexto/Contexto';
import imglogout from '../iconos/logout.svg';

const Nav = () => {
    const navegacion = useNavigate();
    const location = useLocation();
    const { deslogearse, setUsuario, setPassword, usuarioDni, rol } = useContext(Contexto);
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

    // Actualizar `activo` para mantenerlo solo en las rutas de Reclamos
    useEffect(() => {
        const isReclamosRoute = location.pathname === '/verReclamos' || location.pathname === '/crearReclamo';
        if (!isReclamosRoute) {
            setActivo(false);
        }
    }, [location.pathname]);

    return (
        <>
            <nav className='navegador'>
                <div className='navegador_contenedor'>
                    <NavLink to="inicio" className={({ isActive }) => (isActive ? 'activado' : null)}>
                        Inicio
                    </NavLink>

                    <div
                        className={activo ? 'reclamos_details_activo' : 'reclamos_details_desactivado'}
                        onClick={cambiarClase}
                    >
                        <h2>Reclamos</h2>
                        <strong>{activo ? '-' : '+'}</strong>
                    </div>

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

                    {/* Condicionales para asignar los navs */}
                    {rol === 'Duenio' && (
                        <NavLink to="misViviendas" className={({ isActive }) => (isActive ? 'activado' : null)}>
                            Mis Viviendas
                        </NavLink>
                    )}

                    {rol === 'Empleado' && (
                        <>
                            <NavLink to="unidades" className={({ isActive }) => (isActive ? 'activado' : null)}>
                                Unidades
                            </NavLink>
                            <NavLink to="personas" className={({ isActive }) => (isActive ? 'activado' : null)}>
                                Personas
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
