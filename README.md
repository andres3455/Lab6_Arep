# Escuela Colombiana de Ingeniería
# Arquitecturas Empresariales

## Taller 5 Trabajo individual en patrones arquitecturales

## Descripcion del laboratorio
El objetivo principal es construir una aplicación web funcional que permita a los usuarios realizar operaciones CRUD sobre una base de datos de propiedades.
Para esta ocasion se opto por continuar utilizando docker para el despliegue en AWS

Las operaciones basicas que ofrece la aplicación son las siguientes:

* Crear nuevos listados de propiedades.
* Lea o vea una lista de todas las propiedades y los detalles de las propiedades individuales.
* Actualice los detalles de la propiedad existente.
* Eliminar listados de propiedades.

---
### Prerrequisitos

* [Maven](https://maven.apache.org/): Es una herramienta de comprensión y gestión de proyectos de software. Basado en el concepto de modelo de objetos de proyecto (POM), Maven puede gestionar la construcción, los informes y la documentación de un proyecto desde una pieza de información central.
* [Git](https://learn.microsoft.com/es-es/devops/develop/git/what-is-git): Es un sistema de control de versiones distribuido, lo que significa que un clon local del proyecto es un repositorio de control de versiones completo. Estos repositorios locales plenamente funcionales permiten trabajar sin conexión o de forma remota con facilidad.

* [Docker](https://www.docker.com/): Es una plataforma para desarrollar, enviar y ejecutar aplicaciones en contenedores. Permite empaquetar una aplicación y sus dependencias en un contenedor ligero y portátil, garantizando la consistencia en diferentes entornos.

---

### Tecnologias usadas

* Frontend: HTML, JavaScript (Fetch API para comunicación con el backend).
* Backend: Spring Boot (API RESTful con JPA/Hibernate).
* Base de Datos: MySQL (gestión de datos con persistencia).
* Despliegue: AWS (2 EC2 para backend y base de datos).

---

## Disposición del directorio de arcchivos

```                 
LAB5AREP/
│── src/
│   ├── main/
│   │   ├── java/edu/eci/arep/lab5arep/Backend/
│   │   │   ├── controller/
│   │   │   │   ├── PropertyController.java
│   │   │   ├── exception/
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   ├── model/
│   │   │   │   ├── Property.java
│   │   │   ├── repository/
│   │   │   │   ├── PropertyRepository.java
│   │   │   ├── service/
│   │   │   │   ├── PropertyService.java
│   │   │   ├── Server.java
│   │   ├── resources/
│   │   │   ├── www/
│   │   │   │   ├── agregar.html
│   │   │   │   ├── buscar.html
│   │   │   │   ├── editar.html
│   │   │   │   ├── index.html
│   │   │   ├── script.js
│   │   │   ├── styles.css
│   │   │   ├── application.properties
│── test/
│── target/
│── .gitignore
│── .gitattributes
│── docker-compose.yml
│── Dockerfile
│── pom.xml

```

---

### Arquitectura

El sistema de gestión de propiedades inmobiliarias sigue una arquitectura basada en tres capas: Frontend, Backend y Base de Datos.
Estas capas interactúan para permitir a los usuarios realizar operaciones CRUD sobre los listados de propiedades

1. Frontend
* Entre sus funciones esta:

   * Formularios para crear y editar propiedades.
   * Lista de propiedades con opciones para ver, actualizar y eliminar.
   * Validación en el lado del cliente antes de enviar los datos.
   * Comunicación con el backend mediante AJAX/Fetch API para realizar solicitudes HTTP

2. Backend:
* Se encarga de procesar las solicitudes, esta compuesto por:

  * Controller -> Gestiona la solicitudes HTTP
  * Service -> Logica para la manipulación de los datos
  * Repository -> Interactua con la base de datos usando JPA/Hibernate
  * Exception -> Maneja errores de manera personalizada 

Se implementaron los siguientes Endpoints:
  * POST -> /properties (crea una nueva propiedad)
  * GET -> /properties (Obtiene todas las propiedades)
  * GET -> /properties/{id} (Obtiene una propiedad especifica)
  * PUT -> /properties/{id} (Actualiza una propiedad especifica)
  * DELETE -> /properties/{id} (Elimina una propiedad)

3. Base de datos

  * Almacena los listados de las propiedades, se implemento en una instancia EC2 en AWS

4. El flujo general es:
   
   * El usuario interactúa con el frontend para agregar, ver, actualizar o eliminar propiedades.
   * El frontend envía solicitudes HTTP al backend usando la Fetch API.
   *El backend procesa la solicitud y se comunica con la base de datos para almacenar o recuperar información.
   * El backend devuelve una respuesta en JSON al frontend, que actualiza la interfaz del usuario.

   

### Instalación y instrucciones de despliegue

1) Debemos clonar el repositorio
```
https://github.com/andres3455/lab5Arep.git
```
2) Una vez clonamos, accedemos al directorio
```
cd lab5arep
```
3) Construimos la imagen de docker
```
docker build --tag dockerlab5
```
--- Evidencia

![Captura de pantalla 2025-03-05 195809](https://github.com/user-attachments/assets/99f64dd9-028c-4eb6-8dc7-c55347c4afcc)



4) Le asignamos un tag a la imagen

Luego lo que haremos es crear una referencia del repositorio a nuestra imagen que creamos anteriomente.

Antes de continuar se debe crear el repositorio en dockerhub
```
docker tag dockerlab5 andres3455/dokckerandres:latest
```

Nos logeamos desde la consola 
```
docker login
```
Empujamos la imagen al repositorio en DockerHub

```
docker push andres3455/dockerandres:latest
```

## Comandos que te pueden ayudar

```
docker logs [imagen del contenedor]
docker exec -it [imagen del contenedor] sh
docker ps
docker images 
```

## Despliegue en AWS

Creamos una instancia en AWS EC2 con un sistema operativo basado en Linux , y accedemos a la consola de la instancia, tambien crearemos una para la base de datos, asi como se muestra en la imagen

![image](https://github.com/user-attachments/assets/dde8a413-536c-4e38-88e5-afff53cca1bb)


Instalamos docker en la instancia donde estara el backend con el siguiente comando:

```
sudo apt install docker
sudo service docker start
```
Se configura el usuario en el grupo de docker para no tener que usar sudo cada vez que invoquemos un comando

```
sudo usermod -aG docker ubuntu
```
Nos desconectamos de la maquina para guardar los cambios y volvemos a ingresar

### Ultimo paso para el backend

A partir de la imagen del repo que creamos en dockerhub , creamos una instancia a una nuevo contenedor independiente de la consola con el puerto 8080.

```
docker run -d -p 8080:8080 --name dockerlab5aws andres3455/dockerandres
```

![Captura de pantalla 2025-03-05 172749](https://github.com/user-attachments/assets/0326e678-9d5a-4ce1-b6a0-c4fff70c7a8e)

Estas son las configuraciones de las reglas de entrada que se configuraron para no tener ningun error

![image](https://github.com/user-attachments/assets/6dc4e2e0-ebf7-4549-95ce-1f55a6a00b69)

### Configuración de la instancia EC2 con base de datos MYSQL

Accedemos a la instancia y debemos instalar MSQL, con los siguientes comandos:

```
sudo dnf install -y community-mysql-server
sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022
sudo dnf install -y mysql-community-server
sudo wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
sudo systemctl enable  mysqld
```
Para ver la clave temporal , se utiliza este comando

```
sudo grep 'temporary password' /var/log/mysqld.log

```
Para cambiarla.

```
sudo mysql_secure_installation
```

Una vez dentro, podemos crear la base de datos 


![image](https://github.com/user-attachments/assets/6f0e5cb1-6007-4be7-9aa5-53333d940946)


![Captura de pantalla 2025-03-05 080648](https://github.com/user-attachments/assets/4d925d37-c67a-4c06-85ca-27674e342478)



-- Video






### Construido con

* [Maven](https://maven.apache.org/): Es una herramienta de comprensión y gestión de proyectos de software. Basado en el concepto de modelo de objetos de proyecto (POM), Maven puede gestionar la construcción, los informes y la documentación de un proyecto desde una pieza de información central.

* [Git](https://learn.microsoft.com/es-es/devops/develop/git/what-is-git): Es un sistema de control de versiones distribuido, lo que significa que un clon local del proyecto es un repositorio de control de versiones completo. Estos repositorios locales plenamente funcionales permiten trabajar sin conexión o de forma remota con facilidad.

* [GitHub](https://platzi.com/blog/que-es-github-como-funciona/): Es una plataforma de alojamiento, propiedad de Microsoft, que ofrece a los desarrolladores la posibilidad de crear repositorios de código y guardarlos en la nube de forma segura, usando un sistema de control de versiones llamado Git.

* [Java -17](https://www.cursosaula21.com/que-es-java/): Es un lenguaje de programación y una plataforma informática que nos permite desarrollar aplicaciones de escritorio, servidores, sistemas operativos y aplicaciones para dispositivos móviles, plataformas IoT basadas en la nube, televisores inteligentes, sistemas empresariales, software industrial, etc.

* [JavaScript](https://universidadeuropea.com/blog/que-es-javascript/): Es un lenguaje de programación de scripts que se utiliza fundamentalmente para añadir funcionalidades interactivas y otros contenidos dinámicos a las páginas web.

* [HTML](https://aulacm.com/que-es/html-significado-definicion/): Es un lenguaje de marcado de etiquetas que se utiliza para crear y estructurar contenido en la web. Este lenguaje permite definir la estructura y el contenido de una página web mediante etiquetas y atributos que indican al navegador cómo mostrar la información.

* [CSS](https://www.hostinger.co/tutoriales/que-es-css): Es un lenguaje que se usa para estilizar elementos escritos en un lenguaje de marcado como HTML.

* [Visual Studio Code](https://openwebinars.net/blog/que-es-visual-studio-code-y-que-ventajas-ofrece/): Es un editor de código fuente desarrollado por Microsoft. Es software libre y multiplataforma, está disponible para Windows, GNU/Linux y macOS.

## Autor

* **[Andrés Felipe Rodríguez Chaparro](https://www.linkedin.com/in/andres-felipe-rodriguez-chaparro-816ab527a/)** - [20042000](https://github.com/20042000)

## Licencia
**©** Andrés Felipe Rodríguez Chaparro. Estudiante de Ingeniería de Sistemas de la Escuela Colombiana de Ingeniería Julio Garavito
