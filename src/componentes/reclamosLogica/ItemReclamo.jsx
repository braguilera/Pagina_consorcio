import React from 'react';

const ItemReclamo = ({ reclamo, nombre }) => {
    return (
    <tr>
        <td>{reclamo.numeroReclamo}</td>
        <td>{nombre}</td>
        <td>{reclamo.unidad.piso}</td>
        <td>{reclamo.unidad.numero}</td>
        <td>{reclamo.unidad.edificio}</td>
        <td>{reclamo.tipoReclamo}</td>
        <td>{reclamo.descripcion}</td>
        <td>{reclamo.fecha}</td>
        <td>{reclamo.estado}</td>
    </tr>
    );
};

export default ItemReclamo;
