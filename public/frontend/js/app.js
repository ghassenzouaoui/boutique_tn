class SportShopApp {
    constructor() {
        this.products = [];
        this.currentCategory = null;
        this.init();
    }

    async init() {
        // Charger tous les produits
        this.products = await ApiService.getProducts();
        
        // Vérifier si une catégorie est spécifiée dans l'URL
        this.checkUrlCategory();
        
        // Initialiser les sections
        this.initializeSections();
        
        // Configurer les événements
        this.setupEventListeners();
        
        // Initialiser les animations
        this.setupAnimations();
    }

    checkUrlCategory() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            this.currentCategory = category;
            this.filterProductsByCategory(category);
        }
    }

    filterProductsByCategory(category) {
        // Cacher les sections inutiles
        this.hideUnnecessarySections();
        
        // Afficher les produits filtrés
        this.displayFilteredProducts(category);
        
        // Mettre à jour le titre de la page
        this.updatePageTitle(category);
    }

    hideUnnecessarySections() {
        // Cacher les sections qui ne sont pas nécessaires sur la page de catégorie
        const sectionsToHide = [
            '.hero-section',
            '.categories-section',
            '.features-bar',
            '.promo-banner-large',
            '.newsletter'
        ];
        
        sectionsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    displayFilteredProducts(category) {
        const container = document.getElementById('new-products');
        if (!container) return;

        container.innerHTML = this.createLoadingSpinner();

        setTimeout(() => {
            let filteredProducts = [];
            
            if (category === 'homme') {
                // Tous les produits homme
                filteredProducts = this.products.filter(product => 
                    product.category.includes('homme')
                );
            } else if (category === 'femme') {
                // Tous les produits femme
                filteredProducts = this.products.filter(product => 
                    product.category.includes('femme')
                );
            } else {
                // Catégorie spécifique (homme_tshirt, femme_legging, etc.)
                filteredProducts = this.products.filter(product => 
                    product.category === category
                );
            }

            if (filteredProducts.length === 0) {
                container.innerHTML = this.createNoProductsMessage(category);
            } else {
                container.innerHTML = filteredProducts.map(product => 
                    this.createModernProductCard(product)
                ).join('');
            }
        }, 1000);
    }

    updatePageTitle(category) {
        const titleMap = {
            'homme': 'Collection Homme',
            'femme': 'Collection Femme',
            'homme_tshirt': 'T-Shirts Homme',
            'homme_short': 'Shorts Homme',
            'homme_survetement': 'Survêtements Homme',
            'homme_veste': 'Vestes Homme',
            'femme_tshirt': 'T-Shirts Femme',
            'femme_legging': 'Leggings Femme',
            'femme_short': 'Shorts Femme',
            'femme_ensemble': 'Ensembles Femme',
            'nouveaute': 'Nouveautés',
            'promo': 'Promotions'
        };

        // Mettre à jour le titre de la section
        const sectionTitle = document.querySelector('#nouveautes .section-title');
        if (sectionTitle && titleMap[category]) {
            sectionTitle.textContent = titleMap[category].toUpperCase();
        }

        // Mettre à jour la description
        const sectionDesc = document.querySelector('#nouveautes .text-muted');
        if (sectionDesc) {
            sectionDesc.textContent = `Découvrez notre ${titleMap[category].toLowerCase()}`;
        }
    }

    createNoProductsMessage(category) {
        const categoryNames = {
            'homme': 'hommes',
            'femme': 'femmes',
            'homme_tshirt': 't-shirts homme',
            'homme_short': 'shorts homme',
            'homme_survetement': 'survêtements homme',
            'homme_veste': 'vestes homme',
            'femme_tshirt': 't-shirts femme',
            'femme_legging': 'leggings femme',
            'femme_short': 'shorts femme',
            'femme_ensemble': 'ensembles femme',
            'nouveaute': 'nouveautés',
            'promo': 'promotions'
        };

        return `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="fw-bold mb-3">Aucun produit trouvé</h4>
                <p class="text-muted mb-4">
                    Aucun produit n'est disponible dans la catégorie ${categoryNames[category] || category}.
                </p>
                <a href="products.html" class="btn btn-primary">Voir tous les produits</a>
            </div>
        `;
    }

    initializeSections() {
        // Vérifier si nous sommes sur une page de catégorie
        if (this.currentCategory) {
            this.filterProductsByCategory(this.currentCategory);
        } else {
            // Charger normalement les nouveautés et produits populaires
            if (document.getElementById('new-products')) {
                this.loadNewProducts();
            }
            
            if (document.getElementById('popular-products')) {
                this.loadPopularProducts();
            }
        }
    }

    // Charger les nouveautés (version normale)
    loadNewProducts() {
        const container = document.getElementById('new-products');
        if (!container) return;

        container.innerHTML = this.createLoadingSpinner();

        setTimeout(() => {
            const newProducts = this.getNewProducts();
            container.innerHTML = newProducts.map(product => this.createModernProductCard(product)).join('');
        }, 1000);
    }

    // Charger les produits populaires (version normale)
    loadPopularProducts() {
        const container = document.getElementById('popular-products');
        if (!container) return;

        container.innerHTML = this.createLoadingSpinner();

        setTimeout(() => {
            const popularProducts = this.getPopularProducts();
            container.innerHTML = popularProducts.map(product => this.createModernProductCard(product, true)).join('');
        }, 1500);
    }

    // Obtenir les nouveautés
    getNewProducts() {
        return this.products
            .filter(product => product.featured || product.category.includes('nouveaute'))
            .slice(0, 8)
            .map(product => ({
                ...product,
                isNew: true,
                discount: Math.random() > 0.7 ? 20 : 0
            }));
    }

    // Obtenir les produits populaires
    getPopularProducts() {
        return this.products
            .filter(product => product.popular || Math.random() > 0.5)
            .slice(0, 8)
            .map(product => ({
                ...product,
                isPopular: true,
                discount: Math.random() > 0.6 ? 15 : 0
            }));
    }

    // Créer une carte produit moderne
    createModernProductCard(product, showPopular = false) {
        const hasDiscount = product.discount > 0;
        const discountPrice = hasDiscount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price;

        return `
            <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                <div class="product-card h-100">
                    <div class="position-relative overflow-hidden">
                        <img src="${product.image_url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" 
                             class="product-image" 
                             alt="${product.name}"
                             onerror="this.src='https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                        
                        <div class="product-badge">
                            ${product.isNew ? '<span class="badge-new">NOUVEAU</span>' : ''}
                            ${hasDiscount ? '<span class="badge-sale">SOLDES</span>' : ''}
                            ${showPopular && !product.isNew && !hasDiscount ? '<span class="badge-new">POPULAIRE</span>' : ''}
                        </div>
                        
                        <div class="position-absolute top-0 end-0 p-3">
                            <button class="btn btn-light btn-sm rounded-circle">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="product-card-body">
                        <div class="product-category">${this.formatCategory(product.category)}</div>
                        <h5 class="product-title">${product.name}</h5>
                        
                        <div class="product-price">
                            ${hasDiscount ? `
                                <span class="current-price">${discountPrice} DT</span>
                                <span class="original-price">${product.price} DT</span>
                                <span class="discount-percent">-${product.discount}%</span>
                            ` : `
                                <span class="current-price">${product.price} DT</span>
                            `}
                        </div>
                        
                        <button class="btn btn-primary w-100 snipcart-add-item"
                            data-item-id="${product.id}"
                            data-item-name="${product.name}"
                            data-item-price="${discountPrice}"
                            data-item-url="/api/products/${product.id}"
                            data-item-image="${product.image_url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}"
                            data-item-description="${product.description || ''}">
                            <i class="fas fa-shopping-bag me-2"></i>AJOUTER AU PANIER
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Formater la catégorie
    formatCategory(category) {
        const categories = {
            'homme_tshirt': 'T-SHIRT HOMME',
            'femme_tshirt': 'T-SHIRT FEMME',
            'homme_short': 'SHORT HOMME',
            'femme_legging': 'LEGGING FEMME',
            'homme_survetement': 'SURVÊTEMENT HOMME',
            'femme_ensemble': 'ENSEMBLE FEMME',
            'homme_veste': 'VESTE HOMME',
            'nouveaute': 'NOUVEAUTÉ',
            'promo': 'PROMOTION'
        };
        return categories[category] || category.toUpperCase();
    }

    // Créer un spinner de chargement
    createLoadingSpinner() {
        return `
            <div class="col-12 text-center">
                <div class="loading"></div>
                <p class="text-muted mt-3">Chargement des produits...</p>
            </div>
        `;
    }

    // Configurer les animations
    setupAnimations() {
        // Animation au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        }, observerOptions);

        // Observer les sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    // Configurer les événements
    setupEventListeners() {
        // Recherche
        const searchBtn = document.querySelector('.fa-search').closest('a');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSearch();
            });
        }

        // Favoris
        const wishlistBtn = document.querySelector('.fa-heart').closest('a');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleWishlist();
            });
        }

        // Newsletter
        const newsletterBtn = document.querySelector('.newsletter .btn');
        if (newsletterBtn) {
            newsletterBtn.addEventListener('click', () => {
                this.subscribeNewsletter();
            });
        }
    }

    toggleSearch() {
        alert('Fonctionnalité recherche à implémenter');
    }

    toggleWishlist() {
        alert('Fonctionnalité favoris à implémenter');
    }

    subscribeNewsletter() {
        const emailInput = document.querySelector('.newsletter input[type="email"]');
        const email = emailInput.value;
        
        if (email && this.validateEmail(email)) {
            alert('Merci pour votre inscription à la newsletter !');
            emailInput.value = '';
        } else {
            alert('Veuillez entrer une adresse email valide.');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    new SportShopApp();
});