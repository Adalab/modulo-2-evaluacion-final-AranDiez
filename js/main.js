'use strict';

// A-- OBTENER DATOS CON LOS QUE TENGO QUE TRABAJAR
// B-- PINTAR LOS DATOS EN EL HTML (segun input usuaria)
// C-- MARCAR Y DESMARCAR FAVORITOS
// D-- AGREGAR A LA IZQ
// E-- LOCAL STORAGE
// F-- BOTON RESET
// G-- BOTON QUITAR FAVORITOS
// H-- DARLE UN ESTILO MINIMO CON CSS

// 1- traigo el ul para poder pintar el coctail
const cocList = document.querySelector('.js_cocList');
const favList = document.querySelector('.js_favList');
// 2- traigo input para escuchar lo que busca y oto para buscarlo
let search = document.querySelector('.js_input');
const button = document.querySelector('.js_searchButton');
// 3- hago variable para guardar las bebidas. las guardo con (coctailList = data.drinks) del fetch.
let coctailList = [];
// 11- traigo el boton de reset para que lo pueda escuchar
const reset = document.querySelector('.js_resetButton');
// 8 - hacer array favoritos
let favourites = [];

// 4 - MANEJADORA
//hago un listener para que escuche el input y filtre en fetch

function handleInput(event) {
  event.preventDefault();
  const searchedDrink = search.value.toLowerCase();
  fetchCall(searchedDrink);
}

button.addEventListener('click', handleInput);

// 5- fetch para obtener datos + funcion de pintar

function fetchCall(searchedDrink) {
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchedDrink}`
  )
    .then((response) => response.json())
    .then((data) => {
      coctailList = data.drinks;
      imgEmpty();
      paintCoctails();
    });
}
function imgEmpty() {
  for (const drink of coctailList) {
    if (drink.strDrinkThumb === '') {
      drink.strDrinkThumb =
        'https://via.placeholder.com/210x295/ffffff/666666/?text=Missing_image';
    }
  }
}

/// 0- local storage
// leo lo que hay en local storage
const readFromLocalStorage = () => {
  const drinksLocalStorage = localStorage.getItem('favourite');
  if (drinksLocalStorage !== null) {
    favourites = JSON.parse(drinksLocalStorage);
    paintFavs();
  }
};
readFromLocalStorage();

// guardo en el local storage
const writeInLocalStorage = () => {
  const stringifyFav = JSON.stringify(favourites);
  localStorage.setItem('favourite', stringifyFav);
};

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
  // drinClickButton();
}

// 7 - escuchar cuando el usuario hace click en el cocktail
function drinClickListener() {
  const liCoctail = document.querySelectorAll('.js_drink');
  for (const drink of liCoctail) {
    drink.addEventListener('click', handleClickCoctail);
  }
}

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
  writeInLocalStorage();
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
    html += `<button type="button" class="js_eraseButton eraseButton" data-id=${drink.idDrink}>X</button>`;
    html += `</li>`;
  }
  favList.innerHTML = html;
  drinkClickButton();
}

// 12 -- escueho el boton de reset
// al escuchar el boton de reset hago que favourites se vacie y llamo de nuevo a paintcoctails para que los quite de la lista
function handleReset(event) {
  event.preventDefault();
  favourites.splice(0, favourites.length);
  search.value = '';
  coctailList = [];
  paintCoctails();
  writeInLocalStorage();
}

reset.addEventListener('click', handleReset);

// 13 ------------- BONUS DE X EN FAVORITOS
function handleXButton(event) {
  const idDrinkSelected = event.currentTarget.dataset.id;
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

  // 9 - Ahora necesito que me cambie las clases
  // cuando paint pinta pregunta ¿eres un favorito? y ya añade la clase o no
  paintCoctails();
}

//------------escuchar click en x
function drinkClickButton() {
  const eraseButton = document.querySelectorAll('.js_eraseButton');
  for (const drink of eraseButton) {
    drink.addEventListener('click', handleXButton);
  }
}
