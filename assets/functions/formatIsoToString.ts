/**
 * Convierte un string ISO (ej: 2025-12-05T09:00:00.000Z) a formato local (dd/MM/YYYY HH:mm).
 * @param {string} isoString La fecha en formato ISO 8601.
 * @returns {string} La fecha formateada.
 */
export const formatEventDateTime = (isoString: string) => {
  // 1. Convertir el string ISO a un objeto Date de JavaScript
  const dateObject = new Date(isoString);

  // 2. Formatear la fecha (ej. 05/12/2025)
  const datePart = dateObject.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // 3. Formatear la hora (ej. 09:00)
  const timePart = dateObject.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23", // Asegura el formato 24 horas (00:00 a 23:59)
  });

  // 4. Combinar y devolver
  return `${datePart} ${timePart}`;
};
