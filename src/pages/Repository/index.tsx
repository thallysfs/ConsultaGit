import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api'

import logoImg from '../../assets/logo.svg';

import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParams {
    repository: string;
}

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface issue {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    }
}


/* Os exemplos abaixo, ambos fazem a mesma coisa. Porém irei
*utilizar o "const", pois consigo tipar dessa forma
*const Dashboard = () => {}
*function Dashboard() {}
*/

//os dois pontos a partir da variável, definem o tipo dela FC= Function component
const Repository: React.FC = () => {
    // o 'ou' abaixo na tipagem é para que o js aceite dois tipos, pois inicialmente esse tipo será nulo
    const [repository, setRepository] = useState<Repository | null>(null);
    const [issues, setIssues] = useState<issue[]>([]);

    const { params } = useRouteMatch<RepositoryParams>();

    //usar essa função para disparar uma função sempre que algo mudar ou carregar junto com a página
    useEffect(() => {
        api.get(`repos/${params.repository}`).then((response) => {
            setRepository(response.data);
        });

        api.get(`repos/${params.repository}/issues`).then((response) => {
            setIssues(response.data);
        });

        /* outra forma de fazer o que fiz acima usando async
        async function loadData(): Promise<void> {
            // desse modo o await aguarda as duas ações abaixo para seguir ou invés de uma e depois a outra
            const [repository, issues] = await Promise.all([
                api.get(`repos/${params.repository}`),
                api.get(`repos/${params.repository}/issues`),
            ]);
        }
        */

    }, [params.repository]);

    return (
        <>
            <Header>
                <img src={logoImg} alt="GitHub Explorer" />
                <Link to="/">
                    <FiChevronLeft size={16} />
                Voltar
            </Link>
            </Header>

            {/** Consicional, se existir repositório, mostre o  RepositoryInfo*/}
            {repository && (
                <RepositoryInfo>
                    <header>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <span>Stars</span>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <span>Forks</span>
                        </li>
                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <span>Issues Abertas</span>
                        </li>
                    </ul>
                </RepositoryInfo>

            )}

            <Issues>
                {/* utilizei 'a' ao invés do link pq é um link/rota externo*/}
                {issues.map(issue => (
                    <a key={issue.id} href={issue.html_url}>
                        <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </a>
                ))}
            </Issues>
        </>
    );
};

export default Repository;
