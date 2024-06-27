const gifForm = document.querySelector("#gif-form");
gifForm.addEventListener("submit", fetchGiphs);

function fetchGiphs(e, append = false) {
  if (e) {
    e.preventDefault();
    searchTerm = document.querySelector("#search").value;
  }

  const cacheKey = `gifs_${searchTerm}_${offset}_${limit}`;/*формируем ключ для кэша, используя переменные searchTerm*/
  const cachedData = sessionStorage.getItem(cacheKey);
  const cachedTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`); 

  if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < 1800000) { 
    /*получаем данные из кэша по ключу и проверяем, были ли они сохранены менее 30 минут назад. Если да, то выводим GIF из кэша и завершаем функцию */
    showGiphs(JSON.parse(cachedData), append);
    return;
  }
  

  fetch(`https://api.giphy.com/v1/gifs/search?&q=${searchTerm}&offset=${offset}&limit=${limit}&api_key=92azgiKGFbVijvhpLc20f4zX3ol7RYMI`)
  //если данных в кэше нет или они устарели, то делаем запрос к API Giphy, используя ключ API, значения searchTerm, offset и limit
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
      //получаем ответ в формате JSON и сохраняем его данные в кэш sessionStorage, используя ключ cacheKey и текущее время в миллисекундах
      sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now());
      showGiphs(data.data, append);
    })
    .catch((err) => console.log(err));
}
function showGiphs(gifs) {
  const results = document.querySelector("#results");
//в функции showGiphs получаем элемент с id "results" и создаем переменную output, которая будет содержать HTML-код для отображения GIF
  let output = '<div class="container">';
  gifs.forEach((gif) => {
    output += `
      <img src="${gif.images.fixed_width.url}"/>
      
    `;
    // для каждого GIF из массива gifs формируем HTML-код с тегом img и атрибутом src, содержащим ссылку на изображение GIF
  });
  output += '</div>';
  results.innerHTML = output;
    //функция showGiphs принимает массив объектов с данными о гифках и создает HTML-разметку для каждой гифки, используя свойства объекта images, затем эта разметка добавляется в элемент с results
}
let offset = 0;
const limit = 20;
let searchTerm = "";

window.addEventListener("scroll", () => {
    //добавляем слушатель события scroll на объект window и проверяем, достигли ли мы конца страницы
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    //получаем значения scrolltop, scrollheight и clientheight из объекта document.documentElement
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    //проверяем, достигли ли мы конца страницы
    offset += limit;
    fetchGiphs(null, true);
    //eсли достигли конца страницы, то увеличиваем значение offset на значение limit и вызываем функцию fetchGiphs с параметром append равным true
  }
});

function fetchGiphs(e, append = false) {
    //в функции fetchGiphs мы также добавляем параметр append и проверяем, есть ли данные в кеше
  if (e) {
    e.preventDefault();
    searchTerm = document.querySelector("#search").value;
  }
    //в функции fetchGiphs проверяем, было ли передано событие e и получаем значение searchterm из поля ввода

  const cacheKey = `gifs_${searchTerm}_${offset}_${limit}`;
  const cachedData = sessionStorage.getItem(cacheKey);
    //cоздаем ключ кеша cacheKey и получаем данные из кеша, используя этот ключ
    
  if (cachedData) {
    showGiphs(JSON.parse(cachedData), append);
    return;
  }
    //если данные есть в кеше, передаем их в функцию showGiphs с параметром append
  fetch(`https://api.giphy.com/v1/gifs/search?&q=${searchTerm}&offset=${offset}&limit=${limit}&api_key=92azgiKGFbVijvhpLc20f4zX3ol7RYMI`)
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
      showGiphs(data.data, append);
    })
    .catch((err) => console.log(err));
}
//если нет, делаем запрос к API Giphy и сохраняем полученные данные в кеш
function showGiphs(gifs, append = false) {
  const results = document.querySelector("#results");

  let output = "";
  gifs.forEach((gif) => {
    output += `
      <img src="${gif.images.fixed_width.url}"/>
    `;
  });
/*в функции showGiphs создаем переменную output и заполняем ее HTML-кодом для каждой гифки из полученных данных.
 В зависимости от значения параметра append добавляем новые гифки к уже отображенным или заменяем их*/
  if (append) {
    results.innerHTML += output;
  } else {
    results.innerHTML = output;
  }
}