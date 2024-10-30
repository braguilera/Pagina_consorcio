import React from 'react';
import { motion } from 'framer-motion';

const AnimacionCarga = () => {
  const filasDeCarga = Array(10).fill(0); // Número de filas en estado de carga

    return (
        <motion.div 
        className="tabla_cargando"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        >
        <input id='idEdificio' type='number' placeholder='Buscar por ID'></input>
        <div className="tabla_cargando_encabezado">
            <div>Id</div>
            <div>Nombre</div>
            <div>Dirección</div>
        </div>
        {filasDeCarga.map((_, index) => (
            <motion.div 
            key={index} 
            className="tabla_cargando_fila"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            >
            <div className="tabla_cargando_celda" style={{ width: '90%' }}></div>
            <div className="tabla_cargando_celda" style={{ width: '80%' }}></div>
            <div className="tabla_cargando_celda" style={{ width: '85%' }}></div>
            </motion.div>
        ))}
    </motion.div>
    );
};

export default AnimacionCarga;
