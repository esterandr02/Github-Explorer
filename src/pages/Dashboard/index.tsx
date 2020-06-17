import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight} from 'react-icons/fi';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');

    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepo = localStorage.getItem('@Github-Explorer:repositories');

        if (storageRepo) {
            return JSON.parse(storageRepo);
        } else {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('@Github-Explorer:repositories',
        JSON.stringify(repositories));
    }, [repositories]);

    async function handleAddRepository(
        event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (!newRepo) {
            setInputError('Type some user/repository.');
            return;
        }

        try {
            const response = await api.get<Repository>(`/repos/${newRepo}`);
            setRepositories([...repositories, response.data]);
            setNewRepo('');
            setInputError('');

        } catch(err) {
            setInputError('Cannot find this repository.');
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />

            <Title>Explore Github Repositories</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="Type repository's name">
                </input>

                <button type="submit">Search</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repo => (

                    <Link key={repo.full_name}
                        to={`/repositories/${repo.full_name}`}>

                        <img src={repo.owner.avatar_url}
                            alt={repo.owner.login}
                        />
                        <div>
                            <strong>{repo.full_name}</strong>
                            <p>{repo.description}</p>
                        </div>

                        <FiChevronRight size={20}/>
                    </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Dashboard;
