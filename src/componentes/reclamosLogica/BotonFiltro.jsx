import React from 'react';

const BotonFiltro = ({ texto, activo, onClick }) => {
    return (
        <button onClick={onClick} className={activo ? 'activo' : ''}>
        {texto}
        </button>
    );
};

export default BotonFiltro;
