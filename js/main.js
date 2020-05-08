const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

const valid = (str) => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

function toggleModal() {
  modal.classList.toggle("is-open");
}

let login = localStorage.getItem('gloDelivery');

const cart = [];

const loadCart = () => {
  if (localStorage.getItem('gloDeliveryCart' + login)) {
    cart.push(...JSON.parse(localStorage.getItem('gloDeliveryCart' + login)));
  }
};

const saveCart = () => {
  localStorage.setItem('gloDeliveryCart' + login, JSON.stringify(cart));
};

const getDAta = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`\nОшибка по адресу: ${url}\nCтатус ошибки: ${response.status}`);
  }

  return await response.json();
};

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
};

const authorized = () => {
  const logOut = () => {
    login = null;
    cart.length = 0;
    checkAuth();
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('gloDelivery');
  };

  console.log('Авторизован');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
};

const notAuthorized = () => {
  const logIn = (event) => {
    event.preventDefault();
    login = loginInput.value;

    if (valid(login)) {
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      checkAuth();
      loadCart();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      loginForm.removeEventListener('submit', logIn);
      loginForm.reset();
      loginInput.style.border = '';
    } else {
      loginInput.style.border = '2px inset red';
    }
  };

  console.log('Не авторизован');
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener('submit', logIn);
};

const checkAuth = () => !!login ? authorized() : notAuthorized();

checkAuth();

const createCardsRestaurant = (restaurant) => {
  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery
  } = restaurant;

  const card = document.createElement('a');
  card.className = 'card card-restaurant';
  card.products = products;
  card.info = [name, price, stars, kitchen];

  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
  `);
  cardsRestaurants.insertAdjacentElement('beforeend', card);
};

const createCardGood = (goods) => {
  const {
    description,
    id,
    image,
    name,
    price
  } = goods;

  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;
  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <!-- /.card-heading -->
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <!-- /.card-info -->
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price} ₽</strong>
        </div>
      </div>
      <!-- /.card-text -->
    <!-- /.card -->
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
};

const openGoods = (event) => {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');
  if (restaurant) {
    if (!!login) {
      const [name, price, stars, kitchen] = restaurant.info;
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} руб`;
      category.textContent = kitchen;

      getDAta(`./db/${restaurant.products}`).then((data) => {
        data.forEach(createCardGood);
      });
    } else {
      toggleModalAuth();
    }
  }
};

const addToCart = (event) => {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = card.id;

    const food = cart.find((item) => item.id === id);

    if (food) {
      food.count++;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }
  saveCart();
};

const renderCart = () => {
  modalBody.textContent = '';
  cart.forEach(({
    id,
    title,
    cost,
    count
  }) => {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id="${id}">-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id="${id}">+</button>
      </div>
    </div>
    `;
    modalBody.insertAdjacentHTML('beforeend', itemCart);
  });

  const totalPrice = cart.reduce((result, item) => {
    return result + (parseInt(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice;
  saveCart();
};

const changeCount = (event) => {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find((item) => item.id === target.dataset.id);
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) food.count++;
    renderCart();
  }
};

const init = () => {
  getDAta('./db/partners.json').then((data) => {
    data.forEach(createCardsRestaurant);
  });

  inputSearch.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      const target = event.target;

      const value = target.value.toLowerCase().trim();

      const goods = [];

      getDAta('./db/partners.json').then((data) => {
        const products = data.map((item) => item.products);

        products.forEach((item) => {
          getDAta(`./db/${item}`).then((data) => {
            goods.push(...data);

            const searchGoods = goods.filter((item) => item.name.toLowerCase().includes(value));

            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            restaurantTitle.textContent = 'Результат поиска';
            rating.textContent = '';
            minPrice.textContent = '';
            category.textContent = '';

            return searchGoods;
          }).then((data) => {
            data.forEach(createCardGood);
          });
        });
      });
    }
  });

  cartButton.addEventListener("click", () => {
    toggleModal();
    renderCart();
  });
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  cardsMenu.addEventListener('click', addToCart);
  modalBody.addEventListener('click', changeCount);
  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  });

  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true
  });
};

init();