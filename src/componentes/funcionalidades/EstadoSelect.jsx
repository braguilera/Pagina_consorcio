import React from "react";

// Capitalizar la primera letra de una cadena
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const estados = ["abierto", "enProceso", "desestimado", "anulado", "terminado"];

const EstadoSelect = ({ reclamo, confirmarTerminarReclamo, cambiarEstado }) => {
    const handleSelectChange = (e) => {
        const nuevoEstado = e.target.value;
        if (nuevoEstado === "terminado") {
            confirmarTerminarReclamo(reclamo.numero);
        } else {
            cambiarEstado(reclamo.numero, nuevoEstado);
        }
    };

    return (
        <div className="custom-select-container">
            <select
                className={`custom-select estado-${reclamo.estado}`}
                value={reclamo.estado}
                onChange={handleSelectChange}
            >
                {/* Mostrar el estado 'nuevo' si corresponde */}
                {reclamo.estado === "Nuevo" && (
                    <option value="nuevo" className="estado-nuevo">
                        {capitalize(reclamo.estado)}
                    </option>
                )}

                <optgroup label="Change status" className="custom-select-title" />
                {estados.map((estado) => (
                    <option
                        key={estado}
                        value={estado}
                        className={`estado-${estado}`}
                    >
                        {capitalize(estado)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EstadoSelect;
