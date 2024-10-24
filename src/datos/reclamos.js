const reclamos = [
    {
        'numeroReclamo': 1,
        'dni': '12345678',
        'descripcion': 'Problemas con la presión del agua',
        'tipoReclamo': 'Vivienda',
        'unidad': { 'piso': 1, 'numero': 2, 'edificio': 'Torre Central' },
        'fecha': '2024-01-15',
        'estado': 'nuevo'
    },
    {
        'numeroReclamo': 2,
        'dni': '87654321',
        'descripcion': 'Fuga de gas en el área común',
        'tipoReclamo': 'Área Común',
        'unidad': { 'piso': 'PB', 'numero': 'N/A', 'edificio': 'Residencial Norte' },
        'fecha': '2024-02-12',
        'estado': 'enProceso'
    },
    {
        'numeroReclamo': 3,
        'dni': '11223344',
        'descripcion': 'Ruidos molestos en el piso de arriba',
        'tipoReclamo': 'Vivienda',
        'unidad': { 'piso': 3, 'numero': 8, 'edificio': 'Edificio Libertador' },
        'fecha': '2024-03-20',
        'estado': 'abierto'
    },
    {
        'numeroReclamo': 4,
        'dni': '44332211',
        'descripcion': 'Calefacción no funciona',
        'tipoReclamo': 'Vivienda',
        'unidad': { 'piso': 2, 'numero': 5, 'edificio': 'Residencial Norte' },
        'fecha': '2024-04-01',
        'estado': 'terminado'
    },
    {
        'numeroReclamo': 5,
        'dni': '33445566',
        'descripcion': 'Problema con las luces del pasillo',
        'tipoReclamo': 'Área Común',
        'unidad': { 'piso': 'PB', 'numero': 'N/A', 'edificio': 'Torre Central' },
        'fecha': '2024-05-10',
        'estado': 'nuevo'
    }
];

export default reclamos;
