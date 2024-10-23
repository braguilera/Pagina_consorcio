import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../componentes/Login'
import RutaSecundaria from './RutaSecundaria'
import RutaPublica from './RutaPublica'
import RutaPrivada from './RutaPrivada'

const RutaPrincipal = () => {
    return (
        <>
        <Routes>
            <Route path='login' element={
                <RutaPublica>
                    <Login/>
                </RutaPublica>
            }/>


            <Route path='/*' element={
                <RutaPrivada>
                    <RutaSecundaria/>
                </RutaPrivada>
            }/>
        </Routes>
        </>
    )
}

export default RutaPrincipal
