// Paginacion.js
import React from 'react';
import izquierda from '../../iconos/left.svg';
import derecha from '../../iconos/right.svg';

const Paginacion = ({ totalPaginas, paginaActual, setPaginaActual }) => {
    const irAPagina = (numeroPagina) => {
        if (numeroPagina > 0 && numeroPagina <= totalPaginas) {
            setPaginaActual(numeroPagina);
        }
    };

    return (
        <div className='paginacion'>
            <button 
                onClick={() => irAPagina(paginaActual - 1)}
                style={{
                    opacity: paginaActual > 1 ? 1 : 0,
                    pointerEvents: paginaActual > 1 ? 'auto' : 'none',
                    backgroundColor: 'transparent',
                    transition: 'opacity .3s ease'
                }}
            >
                <img src={izquierda} alt="Previous Page"/>
            </button>

            {Array.from({ length: totalPaginas }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => irAPagina(index + 1)}
                    style={{
                        backgroundColor: paginaActual === index + 1 ? '#4b83c1' : undefined,
                        color: paginaActual === index + 1 ? '#f4f5f5' : undefined
                    }}
                >
                    {index + 1}
                </button>
            ))}

            <button 
                onClick={() => irAPagina(paginaActual + 1)}
                style={{
                    opacity: paginaActual < totalPaginas ? 1 : 0,
                    pointerEvents: paginaActual < totalPaginas ? 'auto' : 'none',
                    backgroundColor: 'transparent',
                    transition: 'opacity .3s ease'
                }}
            >
                <img src={derecha} alt="Next Page"/>
            </button>
        </div>
    );
};

export default Paginacion;
