# Prototipo del Sistema de Inventario (Angular 19)

Este proyecto es una migración y reimplementación de un diseño de sistema de inventario previamente construido en React, ahora desarrollado integralmente utilizando **Angular 19** (Standalone Components) y **Tailwind CSS**.

Se trata de un **prototipo funcional (Mock)** diseñado para mostrar la experiencia de usuario final, navegación, y maquetación de componentes, operando puramente sobre la memoria del navegador.

---

## 🚀 Requisitos Previos (Instalación)

Para poder compilar y ejecutar este ecosistema en tu propia máquina de manera local, necesitas instalar los siguientes componentes de software:

1. **Node.js (Librerías principales de ejecución)**
   - Angular requiere tener un entorno moderno de ejecución. Descarga e instala la **versión LTS** u la última (Node v18 o superior).
   - 🔗 [Descargar Node.js Oficial](https://nodejs.org/es/download/)
   - *Nota: NPM (Node Package Manager) viene incluido nativamente al instalar Node.*

2. **Angular CLI (Interfaz de línea de comandos)**
   - Necesitas tener la herramienta oficial de Angular para poder compilar y ejecutar el proyecto sin configuraciones pesadas.
   - Una vez tengas Node.js instalado, abre tu **terminal web / consola / CMD** y ejecuta el siguiente comando globalmente:
     ```bash
     npm install -g @angular/cli@19
     ```
   - 🔗 [Documentación del Angular CLI](https://v17.angular.io/cli)

3. **Editor de Código (Recomendado)**
   - Te sugerimos Visual Studio Code para navegar por los archivos y terminal nativa.
   - 🔗 [Descargar Visual Studio Code](https://code.visualstudio.com/)

---

## 📦 Inicialización del Proyecto

Una vez que tengas todos tus requisitos en tu máquina, sigue estos pasos para arrancar el sistema.

### 1. Ubícate en la Carpeta
Si estás utilizando una terminal (Por ejemplo, PowerShell o Git Bash), navega directo hacia el directorio donde reside tu código utilizando el comando `cd`:
```bash
cd angular-prototype
```

### 2. Instala las Dependencias
Debemos descargar e instalar todo el ecosistema (Tailwind CSS, íconos de Lucide Angular, ruteros, etc.). Ejecuta en tu terminal apuntando al archivo `package.json`:
```bash
npm install
```
*(Puede tomar de 1 a 2 minutos dependiendo de tu ancho de banda)*

---

## 🏃 Ejecución del Entorno de Desarrollo

Para "prender" o compilar este prototipo y poder visualizarlo en tu navegador de Internet, ejecuta el siguiente comando dentro de la carpeta `angular-prototype`:

```bash
ng serve
```
También puedes usar el comando estándar: `npm start`.

Cuando termine de compilar (mostrará un texto en verde con los paquetes subidos), abre tu navegador principal y entra a la siguiente dirección:

**🔗 [http://localhost:4200](http://localhost:4200)**

*(Para apagar el servidor de desarrollo, presiona en tu consola de comandos `Ctrl + C`)*

---

## 🔐 Usuarios de Prueba (Mocks)

Al acceder al enlace `localhost`, el sistema solicitará credenciales para poder continuar a la navegación debido a sus Guardias de Autenticación de Angular (`auth.guard.ts`). Dado que es un prototipo visual, puedes usar estos usuarios nativos ya listos en base:

| Perfil | Correo de Acceso | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@inventario.com` | `admin123` |
| **Auxiliar de Bodega** | `auxiliar@inventario.com` | `auxiliar123` |
| **Gerente** | `gerente@inventario.com` | `gerente123` |

> [!NOTE]
> Nota: Asegúrate de ingresar con el usuario Administrador si deseas tener la libertad para visualizar completamente pestañas como el manejo global de **Usuarios** o la de control jerárquico **Roles**.

---

## 🛠 Estructura de Tecnologías Clave:
*   **Angular 19 (Tipado estricto, Control Flow, Signal Services y directivas HTML)**
*   **Tailwind CSS (Motor PostCSS nativo integrado con el Angular Builder)**
*   **Lucide Angular (Conjunto iconográfico SVG portado)**
