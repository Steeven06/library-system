# 📚 Library Management System

Sistema de gestión de biblioteca desarrollado con **arquitectura limpia (Clean Architecture)**, orientado a buenas prácticas de desarrollo, escalabilidad y despliegue moderno usando **Docker**.

Este proyecto forma parte de mi **portafolio profesional** como desarrollador de software.

---

## 🚀 Tecnologías Utilizadas

### Backend
- **.NET (ASP.NET Core Web API)**
- **Entity Framework Core**
- **PostgreSQL**
- **Arquitectura Clean (Domain / Application / Infrastructure / API)**
- **Docker & Docker Compose**
- **Swagger (OpenAPI)**

### Frontend
- **React**
- **Tailwind CSS**
- **Axios**
- **React Hooks**
- **Componentización y modales reutilizables**

---

## 🧱 Arquitectura del Proyecto

El backend está organizado siguiendo **Clean Architecture**, separando responsabilidades:
LibrarySystem
│
├── LibrarySystem.Domain # Entidades y contratos del dominio
├── LibrarySystem.Application # Lógica de negocio y servicios
├── LibrarySystem.Infrastructure # Acceso a datos (EF Core, PostgreSQL)
└── LibrarySystem.Api # API REST (Controllers, Swagger)

Beneficios:
- Bajo acoplamiento
- Alta mantenibilidad
- Fácil testeo
- Escalable a futuro

---

## 📦 Funcionalidades Principales

### 📖 Libros
- Crear, editar y eliminar libros
- Asignar autor y categoría
- Control de cantidad total y disponibilidad
- Soporte para portada (URL de imagen)
- Validaciones de datos

### ✍️ Autores
- CRUD completo
- Visualización de libros por autor
- Restricción de eliminación si tiene libros asociados

### 🗂️ Categorías
- CRUD completo
- Contador de libros por categoría
- Restricción de eliminación si tiene libros asociados

### 👤 Usuarios
- Gestión completa de usuarios
- Validaciones de datos

### 🔄 Préstamos
- Registro de préstamos
- Validación de disponibilidad
- Manejo de fechas en **UTC**
- Control automático de stock

---

## 🐳 Docker & Base de Datos

El proyecto utiliza **Docker Compose** para levantar:

- API (.NET)
- Base de datos **PostgreSQL**

### Servicios:
- `library_api`
- `library_db`

Con esto, **no es necesario instalar PostgreSQL localmente**.

---

## ▶️ Cómo ejecutar el proyecto (Docker)

### Requisitos
- Docker
- Docker Compose

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/library-management-system.git
cd library-management-system

