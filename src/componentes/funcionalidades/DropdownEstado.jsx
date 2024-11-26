import React, { useState } from "react";

const estados = ["abierto", "enProceso", "desestimado", "anulado", "terminado"];

const DropdownEstado = ({ reclamo, confirmarTerminarReclamo, cambiarEstado }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (estado) => {
        setIsOpen(false);
        if (estado === "terminado") {
            confirmarTerminarReclamo(reclamo.numero);
        } else {
            cambiarEstado(reclamo.numero, estado);
        }
    };

    return (
        <div className="dropdown-container">
            <div className="custom-select" onClick={toggleDropdown}>
                {reclamo.estado}
            </div>
            {isOpen && (
                <div className="dropdown">
                    <div className="dropdown-header">Change status</div>
                    {estados.map((estado) => (
                        <div
                            key={estado}
                            className={`dropdown-option estado-${estado}`}
                            onClick={() => handleOptionClick(estado)}
                        >
                            {estado}
                            {estado === reclamo.estado && <span>✔</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownEstado;
