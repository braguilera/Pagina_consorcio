import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Inicio from '../componentes/Inicio';
import Nav from '../componentes/Nav';
import VerRaclamos from '../componentes/VerRaclamos';
import CrearReclamo from '../componentes/CrearReclamo';
import Edificios from '../componentes/edificios/Edificios';
import Persona from '../componentes/personas/Persona';
import Unidad from '../componentes/unidades/Unidad';
import MisViviendas from '../componentes/duenio/MisViviendas';
import ManejarReclamos from '../componentes/ManejarReclamos';
import RutaProtegidaPorRol from './RutaProtegidaPorRol';
import Cuenta from '../componentes/cuentas/Cuenta';

const RutaSecundaria = () => {
    return (
        <>
            <div className="main">
                <Nav />
                <Routes>
                    {/* Público */}
                    <Route path="inicio" element={<Inicio />} />

                    {/* Todos menos empleado */}
                    <Route
                        path="verReclamos"
                        element={
                            <RutaProtegidaPorRol rolesPermitidos={['Duenio', 'Inquilino', '']}>
                                <VerRaclamos />
                            </RutaProtegidaPorRol>
                        }
                    />
                    <Route
                        path="crearReclamo"
                        element={
                            <RutaProtegidaPorRol rolesPermitidos={['Duenio', 'Inquilino', '']}>
                                <CrearReclamo />
                            </RutaProtegidaPorRol>
                        }
                    />

                    {/* Solo empleado */}
                    <Route
                        path="manejarReclamo"
                        element={
                            <RutaProtegidaPorRol rolesPermitidos={['Empleado']}>
                                <ManejarReclamos />
                            </RutaProtegidaPorRol>
                        }
                    />

                    {/* Solo dueño */}
                    <Route
                        path="misViviendas"
                        element={
                            <RutaProtegidaPorRol rolesPermitidos={['Duenio']}>
                                <MisViviendas />
                            </RutaProtegidaPorRol>
                        }
                    />

                    {/* Solo empleado */}
                    <Route
                        path="personas"
                        element={
                            <RutaProtegidaPorRol rolesPermitidos={['Empleado']}>
                                <Persona />
                            </RutaProtegidaPorRol>
                        }
                    />

                    <Route
                        path="cuentas"
                        element={
                            <RutaProtegidaPorRol rolesPermitidos={['Empleado']}>
                                <Cuenta />
                            </RutaProtegidaPorRol>
                        }
                    />

                    <Route
                        path="unidades"
                        element={
                            <RutaProtegidaPorRol rolesPermitidos={['Empleado']}>
                                <Unidad />
                            </RutaProtegidaPorRol>
                        }
                    />
                    <Route
                        path="edificios"
                        element={
                            <RutaProtegidaPorRol rolesPermitidos={['Empleado']}>
                                <Edificios />
                            </RutaProtegidaPorRol>
                        }
                    />

                    {/* Redirección por defecto */}
                    <Route path="/" element={<Navigate to="inicio" />} />
                </Routes>
            </div>
        </>
    );
};

export default RutaSecundaria;
