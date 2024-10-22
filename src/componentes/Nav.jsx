import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Nav = () => {

    const navegacion=useNavigate();
    
    const logout=()=>{
        navegacion('/login',{replace:true})
    }

    return (
        <>
            <nav className='navegador'>
                <NavLink to="inicio">Inicio</NavLink>

                <div className='reclamos_details'>
                    <h2>Reclamos</h2>
                    <p>+</p>
                </div>

                <div className='reclamos_summary'>
                        <NavLink to="verReclamos">Ver reclamos</NavLink>
                        <NavLink to="crearReclamo">Crear reclamo</NavLink>
                </div>

                <button onClick={logout}>Cerrar sesión</button>

            </nav>
        </>
    )
}

export default Nav
