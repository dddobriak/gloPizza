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

const valid = (str) => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

function toggleModal() {
  modal.classList.toggle("is-open");
}

let login = localStorage.getItem('gloDelivery');

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
};

const authorized = () => {
  const logOut = () => {
    login = null;
    checkAuth();
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('gloDelivery');
  };

  console.log('Авторизован');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
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

function checkAuth() {
  if (!!login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();

const createCardsRestaurant = () => {
  const card = `
  <a class="card card-restaurant">
    <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Пицца плюс</h3>
        <span class="card-tag tag">50 мин</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 900 ₽</div>
        <div class="category">Пицца</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
  </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
};

createCardsRestaurant();

const createCardGood = () => {
  let card = `
    <div class="card">
      <img src="img/pizza-plus/pizza-girls.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">Пицца Девичник</h3>
        </div>
        <!-- /.card-heading -->
        <div class="card-info">
          <div class="ingredients">Соус томатный, постное тесто, нежирный сыр, кукуруза, лук, маслины,
            грибы, помидоры, болгарский перец.
          </div>
        </div>
        <!-- /.card-info -->
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">450 ₽</strong>
        </div>
      </div>
      <!-- /.card-text -->
    </div>
    <!-- /.card -->
  `;

  cardsMenu.insertAdjacentHTML('beforeend', card);
};

const openGoods = (event) => {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');
  if (restaurant) {
    if (!!login) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      createCardGood();
    } else {
      toggleModalAuth();
    }
  }
};

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});

new Swiper('.swiper-container', {
  loop: true,
  autoplay: true
});