// Accesibilidad: mostrar y limpiar mensajes de error
function showError(section, message) {
  var el = document.getElementById(section + '-error');
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
    el.focus && el.focus();
  }
}
function clearError(section) {
  var el = document.getElementById(section + '-error');
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}
// Puedes llamar showError('create', 'Debes seleccionar al menos un héroe y un villano.')
