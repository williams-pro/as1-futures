// Test para verificar el manejo de fechas
const dateFromDB = "2008-07-13";

console.log('Fecha de BD:', dateFromDB);
console.log('Formato esperado por input[type="date"]: YYYY-MM-DD');
console.log('¿Formato correcto?', /^\d{4}-\d{2}-\d{2}$/.test(dateFromDB));

// Test de conversión de Date a string
const dateObj = new Date(dateFromDB + 'T00:00:00.000Z');
console.log('Date object:', dateObj);
console.log('Date to ISO string:', dateObj.toISOString());
console.log('Date to YYYY-MM-DD:', dateObj.toISOString().split('T')[0]);

// Test de diferentes formatos
const testDates = [
  "2008-07-13",
  "2008-7-13", 
  "2008/07/13",
  "13/07/2008"
];

console.log('\nTest de formatos:');
testDates.forEach(date => {
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(date);
  console.log(`${date}: ${isValid ? '✅ Válido' : '❌ Inválido'}`);
});
