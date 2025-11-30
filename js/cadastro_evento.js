document.addEventListener("DOMContentLoaded", function () {
    
    console.log("Script de eventos carregado!");
    
    const formulario = document.getElementById("formulario_evento");
    const btnCancelar = document.getElementById("btn_cancelar");
    const inputValor = document.getElementById("valor");
    const inputCargaHoraria = document.getElementById("carga_horaria");
    const inputDataInicio = document.getElementById("data_inicio");
    const inputDataFim = document.getElementById("data_fim");
    const inputVagas = document.getElementById("vagas");
    
    if (inputValor) {
        if (inputValor.value) {
            inputValor.value = formatarMoeda(inputValor.value);
        }
        
        inputValor.addEventListener("input", function (e) {
            let valor = e.target.value;
            
            valor = valor.replace(/\D/g, "");
            
            valor = (parseInt(valor) || 0) / 100;
            
            e.target.value = valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        });
        
        inputValor.addEventListener("focus", function (e) {
            let valor = e.target.value.replace(/\D/g, "");
            if (valor === "0" || valor === "") {
                e.target.value = "";
            }
        });
    }
    
    function formatarMoeda(valor) {
        valor = valor.replace(/\D/g, "");
        valor = (parseInt(valor) || 0) / 100;
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }
    
    if (inputCargaHoraria) {
        inputCargaHoraria.addEventListener("input", function (e) {
            let valor = e.target.value;
            
            if (valor < 0) {
                e.target.value = 1;
            }
        });
        
        const labelCargaHoraria = document.querySelector('label[for="carga_horaria"]');
        if (labelCargaHoraria && !labelCargaHoraria.textContent.includes("horas")) {
            labelCargaHoraria.textContent = "Duração (em horas)";
        }
    }
    
    if (inputDataInicio && inputDataFim) {
        const hoje = new Date().toISOString().split("T")[0];
        inputDataInicio.min = hoje;
        inputDataFim.min = hoje;
        
        inputDataInicio.addEventListener("change", function () {
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
    
    if (inputVagas) {
        inputVagas.addEventListener("input", function (e) {
            let valor = e.target.value;
            
            if (valor < 1) {
                e.target.value = 1;
            }
        });
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener("click", function (e) {
            e.preventDefault();
            
            if (confirm("Tem certeza que deseja limpar todos os campos?")) {
                formulario.reset();
                if (inputValor) {
                    inputValor.value = "";
                }
                console.log("Formulário limpo!");
            }
        });
    }
    
    if (formulario) {
        formulario.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const nome = document.getElementById("nome").value;
            const cargaHoraria = document.getElementById("carga_horaria").value;
            const valorBruto = inputValor.value.replace(/\D/g, "");
            const valor = (parseInt(valorBruto) || 0) / 100;
            const vagas = document.getElementById("vagas").value;
            const tipoEvento = document.getElementById("tipo_evento").value;
            const dataInicio = document.getElementById("data_inicio").value;
            const dataFim = document.getElementById("data_fim").value;
            const descricao = document.getElementById("descricao").value;
            
            if (!tipoEvento) {
                alert("Por favor, selecione um tipo de evento!");
                return;
            }
            
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
            
            salvarEvento(evento);
            
            alert("Evento cadastrado com sucesso!");
            
            formulario.reset();
        });
    }
    
    function salvarEvento(evento) {
        try {
            let eventos = JSON.parse(localStorage.getItem("eventosCadastrados")) || [];
            
            eventos.push(evento);
            
            localStorage.setItem("eventosCadastrados", JSON.stringify(eventos));
            
            console.log("Evento salvo no localStorage!");
            return true;
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
            alert("Erro ao salvar evento. Por favor, tente novamente.");
            return false;
        }
    }
    
    function recuperarEventos() {
        try {
            return JSON.parse(localStorage.getItem("eventosCadastrados")) || [];
        } catch (error) {
            console.error("Erro ao recuperar eventos:", error);
            return [];
        }
    }
    
    window.EventosManager = {
        salvarEvento: salvarEvento,
        recuperarEventos: recuperarEventos
    };
});