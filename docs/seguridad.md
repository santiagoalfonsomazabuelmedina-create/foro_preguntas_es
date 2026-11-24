# Revisión de seguridad (H11.3)

Revisa tu aplicación contra los riesgos más comunes de OWASP y deja evidencia de cada punto.

| Riesgo | Qué revisé | Evidencia (archivo, prueba o captura) | ¿OK? |
| --- | --- | --- | --- |
| Inyección SQL | Todas las consultas son parametrizadas | `tests/integration/…` | |
| XSS | Uso `textContent`, nunca `innerHTML` con datos del usuario | | |
| Contraseñas | Se guardan con hash (argon2 o bcrypt), nunca en texto plano | | |
| Control de acceso | Un usuario sin permiso recibe 403 | | |
| Secretos | No hay contraseñas ni `.env` en el repositorio | | |
| Validación | Toda entrada a la API pasa por Zod | | |
| Dependencias | `npm audit` sin vulnerabilidades altas | | |
