'use strict';

module.exports = {
  id: null,
  url: null,
  name: null,
  map: null,
  rating: null,
  address: null,
  telephone: null,
  email: null,
  webpage: null,
  // "price": [
  //   {
  //     "priceLabel": "Precio medio",
  //     "priceAmount": "35 € "
  //   },
  //   {
  //     "priceLabel": "Precio del menú",
  //     "priceAmount": "14 € "
  //   },
  //   {
  //     "priceLabel": "Menú degustación",
  //     "priceAmount": "27 € \n                                "
  //   }
  // ],
  // "schedule": [
  //   "Horario de cocina: 14.00 a 16.00 y de 20.30 a 00.00",
  //   "Cierre semanal: Domingo, festivos ",
  //   "Cierre anual: Dos semanas en febrero"
  // ],
  // "details": [
  //   {
  //     "detailLabel": "Tipo de cocina:",
  //     "detailText": "Tapas"
  //   },
  //   {
  //     "detailLabel": "Ambiente y Decoración:",
  //     "detailText": "Informal, Agradable"
  //   },
  //   {
  //     "detailLabel": "Clientela:",
  //     "detailText": "Familiar, Joven"
  //   },
  //   {
  //     "detailLabel": "Jefe Cocina:",
  //     "detailText": "Joxean Calvo"
  //   },
  //   {
  //     "detailLabel": "Ambiente y Decoración:",
  //     "detailText": "Agradable, Clásica, Acogedor, Intimo"
  //   },
  //   {
  //     "detailLabel": "Clientela:",
  //     "detailText": "Familiar, Empresa, Joven, Turística, Elegante"
  //   },
  //   {
  //     "detailLabel": "Criterios Restaurante:",
  //     "detailText": "Menú celiacos, Menú vegetariano"
  //   },
  //   {
  //     "detailLabel": "Propietario:",
  //     "detailText": "Pierre Yves Nehr"
  //   },
  //   {
  //     "detailLabel": "Gerente:",
  //     "detailText": "Pierre Yves Nehr"
  //   },
  //   {
  //     "detailLabel": "Jefe Cocina:",
  //     "detailText": "Pierre Yves y Silvia Paco Uscamayta"
  //   },
  //   {
  //     "detailLabel": "Director sala:",
  //     "detailText": "Maite Mujika"
  //   },
  //   {
  //     "detailLabel": "Director sala:",
  //     "detailText": "Antonio Medina"
  //   },
  //   {
  //     "detailLabel": "Sumiller:",
  //     "detailText": "Antonio Medina"
  //   }
  // ],
  // "specialties": [
  //   {
  //     "specialtyLabel": "Otros vinos:",
  //     "specialtyText": "Otras D.O."
  //   },
  //   {
  //     "specialtyLabel": "Carta de aceites:",
  //     "specialtyText": "No"
  //   },
  //   {
  //     "specialtyLabel": "Carro o tabla de queso:",
  //     "specialtyText": "No"
  //   },
  //   {
  //     "specialtyLabel": "Postres:",
  //     "specialtyText": "Tarta tatin "
  //   },
  //   {
  //     "specialtyLabel": "Vino de la casa:",
  //     "specialtyText": "Pago de Oro (D.O. Toro)"
  //   },
  //   {
  //     "specialtyLabel": "Otros vinos:",
  //     "specialtyText": "Otras D.O."
  //   },
  //   {
  //     "specialtyLabel": "Aceite de oliva:",
  //     "specialtyText": "1 variedad"
  //   },
  //   {
  //     "specialtyLabel": "Carta de aceites:",
  //     "specialtyText": "No"
  //   },
  //   {
  //     "specialtyLabel": "Quesos:",
  //     "specialtyText": "4 variedades"
  //   },
  //   {
  //     "specialtyLabel": "Carro o tabla de queso:",
  //     "specialtyText": "Si"
  //   }
  // ],
  // "services": [
  //   "Novedad",
  //   "Terraza",
  //   "AMEX",
  //   "Romántico",
  //   "Comedores privados",
  //   "VISA",
  //   "Carta en inglés",
  //   "Master Card",
  //   "Menú vegetariano",
  //   "Menú vegetariano",
  //   "Menú para celíacos",
  //   "Buena relación Calidad - Precio",
  //   "Certificado Q",
  //   "Buena relación Calidad - Precio",
  //   "Especial Niños",
  //   "Especial Niños",
  //   "Menú vegetariano",
  //   "Menú para celíacos",
  //   "Gintonics",
  //   "Buena relación Calidad - Precio",
  //   "Especial Niños",
  //   "Lugar Pintoresco"
  // ],
  // "valoration": [
  //   {
  //     "valorationLabel": "Bodega",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Servicio del vino",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Servicio de la sala",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Servicio de la mesa",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Agua",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Carnes",
  //     "valorationText": "Bueno"
  //   },
  //   {
  //     "valorationLabel": "Hortalizas",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Pan",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Pescados y mariscos",
  //     "valorationText": "Bueno"
  //   },
  //   {
  //     "valorationLabel": "Dulces",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Cafés e infusiones",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Pastas",
  //     "valorationText": "Bueno"
  //   },
  //   {
  //     "valorationLabel": "Pescados y mariscos",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Dulces",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Cafés e infusiones",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Cafés e infusiones",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Cafés e infusiones",
  //     "valorationText": "Aprobado"
  //   },
  //   {
  //     "valorationLabel": "Cafés e infusiones",
  //     "valorationText": "Aprobado"
  //   }
  // ],
  // "tags": [
  //   "Agradable",
  //   "Empresa",
  //   "Turística",
  //   "Elegante",
  //   "Familiar",
  //   "Marinera",
  //   "Cosmopolita",
  //   "Clásica",
  //   "Cántabra",
  //   "Acogedor",
  //   "Mediterránea",
  //   "Mesón",
  //   "Española",
  //   "Manchega"
  // ]
  cluster: null,
  section: null,
  index: null,
  datetime: null,
};
