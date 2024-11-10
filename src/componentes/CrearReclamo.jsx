import React from 'react'

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
                    <header className='crearReclamo_container_header'>
                        <article className='crearReclamo_inputs'>
                            <p>¿En qué zona es el reclamo?</p>
                            <p>Vivienda</p>
                            <p>Tema</p> 
                        </article>
            
                        <article className='crearReclamo_descripcion'>
                            <p>Descripción (Máximo 200 carácteres)</p>
                        </article>
                    </header>

                    <aside className='crearReclamo_adjuntarImagenes'>
                        <p>Adjuntar imagenes (Máximo 3 imágenes)</p>
                    </aside>

                </article>
            </main>
        </section>

        </>
    )
}

export default CrearReclamo
