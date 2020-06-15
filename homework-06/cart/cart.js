//
// Задача:
//
// 2. Реализовать модуль корзины. 
// Создать блок товаров и блок корзины. 
// У каждого товара есть кнопка «Купить», при нажатии на которую происходит добавление имени и цены товара в блок корзины. 
// Корзина должна уметь считать общую сумму заказа.
//

const catalog = {
  cart: null,
  catalogListBlock: null,
  goods: [
    {
      id_product: 123,
      product_name: 'Ноутбук',
      price: 45600,
    },
    {
      id_product: 456,
      product_name: 'Мышка',
      price: 1000,
    },
    {
      id_product: 305,
      product_name: 'Клавиатура',
      price: 2000,
    },
  ],
  init(cart) {
    this.cart = cart;
	this.cart.init();
	this.cart.render();
  },
  addToCart(good, amount=1) {
    this.cart.addToCart(good, amount);
  },
  render() {
    this.catalogListBlock = document.querySelector('.catalog');

    if (!this.goods.length) {
      this.catalogListBlock.textContent = 'Каталог пуст';
    } else {
	  const goodTitle = document.createElement('div');
	  goodTitle.textContent = 'В каталоге '+this.goods.length+' товаров:';
	  this.catalogListBlock.appendChild(goodTitle);
      this.goods.forEach(good => {
		  const goodContainer = document.createElement('div');
		  const goodDescr = document.createElement('span');
		  goodDescr.textContent = good.product_name +' за '+good.price+' ';
		  const goodButton = document.createElement('button');
		  goodButton.textContent = 'Купить';
		  goodButton.addEventListener('click', () => {this.addToCart(good); this.cart.render();});
		  this.catalogListBlock.appendChild(goodContainer);
		  goodContainer.appendChild(goodDescr);
		  goodContainer.appendChild(goodButton);
	  });
    }
  },
};

const cart = {
  cartListBlock: null,
  cartButton: null,
  cartToggle: null,
  display: null,
  goods: [
    {
      id_product: 123,
      product_name: 'Ноутбук',
      price: 45600,
      quantity: 1,
    },
    {
      id_product: 456,
      product_name: 'Мышка',
      price: 1000,
      quantity: 2,
    },
    {
      id_product: 305,
      product_name: 'Клавиатура',
      price: 2000,
      quantity: 1,
    },
  ],
  init() {
	this.display = 'short';
  },
  render() {
    this.cartListBlock = document.querySelector('.cart-list');
    this.cartButton = document.querySelector('.cart-btn');
    this.cartToggle = document.querySelector('.cart-toggle');

    if (this.goods.length) {
      this.cartListBlock.textContent = `В корзине ${this.goods.length} товаров(а) стоимостью ${this.getCartPrice()}`;
    } else {
      this.cartListBlock.textContent = 'Корзина пуста';
    }
	
	if (this.display === 'long') {
		this.goods.forEach(good => {
			this.cartListBlock.insertAdjacentHTML('beforeend', this.cartItem(good)); // beforebegin, afterbegin, beforeend, afterend
		})
	}

    this.cartToggle.addEventListener('click', () => this.toggleDisplay());
    this.cartButton.addEventListener('click', () => this.dropCart());
  },
  getCartPrice() {
    return this.goods.reduce((price, good) => {
      return price + good.price * good.quantity;
    }, 0);
  },
  toggleDisplay() {
	this.display === 'short' ? this.display = 'long' : this.display = 'short';
	this.render();
  },
  dropCart() {
    this.goods = [];
    this.render();
  },
  addToCart(good, amount=1) {
	let alreadyExists = false;  
	for (let i = 0; i < this.goods.length; i++) {
		if (this.goods[i].id_product === good.id_product) {
			alreadyExists = true;
			this.goods[i].quantity += +amount;
			break;
		} 
	}
	if (!alreadyExists) {
		this.goods.push({...good, ...{quantity: +amount}});
	}
  },
  cartItem(good) {
    return `<div class="cart-item">
                <div class="cart-quantity">${good.quantity}x</div>
                <div class="cart-title">${good.product_name}</div>
                <div class="cart-price">${good.price}</div>
                <div class="cart-summ">=${good.quantity*good.price}</div>
            </div>`;
  },
};

catalog.render();
catalog.init(cart);

