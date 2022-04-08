'use strict';

// A-- OBTENER DATOS CON LOS QUE TENGO QUE TRABAJAR
// B-- PINTAR LOS DATOS EN EL HTML (segun input usuaria)

// 1- traigo el ul para poder pintar el coctail
const cocList = document.querySelector('.js_cocList');
// 2- traigo input para escuchar lo que busca
const search = document.querySelector('.js_input');
// 3- hago variable para guardar las bebidas. las guardo con (coctailList = data.drinks) del fetch.
let coctailList = [];
// 6- esta variable deberia guardar el input para ponerlo en la url de fetch

// 6 - hago funcion para pintar coctail
function paintCoctails() {
  let html = '';
  for (const drink of coctailList) {
    html += `<li class="js_drink drink" id=${drink.id}>`;
    html += `<h3 class="js_titleDrink">${drink.strDrink}</h3>`;
    html += `<img class="js_imgDrink imgDrink" src="${drink.strDrinkThumb}" alt="coctail" />`;
    html += `</li>`;
  }
  cocList.innerHTML = html;
}

// 5 - hago un listener para que escuche el input

function handleInput(event) {
  event.preventDefault();
  const searchedDrink = search.value.toLowerCase();
  console.log(searchedDrink);
  // 4- fetch para obtener datos + funcion de pintar
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchedDrink}`
  )
    .then((response) => response.json())
    .then((data) => {
      coctailList = data.drinks;
      paintCoctails();
    });
}
search.addEventListener('keyup', handleInput);
