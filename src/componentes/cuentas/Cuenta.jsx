import React, { useContext, useEffect, useState } from 'react'
import Contexto from '../../contexto/Contexto';
import { fetchDatos } from '../../datos/fetchDatos';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';
import Paginacion from '../funcionalidades/Paginacion';
import { AnimatePresence, easeOut, motion } from 'framer-motion';
import eliminar from '../../iconos/eliminar.svg'

const Cuenta = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual, setExito, exito, mostrarExito, setMostrarExito } = useContext(Contexto);

    const [cuentas, setCuentas] = useState([]);
    const [cuentasFiltradas, setCuentasFiltradas] = useState([]);
    const [alertaEliminacion, setAlertaEliminacion] = useState(false);
    const [mailCuentaEliminar, setMailCuentaEliminar] = useState();
    const [alertaActualizarCuenta, setAlertaActualizarCuenta] = useState(false);
    const [rolesCuenta, setRolesCuenta] = useState([]);
    const [actualizarCuenta, setActualizarCuenta] = useState({codigoCuenta:"", dni:"", mail:""});

    const [mostrarMail, setMostrarMail] = useState(true);
    const [mostrarRol, setMostrarRol] = useState(false);

    const cuentasPorPagina = 10;
    const indiceInicio = (paginaActual - 1) * cuentasPorPagina;
    const indiceFin = indiceInicio + cuentasPorPagina;
    const cuentasPaginados = cuentasFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(cuentasFiltradas.length / cuentasPorPagina);


    const obtenerCuentas = async () =>{
        setLoading(true);
        try {
            const data = await fetchDatos(`http://localhost:8080/cuenta/buscar_todas_cuentas`);
            setCuentas(data)
            setCuentasFiltradas(data)
            console.log(data)
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return [];
        } finally {
            setLoading(false);
        }
    }

    useEffect (()=>{
        obtenerCuentas();
    },[]);

    const manejarCambioDatos = (e) => {
        setActualizarCuenta({
            ...actualizarCuenta,
            [e.target.name]: e.target.value
        });
    };

    const filtrarCuentas = (event) => {
        const idCuentaBuscada = event.target.value.toUpperCase();
        setIdBusqueda(idCuentaBuscada);
        if (idCuentaBuscada === '') {
            setCuentasFiltradas(cuentas);
        } else {
            const filtrados = cuentas.filter(cuenta =>
                cuenta.id.toString().startsWith(idCuentaBuscada)
            );
            setCuentasFiltradas(filtrados);
        }
        setPaginaActual(1);
    };

    const eliminarCuenta = async (mailCuenta) => {
        try {
            const response = await fetch(`http://localhost:8080/cuenta/eliminar_cuenta_mail/${mailCuenta}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setCuentas((prevCuentas) => prevCuentas.filter(cuenta => cuenta.mail !== mailCuenta));
                setCuentasFiltradas((prevCuentas) => prevCuentas.filter(cuenta => cuenta.mail !== mailCuenta));
                setExito("Cuenta eliminada con éxito")
                setMostrarExito(true);
                setTimeout(() => setMostrarExito(false), 3000);
            } else {
                throw new Error("No se pudo eliminar la cuenta.");
            }
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    const actualizarMail = async () => {
        if (!actualizarCuenta.mail){
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }

        try {
    
            const response = await fetch('http://localhost:8080/cuenta/actualizar_cuenta_sin_contrasenia', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(actualizarCuenta),
            });
            if (!response.ok) throw new Error('Error al actualizar la cuenta');
            
            
            await obtenerCuentas();
            setExito("Mail actualizado con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);

        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    const eliminarRol = async (e) => {
        let rolEliminado = {};

        if(e.rol==="Administrador"){
            rolEliminado={codigoCuenta:e.codigoCuenta, rol:1};
        }
        if(e.rol==="Inquilino"){
            rolEliminado={codigoCuenta:e.codigoCuenta, rol:2};
        }
        if(e.rol==="Duenio"){
            rolEliminado={codigoCuenta:e.codigoCuenta, rol:3};
        }
        if(e.rol==="Empleado"){
            rolEliminado={codigoCuenta:e.codigoCuenta, rol:4};
        }

        console.log(rolEliminado)
        try {
            const response = await fetch('http://localhost:8080/cuenta/eliminar_rol_cuenta', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rolEliminado),
            });

            if (!response.ok) throw new Error('Error al eliminar el rol de la cuenta');

            await obtenerCuentas();

            setAlertaActualizarCuenta(false);

            setExito("Rol eliminado con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);
            
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } 
    }

    const agregarRolCuenta = async (e) => {

        try {
    
            const response = await fetch('http://localhost:8080/cuenta/agregar_rol_cuenta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(e),
            });
            if (!response.ok) throw new Error('Error al actualizar la cuenta');
            
            
            await obtenerCuentas();
            setAlertaActualizarCuenta(false);
            setExito("Rol agregado con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);

        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    }

    

    return (
        <section className='cuentas'>
            <h1>Administra las cuentas</h1>

            {loading ? (
                <AnimacionCarga columnas={['Id', 'Nombre', 'Mail', 'Rol']} filas={cuentasPorPagina} mostrarSelect={false} />
            ) : (
                <table className="tabla_container">
                    <div className="tabla_container_items">

                        <input
                                id="idCuenta"
                                className="buscador_tabla"
                                type="text"
                                placeholder="Buscar por id"
                                value={idBusqueda}
                                onChange={filtrarCuentas}
                            />
                        
                        <tbody className="tabla_body">
                            <thead className="tabla_encabezado">
                                <tr>
                                    <th>Id</th>
                                    <th>Nombre</th>
                                    <th>Mail</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            {cuentasPaginados.length > 0 ? (
                                cuentasPaginados.map((cuenta, index) => (
                                    <motion.tr
                                        className="tabla_objeto"
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: index * 0.07, type: 'spring' }}
                                        exit={{ opacity: 0, y: -50 }}
                                        key={cuenta.id}
                                        onClick={() => (
                                            setAlertaActualizarCuenta(true), 
                                            setRolesCuenta(cuenta.roles), 
                                            setMailCuentaEliminar(cuenta.mail), 
                                            setActualizarCuenta({ codigoCuenta: cuenta.id, dni: cuenta.persona.documento, mail: "" })
                                        )}
                                    >
                                        <td>{cuenta.id}</td>
                                        <td>{cuenta.persona.nombre}</td>
                                        <td>{cuenta.mail}</td>
                                        <td>{cuenta.roles.map((r) => <p key={r.rol}>{r.rol}</p>)}</td>
                                        <td>
                                            <img
                                                src={eliminar}
                                                alt="Botón para eliminar persona"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAlertaEliminacion(true);
                                                    setMailCuentaEliminar(cuenta.mail);
                                                }}
                                            />
                                        </td>
                                    </motion.tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No se encontró ninguna persona.</td>
                                </tr>
                            )}
                        </tbody>
                    </div>
                    <Paginacion
                        paginaActual={paginaActual}
                        setPaginaActual={setPaginaActual}
                        totalPaginas={totalPaginas}
                    />
                </table>
            )}

            <AnimatePresence>
                    {alertaEliminacion && (
                        <div className='alerta_fondo'>
                            <motion.section 
                                className='alertaEliminar'
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.3, ease: easeOut }}
                            >
                                <p>¿Está seguro que desea eliminar la cuenta con el mail <strong>{mailCuentaEliminar}</strong>?</p>
                                <div className='alertaEliminarBotones'>
                                    <button onClick={() => { eliminarCuenta(mailCuentaEliminar); setAlertaEliminacion(false); }} className='boton_general'>Aceptar</button>
                                    <button onClick={() => setAlertaEliminacion(false)} className='boton_general'>Cancelar</button>
                                </div>
                            </motion.section>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {alertaActualizarCuenta && (
                        <div 
                            className='alerta_fondo'
                        >
                            <motion.main 
                                className='alerta_actualizar_cuenta'
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.3, ease: easeOut }}
                            >
                                <header className='cuenta_botones_header'>
                                    <button 
                                        onClick={()=> (setMostrarMail(true), setMostrarRol(false))} 
                                        className={ mostrarMail ? "actualizar_boton_activo_mail" : "actualizar_boton_mail"}>
                                    Mail</button>

                                    <button 
                                        onClick={()=> (setMostrarRol(true), setMostrarMail(false))} 
                                        className={ mostrarRol ? "actualizar_boton_activo_rol" : "actualizar_boton_rol"}>
                                    Roles</button>
                                </header>

                                {
                                    mostrarMail && (
                                        <article className='actualizar_container'>
                                                <main className='actualizar_datos'>

                                                    <h2>Actualizar mail</h2>
                                                        <p>
                                                            Mail actual: 
                                                        </p>
                                                        <strong>
                                                            {mailCuentaEliminar}
                                                        </strong>
                                                        <p>Nuevo mail:</p>
                                                        <input
                                                            type="text"
                                                            name="mail"
                                                            placeholder="Ingrese mail"
                                                            value={actualizarCuenta.mail}
                                                            onChange={manejarCambioDatos}
                                                            required
                                                        />

                                                </main>
                                                <div className='alertaEliminarBotones'>
                                                    <button onClick={() => { actualizarMail(); setAlertaActualizarCuenta(false); }} className='boton_general'>Aceptar</button>
                                                    <button onClick={() => setAlertaActualizarCuenta(false)} className='boton_cancelar'>Cancelar</button>
                                                </div>
                                        </article>
                                    )
                                }
                                
                                {
                                    mostrarRol && (
                                        <article className='actualizar_container'>
                                            <main className='actualizar_datos'>
                                                <h2>Actualizar roles</h2>

                                                {rolesCuenta && rolesCuenta.length > 0 ? (
                                                <section className='actualizar_botones_roles'>
                                                    {["Empleado", "Duenio", "Inquilino"].map((rol, index) => {
                                                        const rolId = rol === "Empleado" ? 4 : rol === "Duenio" ? 3 : 2;
                                                        const existeRol = rolesCuenta.some(r => r.rol === rol);

                                                        return existeRol ? (
                                                            <div key={index}>
                                                                <strong>{ rol==="Duenio" ? "Dueño" : rol }</strong>
                                                                <img
                                                                    src={eliminar}
                                                                    alt={`Botón para eliminar el rol ${rol}`}
                                                                    onClick={() =>
                                                                        eliminarRol({
                                                                            codigoCuenta: actualizarCuenta.codigoCuenta,
                                                                            rol: rol,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        ) : (
                                                            <button
                                                                key={index}
                                                                onClick={() =>
                                                                    agregarRolCuenta({
                                                                        mail: mailCuentaEliminar,
                                                                        rol: rolId,
                                                                    })
                                                                }
                                                            >
                                                                {rol}
                                                            </button>
                                                        );
                                                    })}
                                                </section>
                                            ) : (

                                                <secion className="actualizar_botones_roles">
                                                    <button
                                                        onClick={() => agregarRolCuenta({mail:mailCuentaEliminar, rol:4})}
                                                    >Empleado</button>

                                                    <button
                                                        onClick={() => agregarRolCuenta({mail:mailCuentaEliminar, rol:3})}
                                                    >Duenio</button>

                                                    <button
                                                        onClick={() => agregarRolCuenta({mail:mailCuentaEliminar, rol:2})}
                                                    >Inquilino</button>
                                                </secion>
                                            )}


                                            </main>
                                            <div className='alertaEliminarBotones'>
                                                <button onClick={() => { eliminarCuenta(mailCuentaEliminar); setAlertaActualizarCuenta(false); }} className='boton_general'>Aceptar</button>
                                                <button onClick={() => setAlertaActualizarCuenta(false)} className='boton_cancelar'>Cancelar</button>
                                            </div>

                                        </article>
                                    )
                                }
                            </motion.main>
                        </div>
                    )}
                </AnimatePresence>

                {mostrarError && (
                <motion.div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        zIndex: '1000'
                    }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                >
                    Error: {error}
                </motion.div>
            )}

            {mostrarExito && (
                    <motion.div style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        zIndex: '1000'
                        }}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {exito}
                    </motion.div>
                )}

        </section>
    )
};

export default Cuenta
