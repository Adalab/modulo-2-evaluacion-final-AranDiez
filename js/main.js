'use strict';

// A-- OBTENER DATOS CON LOS QUE TENGO QUE TRABAJAR
// B-- PINTAR LOS DATOS EN EL HTML (segun input usuaria)
// C-- MARCAR Y DESMARCAR FAVORITOS
// D-- AGREGAR A LA IZQ
// E-- LOCAL STORAGE

// 0- obtengo lo que hay en el local storage
const listDrinksStorage = JSON.parse(localStorage.getItem('listDrinksStorage'));

// 1- traigo el ul para poder pintar el coctail
const cocList = document.querySelector('.js_cocList');
const favList = document.querySelector('.js_favList');
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
//local storage

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
    let classFav = '';
    //antes de pintar miro si es favorita o no
    const favoriteIndex = favourites.findIndex((fav) => {
      return fav.idDrink === drink.idDrink;
    });
    if (favoriteIndex !== -1) {
      classFav = 'fav';
    } else {
      classFav = '';
    }
    html += `<li class="js_drink drink ${classFav}" id=${drink.idDrink}>`;
    html += `<h3 class="js_titleDrink titleDrink">${drink.strDrink}</h3>`;
    html += `<img class="js_imgDrink imgDrink" src="${drink.strDrinkThumb}" alt="coctail" />`;
    html += `</li>`;
  }
  cocList.innerHTML = html;
  //escuchar click favorito
  drinClickListener();
  paintFavs();
}

// 7 - escuchar cuando el usuario hace click en el cocktail
function drinClickListener() {
  const liCoctail = document.querySelectorAll('.js_drink');
  for (const drink of liCoctail) {
    drink.addEventListener('click', handleClickCoctail);
  }
}

// 8 - hacer array favoritos
let favourites = [];

//estoy escuchando el click y sacando el valor del id (idDrinkSelected = id de cada coctail)
function handleClickCoctail(event) {
  const idDrinkSelected = event.currentTarget.id;
  //me busca un elemento en el listado de todas las bebidas
  const drinkFound = coctailList.find((fav) => {
    return fav.idDrink === idDrinkSelected;
  });
  //ahora miro si esta en el listado de favoritos
  const favoriteIndex = favourites.findIndex((fav) => {
    return fav.idDrink === idDrinkSelected;
  });
  // ahora actua en consecuencia (si es -1 es que no está)
  if (favoriteIndex === -1) {
    favourites.push(drinkFound);
  } else {
    favourites.splice(favoriteIndex, 1);
  }
  console.log(favourites);

  // 9 - Ahora necesito que me cambie las clases
  // cuando paint pinta pregunta ¿eres un favorito? y ya añade la clase o no
  paintCoctails();
}

// 10 - funcion que pinta en favoritos segun el array
function paintFavs() {
  let html = '';
  for (const drink of favourites) {
    let classFav = '';
    //antes de pintar miro si es favorita o no
    const favoriteIndex = favourites.findIndex((fav) => {
      return fav.idDrink === drink.idDrink;
    });
    if (favoriteIndex !== -1) {
      classFav = 'fav';
    } else {
      classFav = '';
    }
    html += `<li class="js_favDrink drink ${classFav}" id=${drink.idDrink}>`;
    html += `<h3 class="js_titleFavDrink titleFavDrink">${drink.strDrink}</h3>`;
    html += `<img class="js_imgFavDrink imgDrink" src="${drink.strDrinkThumb}" alt="coctail" />`;
    html += `</li>`;
  }
  favList.innerHTML = html;
}
