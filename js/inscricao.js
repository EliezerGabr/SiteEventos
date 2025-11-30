/* DOMContentLoaded */
document.addEventListener("DOMContentLoaded", function() {

    /* ============================
       BANCO DE EVENTOS COM TIPOS
       ============================ */
    const eventosPorTipo = {
        "VGC": [
            { id: 1, nome: "Premier Challenges", descricao: "Batalha 1x1, sendo MD3 de 50 minutos. Possui prêmio de participação e premiações para pódio.", vagas: 15, valor: 50 },
            { id: 2, nome: "Campeonatos Especiais", descricao: "Batalha 2x2 utilizando formato Suiço de campeonato. Possui prêmio de participação e premiações para o top 10.", vagas: 5, valor: 80 }
        ],
        "TCG": [
            { id: 3, nome: "Cup", descricao: "Batalha 1x1 com premiação em cartas para todos os participantes, além de playmatch para o vencedor.", vagas: 0, valor: 100 }
        ],
        "Pokemon GO": [
            { id: 4, nome: "Go Battle League", descricao: "Batalhas 1x1 com equipe de 3 pokémons. A premiação varia de acordo com a quantidade de participantes.", vagas: 25, valor: 60 }
        ],
        "Pokemon Unity": [
            { id: 5, nome: "League Qualifier", descricao: "Partida 5x5 que permite vaga na liga oficial do pokémon Unity", vagas: 10, valor: 40 }
        ],
        "Outros": [
            {id: 6, nome: "Pokemonkê", descricao: "Evento de karaoke pokémon. Todas as aberturas do anime e também músicas criadas pela comunidade.", vagas: 150, valor: 0},
            {id: 7, nome: "Cosplay Pokémon", descricao: "Competicção de Cosplay. Vale cosplay de pokémons ou de treinadores/personagens do anime. Premiação para os 3 mais votados.", vagas: 70, valor: 10}
        ]
    };

    /* ============================
       ELEMENTOS DO FORM
       ============================ */
    const selectTipo = document.getElementById("tipo_evento");
    const selectEvento = document.getElementById("select_evento");
    const containerFormulario = document.getElementById("container_formulario");
    const form = document.getElementById("formulario_inscricao");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("alert", "mt-3");
    containerFormulario.appendChild(infoDiv);

    /* ============================
       PRIMEIRO DROPDOWN — TIPO
       ============================ */
    selectTipo.addEventListener("change", function () {
        const tipo = this.value;

        // limpa o select de eventos
        selectEvento.innerHTML = "";
        selectEvento.disabled = false;

        // mensagem inicial
        const optDefault = document.createElement("option");
        optDefault.textContent = "Selecione o evento";
        optDefault.disabled = true;
        optDefault.selected = true;
        selectEvento.appendChild(optDefault);

        // popula o dropdown conforme o tipo
        eventosPorTipo[tipo].forEach(ev => {
            const opt = document.createElement("option");
            opt.value = ev.id;
            opt.textContent = ev.nome;
            selectEvento.appendChild(opt);
        });

        // limpa info
        infoDiv.className = "alert mt-3";
        infoDiv.innerHTML = "";
    });

    /* ============================
       SEGUNDO DROPDOWN — EVENTO
       ============================ */
    selectEvento.addEventListener("change", function() {
        const eventoId = parseInt(this.value);

        // procura evento dentro de todos os tipos
        let eventoSelecionado = null;
        for (const tipo in eventosPorTipo) {
            eventoSelecionado = eventosPorTipo[tipo].find(ev => ev.id === eventoId);
            if (eventoSelecionado) break;
        }

        if (!eventoSelecionado) return;

        let classeAlerta = eventoSelecionado.vagas > 0 ? "alert-success" : "alert-danger";
        infoDiv.className = `alert ${classeAlerta} mt-3`;

        infoDiv.innerHTML = `
            <strong>${eventoSelecionado.nome}</strong><br>
            ${eventoSelecionado.descricao}<br>
            Vagas disponíveis: <b>${eventoSelecionado.vagas}</b><br>
            Valor da inscrição: <b>R$ ${eventoSelecionado.valor.toFixed(2)}</b>
        `;
    });

    /* ============================
       SUBMIT DO FORMULÁRIO
       ============================ */
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const eventoId = parseInt(selectEvento.value);
        if (!eventoId) {
            alert("Selecione um evento antes de prosseguir!");
            return;
        }

        // encontra o evento selecionado
        let evento = null;
        for (const tipo in eventosPorTipo) {
            evento = eventosPorTipo[tipo].find(ev => ev.id === eventoId);
            if (evento) break;
        }

        if (!evento) return;

        if (evento.vagas === 0) {
            alert("Desculpe, este evento está lotado!");
            return;
        }

        infoDiv.className = "alert alert-info mt-3";
        infoDiv.innerHTML = `
            ✅ Inscrição realizada com sucesso!<br>
            <b>${evento.nome}</b> - Valor: R$ ${evento.valor.toFixed(2)}<br>
            Um e-mail de confirmação foi enviado para você.
        `;
        
        // Limpa o formulário após 3 segundos
        setTimeout(function() {
            form.reset();
            selectEvento.innerHTML = "";
            selectEvento.disabled = true;
            const optDefault = document.createElement("option");
            optDefault.textContent = "Selecione o tipo primeiro";
            optDefault.disabled = true;
            optDefault.selected = true;
            selectEvento.appendChild(optDefault);
            
            infoDiv.className = "alert mt-3";
            infoDiv.innerHTML = "";
        }, 3000);
    });

    /* ============================
       MÁSCARA DE CPF
       ============================ */
    const cpfInput = document.getElementById("cpf");

    cpfInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 11);
    });

    /* ============================
       BOTÃO CANCELAR
       ============================ */
    const btnCancelarInscricao = document.getElementById("btn_cancelar");
    
    if (btnCancelarInscricao) {
        btnCancelarInscricao.addEventListener("click", function (e) {
            e.preventDefault();
            
            if (confirm("Tem certeza que deseja limpar todos os campos?")) {
                form.reset();
                
                // Limpa o select de eventos
                selectEvento.innerHTML = "";
                selectEvento.disabled = true;
                const optDefault = document.createElement("option");
                optDefault.textContent = "Selecione o tipo primeiro";
                optDefault.disabled = true;
                optDefault.selected = true;
                selectEvento.appendChild(optDefault);
                
                // Limpa a div de informações
                infoDiv.className = "alert mt-3";
                infoDiv.innerHTML = "";
                
                console.log("Formulário de inscrição limpo!");
            }
        });
    }

});