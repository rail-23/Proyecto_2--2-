class AutoCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .card-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    color: black;
                    padding: 10px;
                    box-sizing: border-box;
                }
                h1 {
                    margin: 0 0 10px;
                    font-size: 1.5em;
                    text-transform: uppercase;
                }
                p {
                    margin: 5px 0;
                    font-size: 0.9em;
                }
                .auto-tiempo {
                    font-weight: bold;
                    color: #333;
                }
            </style>
            <div class="card-container">
                <h1 class="auto-estado">Desocupado</h1>
                <p class="auto-details"></p>
                <p class="auto-tiempo"></p>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.estadoElement = this.shadowRoot.querySelector('.auto-estado');
        this.detailsElement = this.shadowRoot.querySelector('.auto-details');
        this.tiempoElement = this.shadowRoot.querySelector('.auto-tiempo');
    }

    connectedCallback() {
        this.updateCard();
        const container = this.closest('.auto-container');
        this.dataset.index = container.dataset.index;
        this.assignPasilloYSeccion(parseInt(this.dataset.index));
        this.loadFromStorage();
    }

    static get observedAttributes() {
        return ['estado', 'color', 'categoria', 'pasillo', 'seccion', 'marca', 'duracion'];
    }

    attributeChangedCallback() {
        this.updateCard();
        this.saveToStorage();
    }

    updateCard() {
        const estado = this.getAttribute('estado') || 'Desocupado';
        this.estadoElement.textContent = estado;
        this.detailsElement.innerHTML = `
            Color: ${this.getAttribute('color') || '***'}<br>
            Categoría: ${this.getAttribute('categoria') || '***'}<br>
            Pasillo: ${this.getAttribute('pasillo') || '***'}<br>
            Sección: ${this.getAttribute('seccion') || '***'}<br>
            Marca: ${this.getAttribute('marca') || '***'}
        `;

        const duracion = this.getAttribute('duracion') || '***';
        const duracionText = duracion === '***' ? '***' : `${duracion} hora${duracion > 1 ? 's' : ''}`;
        this.tiempoElement.textContent = `Duración: ${duracionText}`;

        if (duracion !== '***') {
            this.startCountdown(parseInt(duracion) * 60 * 60);
        } else {
            clearInterval(this.countdownInterval);
            this.tiempoElement.textContent = 'Duración: ***';
        }

        this.closest('.auto-container').className = `auto-container ${estado.toLowerCase()}`;
    }

    startCountdown(seconds) {
        clearInterval(this.countdownInterval); 
        const endTime = Date.now() + seconds * 1000;
        const updateCountdown = () => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            if (remainingTime > 0) {
                const hours = Math.floor(remainingTime / 3600);
                const minutes = Math.floor((remainingTime % 3600) / 60);
                const secs = remainingTime % 60;
                this.tiempoElement.textContent = `Duración: ${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
            } else {
                clearInterval(this.countdownInterval);
                this.tiempoElement.textContent = 'Tiempo expirado';
                this.setAttribute('estado', 'desocupado');
                this.removeAttribute('duracion');
                this.updateCard();
            }
        };

        updateCountdown(); 
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    saveToStorage() {
        const data = {
            estado: this.getAttribute('estado'),
            color: this.getAttribute('color'),
            categoria: this.getAttribute('categoria'),
            pasillo: this.getAttribute('pasillo'),
            seccion: this.getAttribute('seccion'),
            marca: this.getAttribute('marca'),
            duracion: this.getAttribute('duracion'),
            endTime: this.getAttribute('duracion') ? Date.now() + parseInt(this.getAttribute('duracion')) * 60 * 60 * 1000 : null
        };
        localStorage.setItem(`autoCard_${this.dataset.index}`, JSON.stringify(data));
    }

    loadFromStorage() {
        const data = JSON.parse(localStorage.getItem(`autoCard_${this.dataset.index}`));
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                if (key !== 'endTime') {
                    this.setAttribute(key, value || '');
                }
            }
            if (data.endTime) {
                const remainingTime = Math.max(0, Math.floor((data.endTime - Date.now()) / 1000));
                if (remainingTime > 0) {
                    this.startCountdown(remainingTime);
                } else {
                    this.setAttribute('estado', 'desocupado');
                    this.removeAttribute('duracion');
                    this.updateCard();
                }
            }
        }
    }

    assignPasilloYSeccion(index) {
        const pasillos = ['A', 'B', 'C'];
        const secciones = [1, 2, 3, 4, 5, 6];

        const pasilloIndex = Math.floor((index - 1) / secciones.length);
        const seccionIndex = (index - 1) % secciones.length;

        const pasillo = pasillos[pasilloIndex];
        const seccion = secciones[seccionIndex];

        this.setAttribute('pasillo', pasillo);
        this.setAttribute('seccion', seccion.toString());
    }
}

customElements.define('auto-card', AutoCard);

document.addEventListener('DOMContentLoaded', () => {
    const autoContainers = document.querySelectorAll('.auto-container');
    const autoForm = document.getElementById('autoForm');
    const updateButton = document.getElementById('updateButton');
    const cancelButton = document.getElementById('cancelButton');

    let currentAutoCard = null;

    function updateFormFromCard(autoCard) {
        const estado = autoCard.getAttribute('estado') || 'desocupado';
        const color = autoCard.getAttribute('color') || '';
        const categoria = autoCard.getAttribute('categoria') || 'auto';
        const pasillo = autoCard.getAttribute('pasillo') || '';
        const seccion = autoCard.getAttribute('seccion') || '';
        const marca = autoCard.getAttribute('marca') || '';
        const duracion = autoCard.getAttribute('duracion') || '1';

        document.getElementById('estado').value = estado;
        document.getElementById('color').value = color;
        document.getElementById('categoria').value = categoria;
        document.getElementById('pasillo').value = pasillo;
        document.getElementById('seccion').value = seccion;
        document.getElementById('marca').value = marca;
        document.getElementById('duracion').value = duracion;

        currentAutoCard = autoCard;
    }

    autoContainers.forEach(container => {
        const autoCard = container.querySelector('auto-card');
        container.addEventListener('click', () => {
            updateFormFromCard(autoCard);
        });
    });

    updateButton.addEventListener('click', () => {
        if (currentAutoCard) {
            const estado = document.getElementById('estado').value;
            const color = document.getElementById('color').value;
            const categoria = document.getElementById('categoria').value;
            const pasillo = document.getElementById('pasillo').value;
            const seccion = document.getElementById('seccion').value;
            const marca = document.getElementById('marca').value;
            const duracion = document.getElementById('duracion').value;

            currentAutoCard.setAttribute('estado', estado);
            currentAutoCard.setAttribute('color', color);
            currentAutoCard.setAttribute('categoria', categoria);
            currentAutoCard.setAttribute('pasillo', pasillo);
            currentAutoCard.setAttribute('seccion', seccion);
            currentAutoCard.setAttribute('marca', marca);
            currentAutoCard.setAttribute('duracion', duracion);
            currentAutoCard.saveToStorage();
        }
    });

    cancelButton.addEventListener('click', () => {
        if (currentAutoCard) {
            updateFormFromCard(currentAutoCard);
        }  
    });
    document.addEventListener('DOMContentLoaded', () => {
        const autos = JSON.parse(localStorage.getItem('autos')) || [];
        autos.forEach(auto => {
          const autoContainer = document.querySelector(`.auto-container[data-index="${auto.index}"]`);
          if (autoContainer) {
            autoContainer.classList.add(auto.estado);
          }
        });
      });
      
    
});
