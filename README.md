# 📚 Library System

Sistema de gestión de biblioteca desarrollado como proyecto **Full Stack**, con frontend minimalista y backend desacoplado mediante una API REST.

El sistema permite administrar de forma centralizada:

- 📖 Libros
- ✍️ Autores
- 🗂️ Categorías
- 👤 Usuarios
- 🔄 Préstamos

El proyecto está pensado como **portafolio personal**, aplicando buenas prácticas de arquitectura, separación de responsabilidades y despliegue en la nube.

---
## 🚀 Demo en producción

🌐 https://library-systemf.vercel.app/
--

## 🧪 Tecnologías Utilizadas

### 🔹Backend
- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- Swagger (OpenAPI)

### 🔹Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### 🔹Infraestructura
- Docker
- Railway
- Vercel
- GitHub



---

## 🧱 Arquitectura del sistema

El proyecto sigue una arquitectura **cliente-servidor** desacoplada:
### 🔹 Frontend
- Aplicación SPA desarrollada con **React + Vite**
- Consume la API REST mediante **Axios**
- Manejo de estados y componentes reutilizables
- Diseño responsive (desktop y móvil)

### 🔹 Backend
- API REST con **ASP.NET Core**
- Arquitectura en capas:
  - **API**
  - **Application**
  - **Domain**
  - **Infrastructure**
- Entity Framework Core como ORM
- Base de datos PostgreSQL

### 🔹 Contenedorización
- Backend dockerizado con **Docker**
- Variables de entorno para configuración segura
- Ideal para despliegue en la nube

---

## ✨ Funcionalidades

- Gestión de **Autores**
- Gestión de **Libros**
- Gestión de **Usuarios**
- Gestión de **Préstamos**
- UI responsive (desktop y móvil)
- Consumo de API REST
- Validaciones y control de errores

---

## 🖥️ Ejecutar en local (resumen)

```bash
git clone https://github.com/Steeven06/library-system.git
cd library-system
```

### 🔹Frontend
```bash
cd frontend
npm install
npm run dev
```

### 🔹Configurar .env:
```bash
VITE_API_URL=http://localhost:8080/api
```

### 🔹Backend
```bash
cd backend
dotnet restore
dotnet run
```
---
## 🐳 Docker (Backend)

El backend está preparado para ejecutarse en contenedores Docker, utilizando variables de entorno para conexión a base de datos y puerto. 
### Build de la imagen
```bash
docker build -t library-system-api .
```
---
## 📌 Notas
- **Proyecto enfocado en arquitectura, buenas prácticas y despliegue**
- **No incluye autenticación (pensado como demo/portafolio)**
- **Backend desplegado como API REST independiente**
---
## 👤 Autor
**STEEVEN ISAIAS JIMENEZ**

🎓Desarrollador de Software.
