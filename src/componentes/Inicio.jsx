import React, { useContext } from 'react'
import Contexto from '../contexto/Contexto'
import personas from '../datos/personas'

const Inicio = () => {
    const {usuario,dni}=useContext(Contexto);
    const persona = personas.find(valor=> valor.dni==dni);

    console.log(persona)

    return (
    <div>
            <h1>¡Bienvenido, {persona.nombreCompleto}!</h1>
    </div>
    )
}

export default Inicio
