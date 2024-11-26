
// fijate en el primer reclamo de la lista como ingreso la fecha que quiero,
// lo digo x si acaso ya que "Creo que se debe usar new Date(fecha)"
let reclamos = [
  {
    "id":1,
    "dni": "DNI1",
    "edificio": "the tower",
    "unidad": 11,
    "usuario": 111,
    "estado": "abierto",
    "fecha": new Date("9/24/2024")
  },
  {
    "id":2,
    "dni": "DNI2",
    "edificio": "ssl P madero",
    "unidad": 22,
    "usuario": 222,
    "estado": "terminado",
    "fecha": new Date()
  },
  {
    "id":3,
    "dni": "DNI3",
    "edificio": "ssl P madero",
    "unidad": 33,
    "usuario": 333,
    "estado": "proceso",
    "fecha": new Date()
  }
]

// es probable que tengas que cambiar algunos nombre de con lo que se compara 
// porque no tenia los nombres exactos que se usan en el postman

// abajo estan todas las funciones para filtrar, te piden el reclamo y con q lo queres filtrar
// en filtrarReclamoEntreFechas() te pide una fecha de inicio y una de fin
// avisame si no entendes algo

// use esta variable para testear pero el de fecha lo probe directamente en el console.log
let reclamosFiltrados = reclamos.filter((e)=> filtrarNumeroReclamo(e, 1));

function filtrarEstadoReclamo(reclamo, estado) {
  return reclamo.estado === estado;
}

function filtrarUnidadReclamo(reclamo, unidad) {
  return reclamo.unidad === unidad;
}

function filtrarUsuarioReclamo(reclamo, usuario) {
  return reclamo.usuario === usuario;
}

function filtrarEdificioReclamo(reclamo, edificio) {
  return reclamo.edificio === edificio;
}

function filtrarNumeroReclamo(reclamo, numero) {
  //id del reclamo
  return reclamo.id === numero;
}

function filtrarReclamoEntreFechas(reclamo, fechaInicio, fechaFin) {
  return reclamo.fecha >= fechaInicio && reclamo.fecha <= fechaFin;
}

  console.log("reclamos", reclamos)
  console.log("filtrados", reclamosFiltrados)
  console.log("filtrar fechas: ", reclamos.filter(
    (e)=>filtrarReclamoEntreFechas(e, new Date("7/24/2024"), new Date("12/20/2024"))
  ))
