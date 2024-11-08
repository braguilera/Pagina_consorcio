import { motion } from "framer-motion";

const AnimacionCarga = ({ columnas = [], filas, mostrarSelect = false }) => {
    const filasDeCarga = Array(filas).fill(0); // Número de filas en estado de carga

    return (
        <motion.div
            className="tabla_cargando"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
        <header className="tabla_cargando_header">
            {(filas !== 4) && (
                <input className='buscador_tabla' type='number' placeholder='Buscar por ID' />
            )}
            {mostrarSelect && (
                <select className='personas_select'>
                    <option disabled selected>Seleccione una opción</option>
                </select>
            )}
        </header>

            <div className="tabla_cargando_encabezado">
                {columnas.map((columna, index) => (
                    <div key={index}>{columna}</div>
                ))}
            </div>
            {filasDeCarga.map((_, rowIndex) => (
                <motion.div
                    key={rowIndex}
                    className="tabla_cargando_fila"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: rowIndex * 0.1 }}
                >
                    {columnas.map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="tabla_cargando_celda"
                            style={{ width: `${80 + (colIndex % 2) * 10}%` }} // Ajuste de ancho para variar entre columnas
                        ></div>
                    ))}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default AnimacionCarga;
