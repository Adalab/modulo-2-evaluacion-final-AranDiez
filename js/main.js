'use strict';

// A-- OBTENER DATOS CON LOS QUE TENGO QUE TRABAJAR
// B-- PINTAR LOS DATOS EN EL HTML (segun input usuaria)
// C-- MARCAR Y DESMARCAR FAVORITOS
// D-- AGREGAR A LA IZQ
// E-- LOCAL STORAGE

// 1- traigo el ul para poder pintar el coctail
const cocList = document.querySelector('.js_cocList');
// 2- traigo input para escuchar lo que busca
const search = document.querySelector('.js_input');
// 3- hago variable para guardar las bebidas. las guardo con (coctailList = data.drinks) del fetch.
let coctailList = [];

// 4 - MANEJADORA
//hago un listener para que escuche el input y filtre en fetch

function handleInput(event) {
  event.preventDefault();
  const searchedDrink = search.value.toLowerCase();
  fetchCall(searchedDrink);
}

search.addEventListener('keyup', handleInput);

// 5- fetch para obtener datos + funcion de pintar
function fetchCall(searchedDrink) {
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchedDrink}`
  )
    .then((response) => response.json())
    .then((data) => {
      coctailList = data.drinks;
      paintCoctails();
    });
}

// 6 - hago funcion para pintar coctail
function paintCoctails() {
  let html = '';
  for (const drink of coctailList) {
    html += `<li class="js_drink drink" id=${drink.idDrink}>`;
    html += `<h3 class="js_titleDrink">${drink.strDrink}</h3>`;
    html += `<img class="js_imgDrink imgDrink" src="${drink.strDrinkThumb}" alt="coctail" />`;
    html += `</li>`;
  }
  cocList.innerHTML = html;
  //escuchar click favorito
  drinClickListener();
}

// 7 - escuchar cuando el usuario hace click en el cocktail
function drinClickListener() {
  const liCoctail = document.querySelectorAll('.js_drink');
  for (const drink of liCoctail) {
    drink.addEventListener('click', handleClickCoctail);
  }
}

// 8 - hacer array favoritos
let favorites = [];

//estoy escuchando el click y sacando el valor del id (idDrinkSelected = id de cada coctail)
function handleClickCoctail(event) {
  const idDrinkSelected = event.currentTarget.id;
  //me busca un elemento en el listado de todas las bebidas
  const drinkFound = coctailList.find((fav) => {
    return fav.idDrink === idDrinkSelected;
  });
  //ahora miro si esta en el listado de favoritos
  const favoriteIndex = favorites.findIndex((fav) => {
    return fav.idDrink === idDrinkSelected;
  });
  // ahora actua en consecuencia (si es -1 es que no está)
  if (favoriteIndex === -1) {
    favorites.push(drinkFound);
  } else {
    favorites.splice(favoriteIndex, 1);
  }
  console.log(favorites);

  // 9 - Ahora necesito que me cambie las clases
  //   paintPalettes(coctailList);
}
