import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../componentes/Login'
import RutaSecundaria from './RutaSecundaria'

const RutaPrincipal = () => {
    return (
        <>
        <Routes>
            <Route path='login' element={<Login/>}/>
            <Route path='/*' element={<RutaSecundaria/>}/>
        </Routes>
        </>
    )
}

export default RutaPrincipal
