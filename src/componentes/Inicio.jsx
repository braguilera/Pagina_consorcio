import React, { useContext } from 'react'
import Contexto from '../contexto/Contexto'

const Inicio = () => {
    const {usuario}=useContext(Contexto);

    return (
    <div>
            <h1>¡Bienvenido, {usuario}!</h1>
    </div>
    )
}

export default Inicio
