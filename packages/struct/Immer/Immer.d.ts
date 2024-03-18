declare function immer(baseState: any, thunk: any): any;
declare const initialState: {
    todos: {
        id: number;
        text: string;
        completed: boolean;
    }[];
    user: {
        todos: {
            id: number;
            text: string;
            completed: boolean;
        }[];
        user: number;
    };
};
declare const newState: any;
