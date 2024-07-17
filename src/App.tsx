import React, { useEffect, useState } from "react";
import { SERVER_URL } from "./utils/constants";

interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
};

export const App = (): JSX.Element => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect((): void => {
        fetch(`${SERVER_URL}/api/users`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUsers(data)
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <div className="App">
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.avatar && <p><strong>Avatar:</strong> <img src={user.avatar} alt={`${user.name}'s avatar`} /></p>}
                        <p><strong>Created At:</strong> {user.createdAt}</p>
                        <p><strong>Updated At:</strong> {user.updatedAt}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};