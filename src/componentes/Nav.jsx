import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Contexto from '../contexto/Contexto';

const Nav = () => {
    const navegacion=useNavigate();
    const {deslogearse}=useContext(Contexto);
    const [activo, setActivo] = useState(false);
    
    const logout=()=>{
        deslogearse();
        navegacion('/login',{replace:true})
    }

    const cambiarClase=()=>{
        setActivo(!activo)
    }

    return (
        <>
            <nav className='navegador'>
                <NavLink to="inicio">Inicio</NavLink>

                <div className={activo 
                ? "reclamos_details_activo"
                : "reclamos_details_desactivado"
                }
                onClick={cambiarClase}>
                    <h2>Reclamos</h2>
                    <strong>{activo 
                ? "-"
                : "+"
                }</strong>
                </div>

                <div className={activo 
                ? "reclamos_summary_desactivado"
                : "reclamos_summary_activo"
                }>
                        <NavLink to="verReclamos">Ver reclamos</NavLink>
                        <NavLink to="crearReclamo">Crear reclamo</NavLink>
                </div>

                <button onClick={logout}>Cerrar sesión</button>

            </nav>
        </>
    )
}

export default Nav
