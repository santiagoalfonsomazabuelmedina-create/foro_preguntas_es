#!/bin/sh
# Se ejecuta al arrancar el contenedor.
set -e

# 1. Aplica las migraciones pendientes.
node db/migrate.ts

# 2. Arranca el servidor. `exec` reemplaza este shell por Node, así Node recibe
#    directamente las señales SIGTERM/SIGINT de Docker y puede cerrar en orden (Unidad 4).
#    Sin `exec`, la señal le llega al shell y Node muere sin despedirse.
exec node src/app/server.ts
