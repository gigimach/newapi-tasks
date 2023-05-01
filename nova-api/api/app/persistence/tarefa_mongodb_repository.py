from typing import TypedDict

from bson.objectid import ObjectId
from decouple import config
from pymongo import MongoClient

from ..presentation.viewmodels import Tarefa

class TarefaMongo(TypedDict):
    _id: ObjectId
    descricao: str
    responsavel: str | None
    nivel: int
    situacao: str
    prioridade: int


class TarefaMongoDBRepositorio():

    def __init__(self):
        #conectar ao MongoDB
        uri = config('MONGODB_URL')
        client = MongoClient(uri)
        db = client['tarefasapp']
        self.tarefas = db['tarefas']
    

    def todos(self, skip=0, take=0):
        tarefas = self.tarefas.find().skip(skip).limit(take)
        return list(map(Tarefa.fromDict, tarefas))
    

    def salvar(self, tarefa):
        _id = self.tarefas.insert_one(tarefa.toDict()).inserted_id
        tarefa.id = str(_id)
        return tarefa
    

    def obter_um(self, tarefa_id):
        filtro = {"_id": ObjectId(tarefa_id)}
        tarefa_encontrada = self.tarefas.find_one(filtro)
        return Tarefa.fromDict(tarefa_encontrada) if tarefa_encontrada else None
    

    def remover(self, tarefa_id):
        filtro = {"_id": ObjectId(tarefa_id)}
        self.tarefas.delete_one(filtro)
    

    def atualizar(self, tarefa_id, tarefa):
        filtro = {"_id": ObjectId(tarefa_id)}
        self.tarefas.update_one(filtro, {'$set': tarefa.toDict()})
        tarefa.id = tarefa_id
        return tarefa