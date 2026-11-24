// Punto de entrada del frontend. Solo arranca las pantallas de cada funcionalidad;
// la lógica de cada una vive en su propia carpeta (src/tasks, src/sales, src/products…).
import { startTaskView } from '../../tasks/task.view.ts';

startTaskView();
