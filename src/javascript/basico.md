# Conceptos Basicos
---

- Template String
```javascript
const nombre = 'Sebastian';
let apellido = 'sepulveda';
let a = 15;
let b = 10;

console.log(`${nombre} ${apellido}`); // Sebastian Sepulveda
console.log(`Suma de a y b es  : ${a+b}`); // 25
```


- Funciones de Flecha
```javascript
const FuncionFlecha = () => 'Hola Mundo !';
FuncionFlecha();//'Hola Mundo !'

const FuncionFlechaArg = (a,b) => {
  return `El resultado de la suma de a y b es : ${a+b}`;
}
FuncionFlechaArg(3,4);//'El resultado de la suma de a y b es : 7'
```

- DESTRUCTURING en arreglos
-- Se definen en CORCHETES cuando se usa el destructuring en arrays
```javascript
const arreglo = [1,3,6,7];
const [num1,num2,...restoDeNumeros] = arreglo; 
console.log(num1);//1
console.log(num2);//3
console.log(restoDeNumeros);//[6,7]
```

- DESTRUCTURING en Objetos
-- Se definen en LLAVES cuando se usa el destructuring en objetos
-- Extrae propiedades de una clase u objeto y se puede usar el spread operator
```javascript
const arreglo = [1,3,6,7];
const [num1,num2,...restoDeNumeros] = arreglo; 
console.log(num1);//1
console.log(num2);//3
console.log(restoDeNumeros);//[6,7]
```

- Funciones con parametros por Defecto
-- En el caso que no se pasen los argumentos definidos, esta no se cae

```javascript
function sumar(a = 0,b=0){
  return a+b;
}
sumar(3);//3
```