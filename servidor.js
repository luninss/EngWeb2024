const http = require('http');
const url = require('url');
const axios = require('axios');

const server = http.createServer((req, res) => {
    const { method, url: reqUrl } = req;
    const parsedUrl = url.parse(reqUrl, true);
    const { pathname } = parsedUrl;

    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});

    if(pathname === "/") {
        res.write("<h1>Escola de Artes</h1>");
        res.write("<h3>Escolha uma das seguintes opções:</h3>");
        res.write("<ul>");
        res.write("<li><a href='/alunos'>Lista de alunos</a></li>");
        res.write("<li><a href='/cursos'>Lista de cursos</a></li>");
        res.write("<li><a href='/instrumentos'>Lista de instrumentos</a></li>");
        res.write("</ul>");
        res.end();

    } else if(pathname === "/cursos") {
        axios.get("http://localhost:3000/cursos?_sort=designacao")
        .then((resp) => {
            const data = resp.data;
            res.write("<h1>Escola de Artes</h1>");
            res.write("<h3>Lista de Cursos:</h3>");
            res.write("<ul>");
            data.forEach(course => {
                res.write(`<li><a href='/cursos/${course.id}'>${course.designacao}</a></li>`);
            });
            res.write("</ul>");
            res.write("<h4><a href='/'>Voltar à página inicial</a></h4>");
            res.end();
        })
        .catch((error) => {
            console.error("Erro: " + error);
            res.write("<h1>Erro</h1><p>" + error + "</p>");
            res.end();
        });
    } else if(pathname === "/alunos") {
        axios.get("http://localhost:3000/alunos?_sort=nome")
        .then((resp) => {
            const data = resp.data;
            res.write("<h1>Escola de Artes</h1>");
            res.write("<h3>Lista de Alunos:</h3>");
            res.write("<ul>");
            data.forEach(student => {
                res.write(`<li><a href='/alunos/${student.id}'>${student.nome}</a></li>`);
            });
            res.write("</ul>");
            res.write("<h4><a href='/'>Voltar à página inicial</a></h4>");
            res.end();
        })
        .catch((error) => {
            console.error("Erro: " + error);
            res.write("<h1>Erro</h1><p>" + error + "</p>");
            res.end();
        });
    } else if(pathname === "/instrumentos") {
        axios.get("http://localhost:3000/instrumentos?_sort=name")
        .then((resp) => {
            const data = resp.data;
            res.write("<h1>Escola de Artes</h1>");
            res.write("<h3>Lista de Instrumentos:</h3>");
            res.write("<ul>");
            data.forEach(instrument => {
                res.write("<li>" + instrument["#text"] + "</li>")
            });
            
            res.write("</ul>");
            res.write("<h4><a href='/'>Voltar à página inicial</a></h4>");
            res.end();
        })
        .catch((error) => {
            console.error("Erro: " + error);
            res.write("<h1>Erro</h1><p>" + error + "</p>");
            res.end();
        });
    } else if (pathname.startsWith("/cursos/")) {
        const courseId = pathname.split("/").pop();
        axios.get(`http://localhost:3000/cursos/${courseId}`)
        .then((resp) => {
            const data = resp.data;
            res.write("<h1>Escola de Artes</h1>");
            res.write(`<h2>${data.designacao}</h2>`);
            res.write(`<p><b>Id:</b> ${data.id}</p>`);
            res.write(`<p><b>Duração:</b> ${data.duracao}</p>`);
            res.write(`<p><b>Instrumento:</b> ${data.instrumento["#text"]}</p>`);
            res.write("<h4><a href='/cursos'>Voltar à lista de cursos</a></h4>");
            res.write("<h4><a href='/'>Voltar à página inicial</a></h4>");
            res.end();
        })
        .catch((error) => {
            console.error("Erro: " + error);
            res.write("<h1>Erro: Este curso não foi encontrado</h1><p>" + error + "</p>");
            res.end();
        });
    } else if (pathname.startsWith("/alunos/")) {
        const studentId = pathname.split("/").pop();
        axios.get(`http://localhost:3000/alunos/${studentId}`)
        .then((resp) => {
            const data = resp.data;
            res.write("<h1>Escola de Artes</h1>");
            res.write("<h2>Ficha de Aluno</h2>");
            res.write(`<p><b>Id:</b> ${data.id}</p>`);
            res.write(`<p><b>Nome:</b> ${data.nome}</p>`);
            res.write(`<p><b>Data Nascimento:</b> ${data.dataNasc}</p>`);
            res.write(`<p><b>Curso:</b> <a href='/cursos/${data.curso}'>${data.curso}</a></p>`);
            res.write(`<p><b>Ano do Curso:</b> ${data.anoCurso}</p>`);
            res.write(`<p><b>Instrumento:</b> ${data.instrumento}</p>`);
            res.write("<h4><a href='/alunos'>Voltar à lista de alunos</a></h4>");
            res.write("<h4><a href='/'>Voltar à página inicial</a></h4>");
            res.end();
        })
        .catch((error) => {
            console.error("Erro: " + error);
            res.write("<h1>Erro: Este aluno não encontrado</h1><p>" + error + "</p>");
            res.end();
        });
    } else {
        res.write("<h1>Error 404</h1><p>Página não encontrada!</p>");
        res.end();
    }

});

server.listen(3030, () => {
    console.log("Servidor ativo na porta 3030");
});
