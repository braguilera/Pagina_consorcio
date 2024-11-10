import React from 'react'

const CrearReclamo = () => {
    return (
        <>
        <header className='crearReclamo_header'>
            <h1>Nuevo Reclamo</h1>
            <p>Describe el problema y adjunta imágenes si es necesario</p>
        </header>

        <main className='crearReclamo_main'>
            <aside className='crearReclamo_imagen'></aside>
            <article className='crearReclamo_container'>
                <h2> Detallanos tu solicitud </h2>
                <header className='crearReclamo_container_header'>
                    <div></div>
                    <div></div>
                </header>
            </article>
        </main>
        </>
    )
}

export default CrearReclamo
