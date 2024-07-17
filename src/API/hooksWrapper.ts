import { QueryClient, UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ApiWrapper } from './apiWrapper';

export class HooksWrapper<T> {
    private static instance: HooksWrapper<any>;
    private apiWrapper: ApiWrapper<T>;

    private constructor(baseUrl: string) {
        this.apiWrapper = new ApiWrapper<T>(baseUrl);
    };

    public static getInstance<T>(baseUrl: string): HooksWrapper<T> {
        if (!HooksWrapper.instance) {
            HooksWrapper.instance = new HooksWrapper<T>(baseUrl);
        } else {
            HooksWrapper.instance.apiWrapper = new ApiWrapper<T>(baseUrl);
        }

        return HooksWrapper.instance;
    };

    fetchAll(endpoint: string): () => UseQueryResult<Array<T>, Error> {
        return () => useQuery<Array<T>, Error>({
            queryKey: [endpoint],
            queryFn: (): Promise<Array<T>> => this.apiWrapper.getAll(endpoint)
        });
    };

    fetchById(endpoint: string, id: string): () => UseQueryResult<T, Error> {
        return () => useQuery<T, Error>({
            queryKey: [endpoint, id],
            queryFn: (): Promise<T> => this.apiWrapper.getById(endpoint, id),
        });
    };

    fetchByQuery(endpoint: string, query: Record<string, any>): Promise<Array<T>> {
        return this.apiWrapper.getByQuery(endpoint, query);
    };

    create(endpoint: string): () => UseMutationResult<T, Error, T> {
        return () => {
            const queryClient: QueryClient = useQueryClient();
            return useMutation<T, Error, T>({
                mutationFn: (item: T) => this.apiWrapper.create(endpoint, item),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: [endpoint] });
                }
            });
        };
    };

    update(endpoint: string, id: string): () => UseMutationResult<T, Error, Partial<T>> {
        return () => {
            const queryClient: QueryClient = useQueryClient();

            return useMutation<T, Error, Partial<T>>({
                mutationFn: (item: Partial<T>) => this.apiWrapper.update(endpoint, id, item),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: [endpoint, id] });
                    queryClient.invalidateQueries({ queryKey: [endpoint] });
                }
            });
        };
    };

    useDelete(endpoint: string, id: string) {
        return () => {
            const queryClient = useQueryClient();

            return useMutation<void, Error, Partial<void>>({
                mutationFn: () => this.apiWrapper.delete(endpoint, id),
                onSuccess: () => {
                    queryClient.invalidateQueries();
                }
            });
        };
    };
};

export const useFetchByQuery = <T>(hooksWrapper: HooksWrapper<T>, endpoint: string, initialQuery: Record<string, any>) => {
    const [queryParams, setQueryParams] = useState(initialQuery);

    const result: UseQueryResult<Array<T>, Error> = useQuery<Array<T>, Error>({
        queryKey: [endpoint, queryParams],
        queryFn: (): Promise<Array<T>> => hooksWrapper.fetchByQuery(endpoint, queryParams),
        enabled: false
    });

    useEffect((): void => {
        if (Object.keys(queryParams).length > 0) {
            result.refetch();
        }
    }, [queryParams]);

    return {
        ...result,
        setQuery: setQueryParams,
        refetch: result.refetch
    };
};