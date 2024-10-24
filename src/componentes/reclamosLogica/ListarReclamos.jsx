import React from 'react';
import ReclamoItem from './ItemReclamo';

const ListaReclamos = ({ reclamos, obtenerNombre }) => {
    return (
        // Iteramos los reclamos, y por cada item se hará un componente de este
    <div>
        <table>
            <thead>
                <tr>
                    <th>Número</th>
                    <th>Nombre</th>
                    <th>Piso</th>
                    <th>Unidad</th>
                    <th>Edificio</th>
                    <th>Tipo de Reclamo</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                
                {reclamos.map((reclamo) => (
                    <ReclamoItem 
                        key={reclamo.numeroReclamo} 
                        reclamo={reclamo} 
                        nombre={obtenerNombre(reclamo.dni)} 
                    />
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default ListaReclamos;
