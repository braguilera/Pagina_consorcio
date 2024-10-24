import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Inicio from '../componentes/Inicio'
import Nav from '../componentes/Nav'
import VerRaclamos from '../componentes/VerRaclamos'
import CrearReclamo from '../componentes/CrearReclamo'
import Edificios from '../componentes/edificios/Edificios'
import Persona from '../componentes/personas/Persona'

const RutaSecundaria = () => {
    return (
        <>
        <div className='main'>
        <Nav/>
        <Routes>
            <Route path='inicio' element={<Inicio/>}/>
            <Route path='verReclamos' element={<VerRaclamos/>}/>
            <Route path='crearReclamo' element={<CrearReclamo/>}/>
            <Route path='personas' element={<Persona/>}/>
            <Route path='edificios' element={<Edificios/>}/>
            <Route path='/' element={<Navigate to="inicio"/>}/>
        </Routes>
        </div>
        </>
    )
}

export default RutaSecundaria
