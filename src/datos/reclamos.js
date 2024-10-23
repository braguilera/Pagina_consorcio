const reclamos = [
    {
        'numeroReclamo': 1,
        'persona': 'Juan Pérez',
        'descripcion': 'Problemas con la presión del agua',
        'tipoReclamo': 'Vivienda',
        'unidad': { 'piso': 1, 'numero': 2, 'edificio': 'Torre Central' },
        'fecha': '2024-01-15',
        'estado': 'nuevo'
    },
    {
        'numeroReclamo': 2,
        'persona': 'María García',
        'descripcion': 'Fuga de gas en el área común',
        'tipoReclamo': 'Área Común',
        'unidad': { 'piso': 'PB', 'numero': 'N/A', 'edificio': 'Residencial Norte' },
        'fecha': '2024-02-12',
        'estado': 'enProceso'
    },
    {
        'numeroReclamo': 3,
        'persona': 'Carlos Rodríguez',
        'descripcion': 'Ruidos molestos en el piso de arriba',
        'tipoReclamo': 'Vivienda',
        'unidad': { 'piso': 3, 'numero': 8, 'edificio': 'Edificio Libertador' },
        'fecha': '2024-03-20',
        'estado': 'abierto'
    },
    {
        'numeroReclamo': 4,
        'persona': 'Lucía Fernández',
        'descripcion': 'Calefacción no funciona',
        'tipoReclamo': 'Vivienda',
        'unidad': { 'piso': 2, 'numero': 5, 'edificio': 'Residencial Norte' },
        'fecha': '2024-04-01',
        'estado': 'terminado'
    },
    {
        'numeroReclamo': 5,
        'persona': 'Roberto Sánchez',
        'descripcion': 'Problema con las luces del pasillo',
        'tipoReclamo': 'Área Común',
        'unidad': { 'piso': 'PB', 'numero': 'N/A', 'edificio': 'Torre Central' },
        'fecha': '2024-05-10',
        'estado': 'nuevo'
    }
];

export default reclamos;
