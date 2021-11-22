# VuePress Guia-Deploy-GP
---

- Instalar con yarn

``` js
yarn create vuepress-site NombreProyectoXXX
cd docs //entrar en el directorio
yarn install // instalar dependencias
yarn dev // ejecutar el proyecto
```

- Editar el base URL el archivo config.js y el build dest dentro de .vuepress
en el module.exports
```  js
  dest:'docs', // esto creara una carpeta llamada docs 
  base:'/documentacion-vue/',
```

- Ejecutar el build , deberia quedar en la carpeta que le indicamos en el config
  ,luego subir el repo desde la raiz ignorando el node_modules
```  js
    yarn build
```

