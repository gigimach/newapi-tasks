from fastapi import APIRouter, HTTPException, status

from app.persistence.tarefa_mongodb_repository import TarefaMongoDBRepositorio

from ..viewmodels import Tarefa

routes = APIRouter()
prefix = '/tarefas'


tarefa_repositorio = TarefaMongoDBRepositorio()


@routes.get('/')
def todas_tarefas(skip: int | None = 0, take: int | None = 0):
    return tarefa_repositorio.todos(skip, take)


@routes.get('/{tarefa_id}')
def obter_tarefa(tarefa_id: int | str):
    tarefa = tarefa_repositorio.obter_um(tarefa_id)

    if not tarefa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Não há tarefa com id = {tarefa_id}")

    return tarefa
    

@routes.post('/', status_code=status.HTTP_201_CREATED)
def criar_tarefa(tarefa: Tarefa):
    tarefa.situacao = "Nova"
    return tarefa_repositorio.salvar(tarefa)


@routes.delete('/{tarefa_id}', status_code=status.HTTP_204_NO_CONTENT)
def excluir_tarefa(tarefa_id: int | str):
    tarefa = tarefa_repositorio.obter_um(tarefa_id)

    if not tarefa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Tarefa não encontrada')
    
    return tarefa_repositorio.remover(tarefa_id)


@routes.put('/{tarefa_id}')
def atualizar_tarefa(tarefa_id: int | str, tarefa: Tarefa):
    tarefa_encontrada = tarefa_repositorio.obter_um(tarefa_id)

    if not tarefa_encontrada:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Tarefa não encontrada')
    
    return tarefa_repositorio.atualizar(tarefa_id, tarefa)