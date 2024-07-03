import { createContext, useContext } from "react";

export const DataContext = createContext();

export function DataContextProvider(props) {
    const value = {};

    return (
        <DataContext.Provider value={value}>
            {props.children}
        </DataContext.Provider>
    );
}

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataContextProvider');
    }
    return context;
}