document.addEventListener("DOMContentLoaded", function () {
    
    console.log("Script de eventos carregado!");
    
    // Elementos do formulário
    const formulario = document.getElementById("formulario_evento");
    const btnCancelar = document.getElementById("btn_cancelar");
    const inputValor = document.getElementById("valor");
    const inputCargaHoraria = document.getElementById("carga_horaria");
    const inputDataInicio = document.getElementById("data_inicio");
    const inputDataFim = document.getElementById("data_fim");
    const inputVagas = document.getElementById("vagas");
    
    // FORMATAÇÃO DO CAMPO DE VALOR (TAXA DE INSCRIÇÃO) EM REAIS
    if (inputValor) {
        // Formatar valor inicial se houver
        if (inputValor.value) {
            inputValor.value = formatarMoeda(inputValor.value);
        }
        
        inputValor.addEventListener("input", function (e) {
            let valor = e.target.value;
            
            // Remove tudo que não é número
            valor = valor.replace(/\D/g, "");
            
            // Converte para número e divide por 100 (para ter centavos)
            valor = (parseInt(valor) || 0) / 100;
            
            // Formata como moeda brasileira
            e.target.value = valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        });
        
        inputValor.addEventListener("focus", function (e) {
            // Remove R$ ao focar para facilitar edição
            let valor = e.target.value.replace(/\D/g, "");
            if (valor === "0" || valor === "") {
                e.target.value = "";
            }
        });
    }
    
    // Função auxiliar para formatar moeda
    function formatarMoeda(valor) {
        valor = valor.replace(/\D/g, "");
        valor = (parseInt(valor) || 0) / 100;
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }
    
    // FORMATAÇÃO DO CAMPO DE CARGA HORÁRIA (DURAÇÃO EM HORAS)
    if (inputCargaHoraria) {
        inputCargaHoraria.addEventListener("input", function (e) {
            let valor = e.target.value;
            
            // Garante que seja apenas números positivos
            if (valor < 0) {
                e.target.value = 1;
            }
        });
        
        // Adiciona "hora(s)" ao lado do campo
        const labelCargaHoraria = document.querySelector('label[for="carga_horaria"]');
        if (labelCargaHoraria && !labelCargaHoraria.textContent.includes("horas")) {
            labelCargaHoraria.textContent = "Duração (em horas)";
        }
    }
    
    // VALIDAÇÃO DE DATAS
    if (inputDataInicio && inputDataFim) {
        // Define data mínima como hoje
        const hoje = new Date().toISOString().split("T")[0];
        inputDataInicio.min = hoje;
        inputDataFim.min = hoje;
        
        inputDataInicio.addEventListener("change", function () {
            // Data de fim não pode ser anterior à data de início
            inputDataFim.min = inputDataInicio.value;
            
            if (inputDataFim.value && inputDataFim.value < inputDataInicio.value) {
                alert("A data de encerramento não pode ser anterior à data de início!");
                inputDataFim.value = "";
            }
        });
        
        inputDataFim.addEventListener("change", function () {
            if (inputDataInicio.value && inputDataFim.value < inputDataInicio.value) {
                alert("A data de encerramento não pode ser anterior à data de início!");
                inputDataFim.value = "";
            }
        });
    }
    
    // VALIDAÇÃO DE VAGAS
    if (inputVagas) {
        inputVagas.addEventListener("input", function (e) {
            let valor = e.target.value;
            
            // Garante que seja apenas números positivos
            if (valor < 1) {
                e.target.value = 1;
            }
        });
    }
    
    // BOTÃO CANCELAR
    if (btnCancelar) {
        btnCancelar.addEventListener("click", function (e) {
            e.preventDefault();
            
            if (confirm("Tem certeza que deseja limpar todos os campos?")) {
                formulario.reset();
                // Limpa também o campo de valor formatado
                if (inputValor) {
                    inputValor.value = "";
                }
                console.log("Formulário limpo!");
            }
        });
    }
    
    // SUBMISSÃO DO FORMULÁRIO
    if (formulario) {
        formulario.addEventListener("submit", function (e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const nome = document.getElementById("nome").value;
            const cargaHoraria = document.getElementById("carga_horaria").value;
            const valorBruto = inputValor.value.replace(/\D/g, "");
            const valor = (parseInt(valorBruto) || 0) / 100;
            const vagas = document.getElementById("vagas").value;
            const tipoEvento = document.getElementById("tipo_evento").value;
            const dataInicio = document.getElementById("data_inicio").value;
            const dataFim = document.getElementById("data_fim").value;
            const descricao = document.getElementById("descricao").value;
            
            // Validação final
            if (!tipoEvento) {
                alert("Por favor, selecione um tipo de evento!");
                return;
            }
            
            // Cria objeto com os dados do evento
            const evento = {
                id: "evento-" + Date.now(),
                nome: nome,
                cargaHoraria: cargaHoraria,
                valor: valor,
                vagas: vagas,
                tipoEvento: tipoEvento,
                dataInicio: dataInicio,
                dataFim: dataFim,
                descricao: descricao,
                dataCadastro: new Date().toISOString()
            };
            
            console.log("Evento cadastrado:", evento);
            
            // Aqui você pode salvar no localStorage ou enviar para um servidor
            salvarEvento(evento);
            
            // Mostra mensagem de sucesso
            alert("Evento cadastrado com sucesso!");
            
            // Limpa o formulário
            formulario.reset();
            
            // Redireciona para a página inicial (opcional)
            // window.location.href = "index.html";
        });
    }
    
    // FUNÇÃO PARA SALVAR EVENTO NO LOCALSTORAGE
    function salvarEvento(evento) {
        try {
            // Recupera eventos existentes
            let eventos = JSON.parse(localStorage.getItem("eventosCadastrados")) || [];
            
            // Adiciona o novo evento
            eventos.push(evento);
            
            // Salva de volta no localStorage
            localStorage.setItem("eventosCadastrados", JSON.stringify(eventos));
            
            console.log("Evento salvo no localStorage!");
            return true;
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
            alert("Erro ao salvar evento. Por favor, tente novamente.");
            return false;
        }
    }
    
    // FUNÇÃO PARA RECUPERAR EVENTOS (útil para outras páginas)
    function recuperarEventos() {
        try {
            return JSON.parse(localStorage.getItem("eventosCadastrados")) || [];
        } catch (error) {
            console.error("Erro ao recuperar eventos:", error);
            return [];
        }
    }
    
    // Exporta funções para uso global (opcional)
    window.EventosManager = {
        salvarEvento: salvarEvento,
        recuperarEventos: recuperarEventos
    };
});