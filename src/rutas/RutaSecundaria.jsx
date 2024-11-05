import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Inicio from '../componentes/Inicio'
import Nav from '../componentes/Nav'
import VerRaclamos from '../componentes/VerRaclamos'
import CrearReclamo from '../componentes/CrearReclamo'
import Edificios from '../componentes/edificios/Edificios'
import Persona from '../componentes/personas/Persona'
import Unidad from '../componentes/unidades/Unidad'
import MisViviendas from '../componentes/duenio/MisViviendas'

const RutaSecundaria = () => {
    return (
        <>
        <div className='main'>
        <Nav/>
        <Routes>
            <Route path='inicio' element={<Inicio/>}/>
            <Route path='verReclamos' element={<VerRaclamos/>}/>
            <Route path='crearReclamo' element={<CrearReclamo/>}/>
            <Route path='misViviendas' element={<MisViviendas/>}/>
            <Route path='personas' element={<Persona/>}/>
            <Route path='unidades' element={<Unidad/>}/>
            <Route path='edificios' element={<Edificios/>}/>
            <Route path='/' element={<Navigate to="inicio"/>}/>
        </Routes>
        </div>
        </>
    )
}

export default RutaSecundaria
