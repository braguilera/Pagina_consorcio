import React from 'react'
import { motion } from 'framer-motion'

const CrearReclamo = () => {
    return (
        <>
        <section className='crearReclamo'>
            <header className='crearReclamo_header'>
                <h1>Nuevo Reclamo</h1>
                <p>Describe el problema y adjunta imágenes si es necesario</p>
            </header>

            <main className='crearReclamo_main'>
                <aside className='crearReclamo_imagen'></aside>
                <article className='crearReclamo_container'>
                <h2> Detallanos tu solicitud </h2>
                    
                    <div className='crearReclamo_grid'>
                        <header className='crearReclamo_container_header'>
                            <article className='crearReclamo_inputs'>
                                <h3>¿En qué zona es el reclamo?</h3>
                                <div className='crearReclamo_inputs_radio'>
                                    
                                    <input type='radio'/>
                                    <p>Zona común</p>
                                    <input type='radio'/>
                                    <p>Vivienda</p>
                                </div>


                                <h3>Vivienda</h3>
                                <input type='text'/>
                                <h3>Tema</h3> 
                                <select>
                                    <option>Plomería</option>
                                    <option>Electricidad</option>
                                    <option>Otro...</option>
                                </select>
                            </article>
                
                            <article className='crearReclamo_descripcion'>
                                <h3>Descripción (Máximo 200 carácteres)</h3>
                                <textarea  maxLength={200}/>
                            </article>
                        </header>

                        <aside className='crearReclamo_adjuntarImagenes'>
                            <h3>Adjuntar imagenes (Máximo 3 imágenes)</h3>
                        </aside>
                    </div>

                    <footer className='crearReclamo_container_button'>
                        <motion.button 
                            className='boton_general'
                            type="submit"
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Enviar reclamo
                        </motion.button>

                    </footer>


                </article>
            </main>
        </section>

        </>
    )
}

export default CrearReclamo
