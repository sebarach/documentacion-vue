# Guia GIT basico !🔔
---

- Iniciar git
```js
git init
```

- Clonar,listar y cambiarse de branch
```js
git clone url
git clone branchNombre url
git branch -a // lista todas las ramas localess y remotas
git checkout nombreBranch
```

- Commit
```js
git status
git add .
git commit -m 'Mensaje del commit'
```

- conectar a branch remotos
```js
git remote -v // lista los repositorios remotos
git remote add branch url// se conecta a un repo
git remote rm nombrDeLaRama // elimina una rama
```

- agregar archivos y commit
```js
git add . // agrega todos los cambios
git add nombreArchivo // agrega un archivo o carpeta especifica
git commit -m 'Mensaje'// crea un commit
git commit --amend  // Se agrega al ultimo commit
```

- Sube cambios a la url remota
```js
git push ramaRemota // sube los cambios al remoto
git push ramaRemota --force // ignora los conflictos
```

