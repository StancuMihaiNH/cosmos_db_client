export class ApiWrapper<T> {
    public baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    };

    async getAll(endpoint: string): Promise<Array<T>> {
        const response = await fetch(`${this.baseUrl}/${endpoint}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    async getById(endpoint: string, id: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    async getByQuery(endpoint: string, query: Record<string, any>): Promise<Array<T>> {
        const queryString = new URLSearchParams(query).toString();
        const response = await fetch(`${this.baseUrl}/${endpoint}?${queryString}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    async create(endpoint: string, item: T): Promise<T> {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    async update(endpoint: string, id: string, item: Partial<T>): Promise<T> {
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    async delete(endpoint: string, id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    };
};