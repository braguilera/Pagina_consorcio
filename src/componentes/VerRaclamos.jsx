import React, { useState, useContext } from 'react';
import ReclamosList from '../componentes/reclamosLogica/ListarReclamos';
import BotonFiltro from '../componentes/reclamosLogica/BotonFiltro';
import reclamosData from '../datos/reclamos';
import personasData from '../datos/personas';
import Contexto from '../contexto/Contexto';

const VerReclamos = () => {
    const { usuarioDni } = useContext(Contexto);
    const [filtro, setFiltro] = useState('todos');

    // Obtener el nombre del usuario basado en el dni
    const obtenerNombre = (dni) => {
        const persona = personasData.find(p => p.dni === dni);
        return persona ? persona.nombreCompleto : 'Desconocido';
    };

    // Filtrar reclamos según el botón seleccionado
    const reclamosFiltrados = reclamosData.filter(reclamo => {
        if (filtro === 'mis-reclamos') {
            return reclamo.dni === usuarioDni;
        }
        if (filtro === 'comunidad') {
            return reclamo.tipoReclamo === 'Área Común';
        }
        return true;
    });

    return (
        <div>
            <h2>Reclamos Actuales</h2>
            <div className="filtros">
                <BotonFiltro texto="Todos" activo={filtro === 'todos'} onClick={() => setFiltro('todos')} />
                <BotonFiltro texto="Mis Reclamos" activo={filtro === 'mis-reclamos'} onClick={() => setFiltro('mis-reclamos')} />
                <BotonFiltro texto="Reclamos de la Comunidad" activo={filtro === 'comunidad'} onClick={() => setFiltro('comunidad')} />
            </div>
            <ReclamosList reclamos={reclamosFiltrados} obtenerNombre={obtenerNombre} />
        </div>
    );
};

export default VerReclamos;
