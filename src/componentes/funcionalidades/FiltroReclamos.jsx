import React, { useState } from 'react';

const FiltroReclamos = ({ reclamos, setReclamosFiltradas }) => {
    const [filtros, setFiltros] = useState({
        id: '',
        estado: '',
        unidad: '',
        usuario: '',
        fechaInicio: '',
        fechaFin: '',
    });

    const actualizarFiltro = (campo, valor) => {
        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            [campo]: valor,
        }));
    };

    const aplicarFiltros = () => {
        const {
            id,
            estado,
            unidad,
            usuario,
            fechaInicio,
            fechaFin,
        } = filtros;

        const filtrados = reclamos.filter((reclamo) => {
            const cumpleId = id ? reclamo.numero.toString().startsWith(id) : true;
            const cumpleEstado = estado ? reclamo.estado === estado : true;
            const cumpleUnidad = unidad
                ? reclamo.unidad && reclamo.unidad.numero?.toString().toLowerCase().includes(unidad.toLowerCase())
                : true;
            const cumpleUsuario = usuario
                ? reclamo.usuario.nombre.toLowerCase().includes(usuario.toLowerCase())
                : true;
            const cumpleFechaInicio = fechaInicio
                ? new Date(reclamo.fechalocal) >= new Date(fechaInicio)
                : true;
            const cumpleFechaFin = fechaFin
                ? new Date(reclamo.fechalocal) <= new Date(fechaFin)
                : true;

            return (
                cumpleId &&
                cumpleEstado &&
                cumpleUnidad &&
                cumpleUsuario &&
                cumpleFechaInicio &&
                cumpleFechaFin
            );
        });

        setReclamosFiltradas(filtrados);
    };

    return (
        <div className="filtro-container">
            <input
                type="text"
                className="buscador_tabla"
                placeholder="Buscar por ID..."
                value={filtros.id}
                onChange={(e) => actualizarFiltro('id', e.target.value)}
            />
            <select
                className="personas_select"
                onChange={(e) => actualizarFiltro('estado', e.target.value)}
            >
                <option value="">Filtrar por Estado</option>
                <option value="Nuevo">Nuevo</option>
                <option value="abierto">Abierto</option>
                <option value="enProceso">En Proceso</option>
                <option value="desestimado">Desestimado</option>
                <option value="anulado">Anulado</option>
                <option value="terminado">Terminado</option>
            </select>
            <input
                type="text"
                className="buscador_tabla"
                placeholder="Buscar por Unidad..."
                value={filtros.unidad}
                onChange={(e) => actualizarFiltro('unidad', e.target.value)}
            />
            <input
                type="text"
                className="buscador_tabla"
                placeholder="Buscar por Usuario..."
                value={filtros.usuario}
                onChange={(e) => actualizarFiltro('usuario', e.target.value)}
            />
            <input
                type="date"
                className="buscador_tabla"
                placeholder="Desde..."
                value={filtros.fechaInicio}
                onChange={(e) => actualizarFiltro('fechaInicio', e.target.value)}
            />
            <input
                type="date"
                className="buscador_tabla"
                placeholder="Hasta..."
                value={filtros.fechaFin}
                onChange={(e) => actualizarFiltro('fechaFin', e.target.value)}
            />
            <button onClick={aplicarFiltros} className="boton-filtrar">
                Aplicar Filtros
            </button>
        </div>
    );
};

export default FiltroReclamos;
