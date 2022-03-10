import React, { useRef, useState, useContext, useEffect } from 'react';

type idCallbackType = (id: number) => void;

export interface StoreContextType<T> {
    registerElement: (callback: idCallbackType) => void;
    setElement: (id: number, value: T) => void;
    getElement: (id: number) => T;
}

export type GetNextElementsType<T> = (elements: T[]) => T[];

interface StoreProps<T> {
    children: React.ReactNode;
    elements: T[];
    setElements: (getNextElements: GetNextElementsType<T>) => void;
}

export const StoreContext = React.createContext({});

export function Store<T>({ children, elements, setElements, name }: StoreProps<T>) {
    const idxCounterRef = useRef(0);

    const registerElement = (callback: idCallbackType) => {
        callback(idxCounterRef.current);
        idxCounterRef.current += 1;
    };

    const setElement = (id: number, element: T) => {
        setElements(prevElements => {
            let nextElements = [...prevElements];
            if (id < 0) {
                return nextElements;
            } else if (id >= nextElements.length) {
                nextElements = [
                    ...nextElements,
                    ...Array(id - nextElements.length).fill({} as T)
                ];
            }
            nextElements[id] = element;
            return nextElements;
        });
    };

    const getElement = (id: number) => {
        if (id === -1 || id >= elements.length) {
            return null;
        }
        return elements[id];
    };

    return (
        <StoreContext.Provider value={{ registerElement: registerElement, setElement: setElement, getElement: getElement, name: name}}>
            { children}
        </StoreContext.Provider>
    );
};

export function useStoredElement<T>(initialEl: T): [T, (newEl: T) => void, boolean] {
    const idRef = useRef(-1);
    const elementCache = useRef(initialEl);
    
    const [ownElement, setOwnElement] = useState<T>(elementCache.current);  // Only used when there's no context
    const store = useContext(StoreContext);
    const usingContext = (
        'registerElement' in store
        && 'setElement' in store
        && 'getElement' in store
    );
    const {registerElement, setElement, getElement, name} = (
        usingContext ?
        store
        : {
            registerElement: (idCallback) => idCallback(0),
            setElement: (_id, el) => setOwnElement(el),
            getElement: (_id) => ownElement,
            name: "own store"
        }) as StoreContextType<T>;

    const getEl = () => {
        if (idRef.current === -1) {
            // Return the cache when the store isn't ready yet
            return elementCache.current;
        }
        return getElement(idRef.current);
    };
    const setEl = (newEl: T) => {
        if (newEl !== undefined) {
            // Store in cache for when the store wouldn't be ready yet
            elementCache.current = newEl;
            setElement(idRef.current, newEl);
        }
    };

    useEffect(() => {
        registerElement((assignedId) => {
            idRef.current = assignedId;
            setEl(elementCache.current);
        });
    }, []);
    
    return [getEl(), setEl, usingContext];
};
