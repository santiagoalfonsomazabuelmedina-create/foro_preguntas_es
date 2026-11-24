# PRD · Foro de Preguntas Estudiantil (foro_preguntas_es)

> Documento de requisitos del producto (Product Requirements Document).
> Complétalo en el Sprint 0 (historia H0.3) y pide la aprobación del profesor en un Issue.
> Cada requisito funcional (RF) se convierte en un Issue con la plantilla "Historia de usuario".

| Campo | Valor |
| --- | --- |
| Alumno | [Santiago Mazabuel] |
| Proyecto n.º | 37 |
| Sitio de referencia | Stack Overflow |
| Compañero revisor |  |
| URL desplegada | (se completa en el Sprint 5) |

## 1. Problema

Los estudiantes suelen resolver dudas académicas en grupos de mensajería desordenados donde las preguntas se pierden entre cientos de mensajes y las mismas dudas se repiten cada semestre. No existe un espacio centralizado donde las mejores respuestas queden destacadas ni una forma rápida de buscar soluciones ya explicadas por otros compañeros o tutores.

## 2. Usuarios

- **Usuario principal:** Estudiantes universitarios que necesitan buscar dudas ya resueltas, publicar nuevas preguntas etiquetadas por materia, responder a compañeros y votar las soluciones más útiles desde su teléfono móvil o computadora.
- **Usuario secundario:** Tutores o moderadores académicos que revisan preguntas frecuentes, validan respuestas correctas y mantienen ordenadas las etiquetas del foro desde computadora.

## 3. Objetivo y métrica de éxito

Un estudiante busca una duda académica o encuentra la respuesta mejor votada de una pregunta en menos de 15 segundos, con listados ordenados por votos o actividad reciente sin recargas lentas.

## 4. Alcance del MVP

Entre 5 y 8 funcionalidades que SÍ entran este semestre:

1. Registro e identificación básica de usuarios (estudiantes y moderadores).
2. Gestión de etiquetas académicas (materias y temas) para clasificar preguntas.
3. Publicación, edición y consulta detallada de preguntas estudiantiles.
4. Publicación de respuestas y marcado de una respuesta aceptada por el autor.
5. Sistema de votos positivos y negativos en preguntas y respuestas con cálculo de puntaje.
6. Búsqueda de texto y ordenamiento de preguntas por votos o por actividad reciente.

### Funcionalidades → carpetas de `src/` (screaming architecture)

Cada funcionalidad del alcance será una carpeta en `src/`. Nómbralas en inglés y en plural.

| Funcionalidad | Carpeta |
| --- | --- |
| Gestión de usuarios | `src/users` |
| Etiquetas y materias | `src/tags` |
| Publicación y detalle de preguntas | `src/questions` |
| Respuestas y solución aceptada | `src/answers` |
| Sistema de votación | `src/votes` |
| Búsqueda de texto y ordenamiento | `src/searches` |

## 5. Fuera de alcance

Lo que NO vas a construir:

- Chat privado en tiempo real entre usuarios.
- Subida y almacenamiento de archivos pesados (PDFs, videos o proyectos comprimidos).
- Sistema avanzado de reputación, insignias (badges) o privilegios automáticos.
- Notificaciones por correo electrónico o mensajería push.
- Integración con inicio de sesión externo (OAuth con Google o GitHub).

## 6. Requisitos funcionales

| ID | Requisito | Prioridad (alta, media, baja) |
| --- | --- | --- |
| RF-01 | Registrar y consultar perfiles básicos de estudiantes y moderadores. | alta |
| RF-02 | Crear y listar etiquetas académicas para asociarlas a las preguntas. | alta |
| RF-03 | Publicar, listar, editar y consultar el detalle de preguntas con título, cuerpo y etiquetas. | alta |
| RF-04 | Publicar respuestas asociadas a una pregunta y permitir al autor marcar una respuesta como aceptada. | alta |
| RF-05 | Emitir un voto positivo (+1) o negativo (-1) por usuario en cada pregunta o respuesta evitando votos duplicados. | alta |
| RF-06 | Ordenar el listado de preguntas por puntaje de votos (mayor a menor) o por fecha de actividad más reciente. | alta |
| RF-07 | Buscar preguntas por coincidencia de texto en título, contenido y etiquetas, combinable con el criterio de ordenamiento. | alta |
| RF-08 | Filtrar preguntas por etiqueta específica o estado (sin respuesta / con respuesta aceptada). | media |

## 7. Requisitos no funcionales

- Responsive, móvil primero (375 px y 1280 px).
- Lighthouse ≥ 90 en Accesibilidad y Buenas prácticas.
- 0 errores en la consola del navegador.
- Funciona con 10.000 registros sin congelarse.
- Consultas de ordenamiento y búsqueda de texto con respuesta fluida mediante índices y algoritmos eficientes.

## 8. Modelo de datos

Diagrama entidad-relación y tablas PostgreSQL con tipos, claves y restricciones.

```mermaid
erDiagram
    USER ||--o{ QUESTION : publica
    USER ||--o{ ANSWER : escribe
    USER ||--o{ VOTE : emite
    QUESTION ||--o{ ANSWER : recibe
    QUESTION ||--o{ QUESTION_TAG : clasifica
    TAG ||--o{ QUESTION_TAG : agrupa
    QUESTION ||--o{ VOTE : acumula
    ANSWER ||--o{ VOTE : acumula

    USER {
        int id PK
        text full_name
        text email
        text role
        timestamptz created_at
    }
    TAG {
        int id PK
        text name
        text slug
    }
    QUESTION {
        int id PK
        int user_id FK
        text title
        text body
        int vote_score
        int accepted_answer_id
        timestamptz last_activity_at
        timestamptz created_at
    }
    QUESTION_TAG {
        int question_id FK
        int tag_id FK
    }
    ANSWER {
        int id PK
        int question_id FK
        int user_id FK
        text body
        int vote_score
        boolean is_accepted
        timestamptz created_at
    }
    VOTE {
        int id PK
        int user_id FK
        int question_id FK
        int answer_id FK
        int value
        timestamptz created_at
    }

## 9. Reto técnico distintivo

Orden por votos y por actividad reciente + búsqueda de texto: cada pregunta mantiene actualizados su puntaje acumulado (vote_score) y su marca temporal de última actividad (last_activity_at, actualizada al crear la pregunta, editarla o recibir una nueva respuesta). Para el ordenamiento en memoria sobre conjuntos filtrados se implementará un algoritmo de ordenamiento propio en src/shared/algorithms/ (como Merge Sort o Quick Sort estable con comparadores por vote_score o last_activity_at) y para la búsqueda de texto se normalizarán términos (minúsculas y sin tildes) combinando búsqueda por tokens/subcadenas e indexación en PostgreSQL para mantener tiempos de respuesta bajos incluso con 10.000 registros.

## 10. Riesgos y preguntas abiertas

-Prevención de votos duplicados: Garantizar con restricciones UNIQUE en PostgreSQL que un mismo usuario solo tenga un voto activo por pregunta o por respuesta, permitiendo cambiar de +1 a -1 o retirar el voto.

Actualización de last_activity_at: Definir qué eventos cuentan exactamente como actividad reciente (nueva respuesta, edición de pregunta o aceptación de respuesta) para mantener coherencia en el ordenamiento.

Relevancia en búsqueda de texto: Decidir si una coincidencia en el título de la pregunta debe ponderarse por encima de una coincidencia en el cuerpo cuando el usuario filtra por texto.

Permisos de edición y borrado: Definir si una pregunta con respuestas ya publicadas puede eliminarse o solo editarse/cerrarse.
