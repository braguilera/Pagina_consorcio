import React, { useContext } from 'react'
import Contexto from '../contexto/Contexto'
import personas from '../datos/personas'
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
    const {usuarioDni,deslogearse}=useContext(Contexto);
    const navegacion=useNavigate();
    const persona = personas.find(valor=> valor.dni==usuarioDni);



    const logout = () => {
        deslogearse();
        navegacion('/login', { replace: true });
    };


    if (!persona){
        logout();
    }

    return (
    <div>
        <h1>¡Bienvenido, {persona.nombreCompleto}!</h1>
        <p>Consulta el estado de tus reclamos o realiza uno nuevo. Adjunta imágenes para una mejor resolución.</p>
    </div>
    )
}

export default Inicio
