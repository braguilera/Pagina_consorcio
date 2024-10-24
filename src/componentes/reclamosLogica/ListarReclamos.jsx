import React from 'react';
import ReclamoItem from './ItemReclamo';

const ListaReclamos = ({ reclamos, obtenerNombre }) => {
    return (
        // Iteramos los reclamos, y por cada item se hará un componente de este
    <div >
        <table>
            <tbody className='tabla_body'>
                
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
