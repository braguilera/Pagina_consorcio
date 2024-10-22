import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Inicio from '../componentes/Inicio'
import Nav from '../componentes/Nav'
import VerRaclamos from '../componentes/VerRaclamos'
import CrearReclamo from '../componentes/CrearReclamo'



const RutaSecundaria = () => {
    return (
        <>
        <Nav/>
        <Routes>
            <Route path='inicio' element={<Inicio/>}/>
            <Route path='verReclamos' element={<VerRaclamos/>}/>
            <Route path='crearReclamo' element={<CrearReclamo/>}/>
        </Routes>
        </>
    )
}

export default RutaSecundaria
