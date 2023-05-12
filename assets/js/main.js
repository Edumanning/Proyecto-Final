async function getProducts() {
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
            );

        const res = await data.json()

        window.localStorage.setItem("products", JSON.stringify(res))

        return res;
    } catch (error) {
        console.log(error);
    }
}

function printProducts(db) {
    const productsHTML = document.querySelector(".products");

    let html = "";

    for (const product of db.products) {
        const buttonAdd = product.quantity 
                            ? `<i class='bx bx-plus-circle' id='${product.id}'></i>` 
                            : '<span class="sinStock">Sin Stock</span>'
        html += `
        <div class="product">
            <div class="product__img">
                <img src="${product.image}" alt="imagen" />
            </div>  

            <div class="product__info">
                <p>
                    $${product.price}
                    ${buttonAdd}
                </p>
                <p>
                    <b>Stock: </b> ${product.quantity}
                </p>
                <h4>${product.name}</h4>  
            </div>
            
        </div>
        `;
    }

    productsHTML.innerHTML = html;      
}

function handleShowCart() {
    const iconCartHTML = document.querySelector('.bxs-cart')
    const cartHTML = document.querySelector('.cart')

    iconCartHTML.addEventListener("click", function () {
        cartHTML.classList.toggle("cart__show");
    });
}

function addToCartFromProducts(db) {
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus-circle")) {
            const id = Number(e.target.id)

            const productFind = db.products.find(
                (product) => product.id === id
            );

            if (db.cart[productFind.id]) {
                if (productFind.quantity === db.cart[productFind.id].amount)
                    return alert("En el momento no contamos con mas Stock disponible");

                db.cart[productFind.id].amount++;
            } else { 
                db.cart[productFind.id] = {...productFind, amount: 1}
            }

            window.localStorage.setItem("cart", JSON.stringify(db.cart));
            printProductsInCart(db);
            printTotal(db);
            handlePrintAmountProduct(db)
        }        
    });
}

function printProductsInCart(db) {
    const cartProductstHTML = document.querySelector(".cart__products");

    let html = ''

    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product];

        html += `
            <div class="cart__product">
                <div class="cart__product--img">
                    <img src="${image}" alt="imagen" />
                </div>
                <div class="cart__product--body">
                    <h4>${name} | $${price}</h4>
                    <p>Stock: ${quantity}</p>

                    <div class="cart__product--body-op" id=${id}>
                        <i class='bx bx-minus'></i>
                        <span>${amount} unit</span>
                        <i class='bx bx-plus'></i>
                        <i class='bx bxs-trash'></i>
                    </div>
                </div>
            </div>        
        `;
    }

    cartProductstHTML.innerHTML = html;    
}

function handleProductsInCart(db) {
    const cartProducts = document.querySelector(".cart__products");

    cartProducts.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.parentElement.id);

            const productFind = db.products.find(
                (product) => product.id === id
            );
            if (productFind.quantity === db.cart[productFind.id].amount)
                    return alert("En el momento no contamos con mas Stock disponible");

            db.cart[id].amount++;
        }

        if (e.target.classList.contains("bx-minus")) {
            const id = Number(e.target.parentElement.id);
            if (db.cart[id].amount === 1){
                const response = confirm(
                    "Estas seguro de que quieres eliminar este producto"
                );
                if (!response) return;
                delete db.cart[id]
            }   else{
                db.cart[id].amount--;
            }
        }

        if (e.target.classList.contains("bxs-trash")) {
            const id = Number(e.target.parentElement.id);
            const response = confirm(
                "Estas seguro que quieres eliminar este producto"
            );
            if (!response) return;
            delete db.cart[id];
        }

        window.localStorage.setItem('cart', JSON.stringify(db.cart))
        printProductsInCart(db);
        printTotal(db);
        handlePrintAmountProduct(db);
    });
    
}

function printTotal(db) {
    const infoTotal = document.querySelector(".info__total");            
    const infoAmount = document.querySelector(".info__amount");   

    let totalPoducts = 0
    let amountProducts = 0

    for (const product in db.cart) {
        const {amount, price} = db.cart[product]
        totalPoducts += price * amount;
        amountProducts += amount;
    }

    infoAmount.textContent = amountProducts + " Items";
    infoTotal.textContent = "$" + totalPoducts + ".00";    
}

function handleTotal(db) {
    const btnBuy = document.querySelector(".btn__buy");

    btnBuy.addEventListener("click", function (){

        if (!Object.values(db.cart).length)
            return alert ("No tienes productos en el carrito")
        const response = confirm("Deseas finalizar la compra?");
        if(!response) return;

        const currentProducts = [];

        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if (product.id === productCart?.id) {
                currentProducts.push( {
                    ...product,
                    quantity: product.quantity - productCart.amount,
                });
            } else {
                currentProducts.push(product);
            }
        }

        db.products = currentProducts;
        db.cart = {};

        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlePrintAmountProduct(db)
    })
}

function handlePrintAmountProduct(db) {
    const amountProducts = document.querySelector(".amountProducts")

    let amount = 0;

    for (const product in db.cart) {
        amount += db.cart[product].amount;
    }

    amountProducts.textContent = amount;
}

function handleScrollNavbar() {
    const header = document.querySelector(".header__navbar");
    const homeHTML = document.querySelector(".home")

    function detectScroll() {
        const startPosition = homeHTML.getBoundingClientRect().top + window.scrollY;
        const finalPosition = window.scrollY;
    
        if (finalPosition > startPosition) {
        header.classList.add("header__show");
        } else {
        header.classList.remove("header__show");
        }
    }    
    window.addEventListener("scroll", detectScroll);
}

function darkMode() {
    const iconThemeHTML = document.querySelector(".bx-moon");

    iconThemeHTML.addEventListener('click', function(){
        document.body.classList.toggle("darkmode");
        iconThemeHTML.classList.toggle("bx-sun")

    });
}

function printButtonFilters(db) {

    const filters = document.querySelectorAll(".filter");
    const acceptedFilters = [".shirt", ".hoddie", ".sweater", "all"];

    for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener("click", function () {
        const dataFilter = this.getAttribute("data-filter");
        if (acceptedFilters.includes(dataFilter)) {
            filters.forEach((filter) => filter.classList.remove("filter__active"));
        this.classList.add("filter__active");
        }
    });
    }
/*
    const objProduct = {};
    objProduct.all = db.products.length;

    for (const product of db.products) {
        objProduct[product.category] = objProduct[product.category] + 1 || 1;
    }

    let html = ''

    document.querySelector(".filter__buttons");

    Object.entries(objProduct).forEach(([key, value]) => {
        html += `<button class="btn" data-filter="${key}">${key} <br /> ${value}</button>`;
        
    });

    document.querySelector(".filter__buttons").innerHTML = html; */
}

function handleFilterActivated(db) {
    // Logica para filtrar los productos
    let productContainer = document.querySelector(".content_products");

    let mixer = mixitup(productContainer, {
        selectors: {
        target: ".product",
        control: ".filter",
        },
        animation: {
        effects: "fade scale(0.5)",
        duration: 400,
        easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
        nudge: true,
        reverseOut: true,
        queue: false,
        animateResizeContainer: false,
        },
        classNames: {
        block: "filter",
        elementFilter: "filter__input",
        elementSort: "sort__input",
        },
    });

    document
    .querySelector('.filter[data-filter=".shirt"]')
    .addEventListener("click", function () {
        if (mixer.getState() === "loaded") {
        let filterValue = this.dataset.filter;
        mixer.filter(filterValue);
        }
    });

    document
    .querySelector('.filter[data-filter=".hoddie"]')
    .addEventListener("click", function () {
        if (mixer.getState() === "loaded") {
        let filterValue = this.dataset.filter;
        mixer.filter(filterValue);
        }
    });

    document
    .querySelector('.filter[data-filter=".sweater"]')
    .addEventListener("click", function () {
        if (mixer.getState() === "loaded") {
        let filterValue = this.dataset.filter;
        mixer.filter(filterValue);
        }
    });
}

function handleLoader() {
    document.onreadystatechange = function () {
        const contentLoaderHTML = document.getElementById("content__loader");
        const loaderHTML = document.querySelector(".loader");
        if (document.readyState !== 'complete') {
            contentLoaderHTML.style.display = 'block';
            loaderHTML.style.display = 'block';
        }   else{
            contentLoaderHTML.style.display = 'none';
            loaderHTML.style.display = 'none';
        }
    }
}

async function main() {
    const db = {
        products: 
        JSON.parse(window.localStorage.getItem("products")) ||
        (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {},
    };

    printProducts(db);
    handleShowCart();
    addToCartFromProducts(db);
    printProductsInCart(db);
    handleProductsInCart(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProduct(db);
    handleScrollNavbar();
    darkMode();
    printButtonFilters(db);
    handleFilterActivated(db);
    handleLoader();   
    
}

main();
