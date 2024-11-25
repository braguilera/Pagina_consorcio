import React from 'react';
import izquierda from '../../iconos/left.svg';
import derecha from '../../iconos/right.svg';

const Paginacion = ({ totalPaginas, paginaActual, setPaginaActual }) => {
    const maxBotonesVisibles = 5; // Número máximo de botones visibles

    const irAPagina = (numeroPagina) => {
        if (numeroPagina > 0 && numeroPagina <= totalPaginas) {
            setPaginaActual(numeroPagina);
        }
    };

    const obtenerRangoBotones = () => {
        let inicio = Math.max(1, paginaActual - Math.floor(maxBotonesVisibles / 2));
        let fin = Math.min(totalPaginas, inicio + maxBotonesVisibles - 1);

        if (fin - inicio + 1 < maxBotonesVisibles) {
            inicio = Math.max(1, fin - maxBotonesVisibles + 1);
        }

        const rango = [];
        for (let i = inicio; i <= fin; i++) {
            rango.push(i);
        }
        return rango;
    };

    const botones = obtenerRangoBotones();

    // Si solo hay una página, no mostrar botones de paginación
    if (totalPaginas === 1) {
        return <div className="paginacion" style={{ visibility: 'hidden' }}></div>;
    }

    return (
        <div className="paginacion">
            {/* Botón Anterior */}
            <button
                onClick={() => irAPagina(paginaActual - 1)}
                style={{
                    visibility: paginaActual > 1 ? 'visible' : 'hidden',
                    backgroundColor: 'transparent',
                    transition: 'visibility .3s ease',
                }}
            >
                <img src={izquierda} alt="Página Anterior" />
            </button>

            {paginaActual > Math.floor(maxBotonesVisibles / 2) + 1 && (
                <>
                    <button onClick={() => irAPagina(1)}>1</button>
                    <span>...</span>
                </>
            )}

            {botones.map((numeroPagina) => (
                <button
                    key={numeroPagina}
                    onClick={() => irAPagina(numeroPagina)}
                    style={{
                        backgroundColor: paginaActual === numeroPagina ? '#4b83c1' : undefined,
                        color: paginaActual === numeroPagina ? '#f4f5f5' : undefined,
                    }}
                >
                    {numeroPagina}
                </button>
            ))}

            {paginaActual < totalPaginas - Math.floor(maxBotonesVisibles / 2) && (
                <>
                    <span>...</span>
                    <button onClick={() => irAPagina(totalPaginas)}>{totalPaginas}</button>
                </>
            )}

            {/* Botón Siguiente */}
            <button
                onClick={() => irAPagina(paginaActual + 1)}
                style={{
                    visibility: paginaActual < totalPaginas ? 'visible' : 'hidden',
                    backgroundColor: 'transparent',
                    transition: 'visibility .3s ease',
                }}
            >
                <img src={derecha} alt="Página Siguiente" />
            </button>
        </div>
    );
};

export default Paginacion;
