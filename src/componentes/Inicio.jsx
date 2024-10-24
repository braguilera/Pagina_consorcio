import React, { useContext } from 'react'
import Contexto from '../contexto/Contexto'
import personas from '../datos/personas'

const Inicio = () => {
    const {usuarioDni}=useContext(Contexto);
    const persona = personas.find(valor=> valor.dni==usuarioDni);

    console.log(persona)

    return (
    <div>
        <h1>¡Bienvenido, {persona.nombreCompleto}!</h1>
    </div>
    )
}

export default Inicio
