const baseURL = "http://localhost:8000/tarefas"

let tarefas = []
let editing = false
let tarefa_id

function resetar_formulario() {
  const form_filme = document.getElementById("form-tarefa")
  const input_situacao = document.getElementById("situacao")
  input_situacao.disabled = true
  form_filme.reset()

  const btn_confirmar = document.getElementById("btn-confirmar")
  btn_confirmar.value = "Adicionar Tarefa"

  editing = false
}

function atualizar_tela() {
  // Manipulacao de DOM
  const ul_tarefas = document.getElementById("list-tarefas")
  ul_tarefas.innerHTML = []

  for (let tarefa of tarefas) {
    const item = document.createElement("li")
    const label = `#${tarefa.id} - ${tarefa.descricao} -  ${tarefa.responsavel} - ${tarefa.situacao} - ${tarefa.prioridade} - ${tarefa.nivel}  `

    const btn_editar = document.createElement("a") // <a></a>
    btn_editar.innerText = "Editar" // <a>Editar</a>
    btn_editar.href = "#"

    btn_editar.onclick = (event) => {
      event.preventDefault()

      // 1. Preencher o Formulário
      preencher_formulario(tarefa)

      // 2. Mudar o Label do Botão para Atualizar
      const btn_confirmar = document.getElementById("btn-confirmar")
      btn_confirmar.value = "Editar Tarefa"

      // 3. Salvar um Estado Global se está editando
      editing = true
      tarefa_id = tarefa.id
    }

    const btn_remover = document.createElement("a") // <a></a>
    btn_remover.innerText = "Remover" // <a>Editar</a>
    btn_remover.href = "#"
    const espaco = document.createElement("span")
    espaco.innerText = " "
    btn_remover.onclick = async (event) => {
      event.preventDefault()
      const confirmou = confirm(`Deseja mesmo remover a Tarefa: ${tarefa.nome}`)

      if (!confirmou) {
        return
      }

      const response = await fetch(baseURL + "/" + tarefa.id, {method: 'DELETE'})

      // se deu certo..
      if (response.ok) {
        alert("Tarefa removida com sucesso!")
        carregar_tarefas()
      }
    }

    item.innerText = label
    item.appendChild(btn_editar)
    item.appendChild(espaco)
    item.appendChild(btn_remover)

    ul_tarefas.appendChild(item)
  }
}

function preencher_formulario(tarefa) {
  const form_tarefa = document.getElementById("form-tarefa")

  const inputs = form_tarefa.children
  inputs[0].value = tarefa.descricao
  inputs[1].value = tarefa.responsavel
  inputs[2].value = tarefa.situacao
  inputs[3].value = tarefa.prioridade
  inputs[4].value = tarefa.nivel

  inputs[2].disabled = false
}

async function carregar_tarefas() {
  const response = await fetch(baseURL)
  const status = response.status

  tarefas = await response.json()
  atualizar_tela()
}

function configurar_formulario() {
  const form_tarefa = document.getElementById("form-tarefa")
  const input_nivel = document.getElementById("nivel")

  const btn_cancelar = document.getElementById("btn-cancelar")

  btn_cancelar.onclick = () => {
    const btn_confirmar = document.getElementById("btn-confirmar")
    btn_confirmar.value = "Adicionar Tarefa"
  }

  form_tarefa.onsubmit = async function (event) {
    event.preventDefault()

    const dados = form_tarefa.children
    const descricao = dados[0].value
    const responsavel = dados[1].value
    const situacao = dados[2].value
    const prioridade = Number(dados[3].value)
    const nivel = Number(input_nivel.value)

    const tarefa = { descricao: descricao, responsavel: responsavel, situacao: situacao, prioridade: prioridade, nivel: nivel }

    console.log("Submeteu!!!")

    let url = baseURL
    let method = "POST"
    let mensagem_ok = "Tarefa Adicionada com sucesso!"
    let mensagem_erro = "Não foi possível adicionar"
    let response_status = 201

    if (editing) {
      url = baseURL + "/" + tarefa_id
      method = "PUT"
      mensagem_ok = "Tarefa Atualizada com sucesso!"
      mensagem_erro = "Não foi possível editar"
      response_status = 200
    }

    const opcoes = {
      method: method,
      body: JSON.stringify(tarefa),
      headers: {
        "Content-Type": "application/json"
      }
    }

    const response = await fetch(url, opcoes)

    if (response.status === response_status) {
      alert(mensagem_ok)
      carregar_tarefas()
      resetar_formulario()
    } else {
      const result_data = await response.json()
      alert(`Erro: ${result_data["detail"]}`)
    }
  }
}

function app() {
  console.log("Hello Tarefas")
  configurar_formulario()
  carregar_tarefas()
}

app()