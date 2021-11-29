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

- Modificar el CSS en el index.styl
```  css
  html, body
  padding 0
  margin 0
  background-color #82A6B1

.home .hero img
  max-width 450px!important
  border-radius 100px!important


.navbar
  position fixed
  z-index 20
  top 0
  left 0
  right 0
  height $navbarHeight
  background-color #82A6B1
  box-sizing border-box
  border-bottom 1px solid $borderColor

.links
  background-color #82A6B1!important

.sidebar
  background-color #82A6B1!important

tr
  background-color #82A6B1!important
```

