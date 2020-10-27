import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';
//import Repositorys from '../Repository';

// na interface abaixo eu pego os campos que irei utilizar vindos da api do github e declaro
// não é necessário declrar todos, somente os que não irei utilizar
interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

/* Os exemplos abaixo, ambos fazem a mesma coisa. Porém irei
*utilizar o "const", pois consigo tipar dessa forma
*const Dashboard = () => {}
*function Dashboard() {}
*/

//os dois pontos a partir da variável, definem o tipo dela FC= Function component
const Dashboard: React.FC = () => {
    // esse estado trata do que é digitado no input
    const [newRepo, setNewRepo] = useState('');

    //esse estado trata do que retorna da api
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        // conferindo se existe algo salvo no storage e trazendo caso exista
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if (storagedRepositories) {
            return JSON.parse(storagedRepositories);
        } else {
            //caso não encontre nada no storage, retorno um array vazio
            return [];
        }
    });

    // esse estado trata dos erros
    const [inputError, setInputError] = useState('');



    // sempre que tiver alguma mudança na variável 'repositories' eu vou salva-la no localStorAGE
    useEffect(() => {
        // @GithubExplorer:repositories (arroba + nome da aplicação que quero gravar, dois pontos e o nome da informação que quero gravar )
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories])

    //HTMLFormElement representa o elemento HTML do form
    //FormEvent Representa o evento de submit do formulário e exige o Elemento HTML do form(HTMLFormElement)
    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {

        // preventDefault - previne o comportamento padrão do form que é recarregar após realizar o submit
        event.preventDefault();

        //verifico se algo não foi digitado no input
        if (!newRepo) {
            setInputError('Digite autor/ nome repositório')
            return;
        }

        try {

            // chamada da api
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;

            setRepositories([...repositories, repository]);
            // deixar o input em branco após o clique
            setNewRepo('');
            //deixar erro em branco
            setInputError('');
        } catch (err) {
            setInputError('Erro na busca por esse repositório');
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore repositórios no Github</Title>

            {/* !! duas negações deixa a condição verdadeira - usar quando quiser converter algo em boolean e checar se sua condição é verdadeira */}
            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="Digite aqui o nome do repositório"
                />
                <button type="submit">Pesquisar</button>
            </Form>

            {/* Se existir a var inputError, mostre o que está depois do &&(and) */}
            { inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    )
};

export default Dashboard;
