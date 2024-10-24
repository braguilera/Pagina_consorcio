import React, { useState, useContext, useMemo } from 'react';
import ReclamosList from '../componentes/reclamosLogica/ListarReclamos';
import BotonFiltro from '../componentes/reclamosLogica/BotonFiltro';
import reclamosData from '../datos/reclamos';
import personasData from '../datos/personas';
import Contexto from '../contexto/Contexto';

const VerReclamos = () => {
    const { usuarioDni } = useContext(Contexto);
    const [filtro, setFiltro] = useState('todos');
    const [criterioBusqueda, setCriterioBusqueda] = useState('');
    const [orden, setOrden] = useState({ columna: '', direccion: '' });

    // Obtener el nombre del usuario basado en el dni
    const obtenerNombre = (dni) => {
        const persona = personasData.find(p => p.dni === dni);
        return persona ? persona.nombreCompleto : 'Desconocido';
    };

    // Filtrar reclamos según el botón seleccionado
    const reclamosFiltrados = useMemo(() => {
        return reclamosData.filter(reclamo => {
            if (filtro === 'mis-reclamos') {
                return reclamo.dni === usuarioDni;
            }
            if (filtro === 'comunidad') {
                return reclamo.tipoReclamo === 'Área Común';
            }
            return true;
        });
    }, [filtro, usuarioDni]);

    // Función de búsqueda excluyendo edificios
    const reclamosBuscados = useMemo(() => {
        return reclamosFiltrados.filter(reclamo => {
            const nombre = obtenerNombre(reclamo.dni).toLowerCase();
            return (
                reclamo.numeroReclamo.toString().includes(criterioBusqueda.toLowerCase()) ||
                nombre.includes(criterioBusqueda.toLowerCase()) ||
                reclamo.unidad.piso.toString().includes(criterioBusqueda.toLowerCase()) ||
                reclamo.unidad.numero.toString().includes(criterioBusqueda.toLowerCase()) ||
                reclamo.tipoReclamo.toLowerCase().includes(criterioBusqueda.toLowerCase()) ||
                reclamo.estado.toLowerCase().includes(criterioBusqueda.toLowerCase())
            );
        });
    }, [criterioBusqueda, reclamosFiltrados]);

    // Función de ordenamiento
    const reclamosOrdenados = useMemo(() => {
        if (!orden.columna) return reclamosBuscados;

        const sortedReclamos = [...reclamosBuscados].sort((a, b) => {
            let valA, valB;

            switch (orden.columna) {
                case 'Número':
                    valA = a.numeroReclamo;
                    valB = b.numeroReclamo;
                    break;
                case 'Nombre':
                    valA = obtenerNombre(a.dni);
                    valB = obtenerNombre(b.dni);
                    break;
                case 'Piso':
                    valA = a.unidad.piso;
                    valB = b.unidad.piso;
                    break;
                case 'Unidad':
                    valA = a.unidad.numero;
                    valB = b.unidad.numero;
                    break;
                case 'Tipo de Reclamo':
                    valA = a.tipoReclamo;
                    valB = b.tipoReclamo;
                    break;
                case 'Estado':
                    valA = a.estado;
                    valB = b.estado;
                    break;
                default:
                    return 0;
            }

            if (orden.direccion === 'asc') return valA > valB ? 1 : -1;
            if (orden.direccion === 'desc') return valA < valB ? 1 : -1;
            return 0;
        });

        return sortedReclamos;
    }, [orden, reclamosBuscados]);

    // Función para manejar el click en los encabezados y alternar el orden
    const manejarOrden = (columna) => {
        let direccion = 'asc';

        if (orden.columna === columna) {
            direccion = orden.direccion === 'asc' ? 'desc' : orden.direccion === 'desc' ? '' : 'asc';
        }

        setOrden({ columna, direccion });
    };

    // Función para renderizar la flecha según la dirección de ordenamiento
    const renderFlecha = (columna) => {
        if (orden.columna !== columna) return null;
        if (orden.direccion === 'asc') return '↑';
        if (orden.direccion === 'desc') return '↓';
        return null;
    };

    return (
        <div className='ver_reclamos'>
            <h2>Reclamos Actuales</h2>

            {/* Campo de búsqueda */}
            <input
                type="text"
                placeholder="Buscar reclamos..."
                value={criterioBusqueda}
                onChange={(e) => setCriterioBusqueda(e.target.value)}
            />

            {/* Botones de filtro */}
            <div className="filtros">
                <BotonFiltro texto="Todos" activo={filtro === 'todos'} onClick={() => setFiltro('todos')} />
                <BotonFiltro texto="Mis Reclamos" activo={filtro === 'mis-reclamos'} onClick={() => setFiltro('mis-reclamos')} />
                <BotonFiltro texto="Reclamos de la Comunidad" activo={filtro === 'comunidad'} onClick={() => setFiltro('comunidad')} />
            </div>

            {/* Encabezados de tabla con la opción de ordenar */}
            <table className='tabla_container'>
                <thead className='tabla_encabezado'>
                    <tr>
                        <th onClick={() => manejarOrden('Número')}>Número {renderFlecha('Número')}</th>
                        <th onClick={() => manejarOrden('Nombre')}>Nombre {renderFlecha('Nombre')}</th>
                        <th onClick={() => manejarOrden('Piso')}>Piso {renderFlecha('Piso')}</th>
                        <th onClick={() => manejarOrden('Unidad')}>Unidad {renderFlecha('Unidad')}</th>
                        <th onClick={() => manejarOrden('Tipo de Reclamo')}>Tipo {renderFlecha('Tipo de Reclamo')}</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                        <th onClick={() => manejarOrden('Estado')}>Estado {renderFlecha('Estado')}</th>
                    </tr>
                </thead>
                <ReclamosList reclamos={reclamosOrdenados} obtenerNombre={obtenerNombre} />
            </table>
        </div>
    );
};

export default VerReclamos;
