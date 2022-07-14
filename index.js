const express = require('express')
const cors = require('cors')

const { pool } = require('./config')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

//personagens
const getPersonagem = (request, response) => {
    pool.query('SELECT * FROM personagem ORDER BY cod_personagem', 
    (error, results) => {
        if (error) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao consultar a tebela personagem " + error
                }
            )
        }
        response.status(200).json(results.rows);
    }
    )
}

const addPersonagem = (request, response) => {
    const {nome_personagem, vida_maxima, sanidade_maxima, historia} = request.body;
    pool.query(
    `INSERT INTO personagem (nome_personagem, vida_maxima, sanidade_maxima, historia)
    VALUES ($1, $2, $3, $4)
    RETURNING  cod_personagem, nome_personagem, vida_maxima, sanidade_maxima, historia`,
    [nome_personagem, vida_maxima, sanidade_maxima, historia], 
    (error, results) => {
        if (error) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao inserir o personagem " + error
                }
            )
        }
        response.status(200).json(
            {
                status : 'success',
                message : 'Personagem criado',
                objeto:  results.rows[0]
            }
        );
    }
    )
}

const updatePersonagem = (request, response) => {
    const {nome_personagem, vida_maxima, sanidade_maxima, historia, cod_personagem} = request.body;
    pool.query(
    `UPDATE personagem SET nome_personagem=$1,
    vida_maxima=$2, sanidade_maxima=$3, historia=$4
    WHERE cod_personagem = $5
    RETURNING cod_personagem, nome_personagem, vida_maxima, sanidade_maxima, historia`,
    [nome_personagem, vida_maxima, sanidade_maxima, historia, cod_personagem], 
    (error, results) => {
        if (error) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao atualizar o personagem " + error
                }
            )
        }
        response.status(200).json(
            {
                status : 'success',
                message : 'Personagem atualizado',
                objeto:  results.rows[0]
            }
        );
    }
    )
}

const deletePersonagem = (request, response) => {
    const cod_personagem = parseInt(request.params.cod_personagem);
    pool.query(
    `DELETE FROM personagem WHERE cod_personagem = $1`,
    [cod_personagem], 
    (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao remover o personagem " + error
                }
            )
        }
        response.status(200).json(
            {
                status : 'success',
                message : 'Personagem removido'
            }
        );
    }
    )
}

const getPersonagemPorCodigo = (request, response) => {
    const cod_personagem = parseInt(request.params.cod_personagem);
    pool.query(
    'SELECT * FROM personagem WHERE cod_personagem = $1',
    [cod_personagem], 
    (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao recuperar o personagem " + error
                }
            )
        }
        response.status(200).json(results.rows[0]);
    }
    )
}

//armas
const getArma = (request, response) => {
    pool.query('SELECT * FROM armas ORDER BY cod_arma', 
    (error, results) => {
        if (error) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao consultar a tebela armas " + error
                }
            )
        }
        response.status(200).json(results.rows);
    }
    )
}

const addArmas = (request, response) => {
    const {nome_arma, descricao_arma} = request.body;
    pool.query(
    `INSERT INTO armas (nome_arma, descricao_arma)
    VALUES ($1, $2)
    RETURNING  cod_arma, nome_arma, descricao_arma`,
    [nome_arma, descricao_arma], 
    (error, results) => {
        if (error) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao inserir a arma " + error
                }
            )
        }
        response.status(200).json(
            {
                status : 'success',
                message : 'arma criada',
                objeto:  results.rows[0]
            }
        );
    }
    )
}

const updateArma = (request, response) => {
    const {nome_arma, descricao_arma, cod_arma} = request.body;
    pool.query(
    `UPDATE armas SET nome_arma=$1, descricao_arma=$2
    WHERE cod_arma = $3
    RETURNING cod_arma, nome_arma, descricao_arma`,
    [nome_arma, descricao_arma, cod_arma], 
    (error, results) => {
        if (error) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao atualizar a arma " + error
                }
            )
        }
        response.status(200).json(
            {
                status : 'success',
                message : 'arma atualizada',
                objeto:  results.rows[0]
            }
        );
    }
    )
}

const deleteArma = (request, response) => {
    const cod_arma = parseInt(request.params.cod_arma);
    pool.query(
    `DELETE FROM armas WHERE cod_arma = $1`,
    [cod_arma], 
    (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao remover a arma" + error
                }
            )
        }
        response.status(200).json(
            {
                status : 'success',
                message : 'arma removida'
            }
        );
    }
    )
}

const getArmaPorCodigo = (request, response) => {
    const cod_arma = parseInt(request.params.cod_arma);
    pool.query(
    'SELECT * FROM armas WHERE cod_arma = $1',
    [cod_arma], 
    (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao recuperar a arma " + error
                }
            )
        }
        response.status(200).json(results.rows[0]);
    }
    )
}

//relações personagem-arma
const getUtiliza = (request, response) => {
    pool.query(`select p.cod_personagem as cod_personagem, p.nome_personagem as nome_personagem, a.cod_arma as cod_arma, a.nome_arma as nome_arma
    from utiliza u
    join armas a on u.cod_arma = a.cod_arma
    join personagem p on u.cod_personagem = p.cod_personagem
    order by P.cod_personagem`, 
    (error, results) => {
        if (error) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao consultar a tebela utiliza " + error
                }
            )
        }
        response.status(200).json(results.rows);
    }
    )
}

const addUtiliza = (request, response) => {
    const {cod_personagem, cod_arma} = request.body;
    pool.query(
    `insert into utiliza (cod_personagem, cod_arma) 
    values ($1, $2)
    returning cod_personagem, cod_arma`,
    [cod_personagem, cod_arma], 
    (error, results) => {
        if (error) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao inserir a relação " + error
                }
            )
        }
        response.status(200).json(
            {
                status : 'success',
                message : 'relação criada',
                objeto:  results.rows[0]
            }
        );
    }
    )
}

const deleteUtiliza = (request, response) => {
    const {cod_personagem, cod_arma} = request.body;
    pool.query(
    `delete from utiliza where cod_personagem = $1 and cod_arma = $2`,
    [cod_personagem, cod_arma], 
    (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(400).json(
                {
                    status : "error",
                    message : "Erro ao remover a relação " + error
                }
            )
        }
        response.status(200).json(
            {
                status : 'success',
                message : 'relação removida'
            }
        );
    }
    )
}

//routes personagem
app.route('/personagem')
    .get(getPersonagem)
    .post(addPersonagem)
    .put(updatePersonagem)

app.route('/personagem/:cod_personagem')
    .delete(deletePersonagem)
    .get(getPersonagemPorCodigo)

//routes armas
app.route('/arma')
    .get(getArma)
    .post(addArmas)
    .put(updateArma)

app.route('/arma/:cod_arma')
    .delete(deleteArma)
    .get(getArmaPorCodigo)

//routes utiliza
app.route('/utiliza')
    .get(getUtiliza)
    .post(addUtiliza)
    .delete(deleteUtiliza)


app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor da API rodando')
})

