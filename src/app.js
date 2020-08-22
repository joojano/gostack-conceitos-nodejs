const express = require("express");
const { uuid, isUuid } = require('uuidv4');
const cors = require("cors");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0}

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

/*
POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório 
específico escolhido através do id presente nos parâmetros da rota, 
a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
*/

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  const {title, url, techs} = repositories[repositoryIndex]

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes + 1
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

module.exports = app;
