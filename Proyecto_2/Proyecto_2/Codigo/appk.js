class ProductCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

      
        const estado = this.getAttribute('estado');
        const image = this.getAttribute('image');
        const tiempo = this.getAttribute('tiempo');
        const color = this.getAttribute('color');
        const categoria = this.getAttribute('categoria');
        const pasillo = this.getAttribute('pasillo');
        const seccion = this.getAttribute('seccion');
        const marca = this.getAttribute('marca');

      
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .product-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 300px;
                    padding: 8px;
                    border-radius: 10px;
                    margin: 50px;
                    border: 2px solid rgb(102, 33, 33);
                    background: transparent;
                    backdrop-filter: blur(8px);
                    cursor: pointer;
                }

                .product-card img {
                    border-radius: 5px;
                    margin-bottom: 10px;
                    filter: drop-shadow(10px 1px 15px #f8ed24);
                    object-fit: cover;
                    width: 225px;
                    height: 125px;
                }

                .product-estado,
                .product-title,
                .product-color,
                .product-categoria,
                .product-pasillo,
                .product-seccion {
                    font-size: 1.6em;
                    color: black;
                    margin-bottom: 5px;
                }

                .product-estado {
                    font-size: 2.5em;
                }

                .product-tiempo {
                    font-size: 0.9em;
                    color: #121212;
                    margin-bottom: 5px;
                }

                .product-card:hover img {
                    transform: scale(1.5);
                }
            </style>
            <div class="product-card">
                <img class="product-img" src="${image}">
                <h1 class="product-estado">${estado}</h1>
                <h1 class="product-title">${marca}</h1>
                <h1 class="product-color">${color}</h1>
                <p class="product-tiempo">${tiempo}</p>
                <p class="product-categoria">${categoria}</p>
                <h1 class="product-pasillo">${pasillo}</h1>
                <h1 class="product-seccion">${seccion}</h1>
            </div>
        `;

      
        const handleClick = () => {
            if (estado.toLowerCase() === 'libre') {
           
                window.location.href = '../form/formulario.html';
            }
        };

     
        shadow.appendChild(template.content.cloneNode(true));

        const productCard = shadow.querySelector('.product-card');

        productCard.addEventListener('click', handleClick);
    }
}

customElements.define('product-card', ProductCard);
