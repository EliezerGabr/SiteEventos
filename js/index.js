document.addEventListener("DOMContentLoaded", function () {
    
    const container = document.getElementById("lista-eventos");
    let cards = Array.from(document.querySelectorAll(".coluna-evento"));
    const selectOrdenar = document.getElementById("ordenar-eventos");
    const campoPesquisa = document.getElementById("campo-pesquisa");
    const salvar = "eventosFavoritos";
    
    cards.forEach(card => {
        card.style.display = "block";
        card.classList.remove('hidden-by-search');
    });
    
    const perPage = 4;
    let currentPage = 1;
    
    function getTotalPages() {
        const visibleCards = cards.filter(card => {
            return !card.classList.contains('hidden-by-search');
        });
        return Math.ceil(visibleCards.length / perPage);
    }

    const paginationContainer = document.createElement("div");
    paginationContainer.className = "d-flex justify-content-center align-items-center mt-4 mb-4";
    paginationContainer.id = "pagination-controls";
    
    const prevBtn = document.createElement("button");
    prevBtn.className = "btn btn-secondary me-2";
    prevBtn.textContent = "Anterior";
    
    const pageInfo = document.createElement("span");
    pageInfo.className = "mx-3 fw-bold";
    pageInfo.id = "page-info";
    
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-secondary ms-2";
    nextBtn.textContent = "Próxima";
    
    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextBtn);
    
    container.parentNode.insertBefore(paginationContainer, container.nextSibling);

    function showPage(page) {
        const visibleCards = cards.filter(card => {
            return !card.classList.contains('hidden-by-search');
        });
        
        const totalPages = Math.ceil(visibleCards.length / perPage);
        
        if (page > totalPages && totalPages > 0) {
            page = totalPages;
            currentPage = totalPages;
        }
        
        const start = (page - 1) * perPage;
        const end = start + perPage;

        cards.forEach(card => {
            card.style.display = "none";
        });

        visibleCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = "block";
            }
        });

        if (totalPages > 0) {
            pageInfo.textContent = `Página ${page} de ${totalPages}`;
        } else {
            pageInfo.textContent = "Nenhum evento encontrado";
        }
        
        prevBtn.disabled = page === 1 || totalPages === 0;
        nextBtn.disabled = page === totalPages || totalPages === 0;
    }

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    const itensTempo = document.querySelectorAll("[data-contador]");

    function atualizarContagem() {
        const agora = new Date();

        itensTempo.forEach(function (e) {
            const inicio = new Date(e.dataset.contador);
            const diff = inicio - agora;

            if (diff <= 0) {
                e.textContent = "Evento já começou!";
                e.classList.add("text-success");
                e.classList.remove("text-primary");
                return;
            }

            const seg = Math.floor(diff / 1000);
            const dias = Math.floor(seg / 86400);
            const horas = Math.floor((seg % 86400) / 3600);
            const minutos = Math.floor((seg % 3600) / 60);
            const segundos = seg % 60;

            e.textContent = `Faltam ${dias}d ${horas}h ${minutos}m ${segundos}s`;
        });
    }

    atualizarContagem();
    setInterval(atualizarContagem, 1000);

    if (campoPesquisa) {
        campoPesquisa.addEventListener("input", function () {
            const termo = campoPesquisa.value.toLowerCase();
            
            cards.forEach(function (card) {
                const texto = card.innerText.toLowerCase();
                if (texto.includes(termo)) {
                    card.classList.remove('hidden-by-search');
                } else {
                    card.classList.add('hidden-by-search');
                }
            });
            
            currentPage = 1;
            showPage(currentPage);
        });
    }

    function carregarFavoritos() {
        try {
            return JSON.parse(localStorage.getItem(salvar)) || [];
        } catch {
            return [];
        }
    }

    function salvarFavoritos(lista) {
        localStorage.setItem(salvar, JSON.stringify(lista));
    }

    function atualizarIconesFavorito() {
        const favoritos = carregarFavoritos();
        cards.forEach(function (card) {
            const id = card.dataset.id;
            const btn = card.querySelector(".btn-favorito");
            const favorito = favoritos.includes(id);

            if (!btn) return;

            btn.textContent = favorito ? "⭐ Favorito" : "☆ Favoritar";
            btn.classList.toggle("btn-warning", favorito);
            btn.classList.toggle("btn-outline-warning", !favorito);
        });
    }

    cards.forEach(function (card) {
        const btn = card.querySelector(".btn-favorito");
        if (!btn) return;

        btn.addEventListener("click", function () {
            const id = card.dataset.id;
            let favoritos = carregarFavoritos();

            if (favoritos.includes(id)) {
                favoritos = favoritos.filter(x => x !== id);
            } else {
                favoritos.push(id);
            }

            salvarFavoritos(favoritos);
            atualizarIconesFavorito();
        });
    });

    atualizarIconesFavorito();

    function ordenarCards(tipo) {
        cards.sort(function (a, b) {
            const tituloA = (a.dataset.titulo || "").toLowerCase();
            const tituloB = (b.dataset.titulo || "").toLowerCase();
            const dataA = new Date(a.dataset.inicio);
            const dataB = new Date(b.dataset.inicio);

            if (tipo === "data-asc") return dataA - dataB;
            if (tipo === "data-desc") return dataB - dataA;
            if (tipo === "titulo-asc") return tituloA.localeCompare(tituloB);
            if (tipo === "titulo-desc") return tituloB.localeCompare(tituloA);
            return 0;
        });

        cards.forEach(card => container.appendChild(card));
        
        currentPage = 1;
        showPage(currentPage);
    }

    if (selectOrdenar) {
        selectOrdenar.addEventListener("change", function () {
            ordenarCards(this.value);
        });
        ordenarCards(selectOrdenar.value);
    }

    showPage(currentPage);
});