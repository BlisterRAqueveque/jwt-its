# API Rest Para Registro de usuarios, prueba de JWT (creado y refresco) y guardianes de rutas.

Este repositorio contiene la API para el registro de usuarios, JWT y rutas. A continuación, se detallan las dependencias, configuraciones y pasos para la instalación y despliegue.

---

## Framework Principal
<div style="display: flex; justify-content: center">
    <img src="./nest-js.svg" alt="CircleCI" height="100">
</div>

- **Nest Js**: `^10.0.0`
 
---

## Dependencias Utilizadas

| Librería                         | Versión    | Instalación                        | Funcionalidad                                                                                                                                                      |
|-----------------------------------|------------|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `@nestjs/jwt`                     | `^10.1.0`  | `npm install @nestjs/jwt`          | Proporciona soporte para la generación y validación de JSON Web Tokens (JWT).                                                                                       |
| `@nestjs/passport`                | `^10.0.2`  | `npm install @nestjs/passport`     | Integración de Passport con NestJS, utilizado para la autenticación.                                                                                               |
| `@nestjs/typeorm`                 | `^10.0.0`  | `npm install @nestjs/typeorm`      | ORM para manejar bases de datos con TypeORM.                                                                                                                      |
| `bcrypt`                          | `^5.1.0`   | `npm install bcrypt`               | Librería para encriptar contraseñas y verificar hashes de contraseñas.                                                                                              |
| `class-transformer`               | `^0.5.1`   | `npm install class-transformer`    | Utilizado para transformar y validar objetos de TypeScript.                                                                                                         |
| `class-validator`                 | `^0.14.0`  | `npm install class-validator`      | Librería para validar objetos de clase en TypeScript.                                                                                                               |
| `dotenv`                          | `^16.4.5`  | `npm install dotenv`               | Permite la carga de variables de entorno desde archivos `.env`.                                                                                                     |
| `joi`                             | `^17.13.3` | `npm install joi`                  | Librería para validación de esquemas y objetos en JavaScript.                                                                                                       |
| `passport-jwt`                    | `^4.0.1`   | `npm install passport-jwt`         | Estrategia de Passport para la autenticación con JWT.                                                                                                              |
| `typeorm`                         | `^0.3.17`  | `npm install typeorm`              | ORM para interactuar con bases de datos.                                                                                                                            |
| `@types/multer`                   | `^1.4.12`  | `npm install @types/multer`        | Carga de archivos.                                                                                                                         |

---

## Dependencias de Desarrollo (Dev)

| Librería                  | Versión   | Instalación                        |
|---------------------------|-----------|------------------------------------|
| `@types/bcrypt`            | `^5.0.0`  | `npm install @types/bcrypt`        |

---

## Modo de Desarrollo

1. **Clonar el repositorio**:
    ```bash
    git clone https://github.com/BlisterRAqueveque/jwt-its.git
    ```

2. **Instalar dependencias**:
    ```bash
    npm i
    ```

3. **Configurar el archivo `.env`**:
   - Crea un archivo `.env` en la raíz del proyecto y configura las variables necesarias (por ejemplo, para la base de datos, JWT, etc.).

4. **Correr la aplicación**:
    ```bash
    npm run start:dev
    ```

---

## Build

1. **Traer cambios desde la rama `main`**:
    ```bash
    git pull
    ```

2. **Correr el contenedor Docker**:
    ```bash
    docker compose up --build -d
    ```
3. **El puerto de escucha es el :4200**


---

## Archivo de configuración de Nginx

```nginx
server {
    listen 80;
    server_name [name];
    return 301 https://[name]$request_uri;
}

server {
    listen 80;
    server_name www.[name];
    return 301 https://[name]$request_uri;
}

server {
    listen 443 ssl;
    root [location];

    server_name [name];

    ssl_certificate     /etc/letsencrypt/live/[name]/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/[name]/privkey.pem;

    location /api {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass [port];
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location ~* \.(eot|ttf|woff|woff2)$ {
        add_header 'Access-Control-Allow-Origin' *;
    }

    # Configuración para otros servicios o rutas específicas
    # Path para el acceso a los uploads
    location /uploads/ {
        alias [alias];
        add_header 'Access-Control-Allow-Origin' *;
    }
}
```


## 📧 **Contacto**

Si tienes alguna duda o sugerencia sobre la aplicación, no dudes en contactarnos a través del correo electrónico: raqueveque@itscipolletti.edu.ar.

## 🤝 HvDevs Team

Gracias por utilizar nuestra aplicación.

<h1>Desarrollado con ❤️ por: <b>HvDevs Team</b> <img src="./logo-hvdevs.svg" alt="HvDevs Logo" width="30">.</h1>