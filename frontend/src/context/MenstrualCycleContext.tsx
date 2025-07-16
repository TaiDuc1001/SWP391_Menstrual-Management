import React, {createContext, useContext, useState} from 'react';

export interface MenstrualCycle {
    id: number;
    startDate: string;
    endDate: string;
    duration: number;
    cycle: number;
}

const initialCycles: MenstrualCycle[] = [
    {id: 1, startDate: '13/05/2024', endDate: '17/05/2024', duration: 5, cycle: 28},
    {id: 2, startDate: '16/04/2024', endDate: '19/04/2024', duration: 4, cycle: 29},
    {id: 3, startDate: '16/03/2024', endDate: '20/03/2024', duration: 5, cycle: 28},
    {id: 4, startDate: '15/02/2024', endDate: '19/02/2024', duration: 5, cycle: 28},
    {id: 5, startDate: '18/01/2024', endDate: '22/01/2024', duration: 5, cycle: 30},
];

interface MenstrualCycleContextType {
    cycles: MenstrualCycle[];
    setCycles: React.Dispatch<React.SetStateAction<MenstrualCycle[]>>;
}

const MenstrualCycleContext = createContext<MenstrualCycleContextType | undefined>(undefined);

export const useMenstrualCycles = () => {
    const ctx = useContext(MenstrualCycleContext);
    if (!ctx) throw new Error('useMenstrualCycles must be used within MenstrualCycleProvider');
    return ctx;
};

export const MenstrualCycleProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [cycles, setCycles] = useState<MenstrualCycle[]>(initialCycles);
    return (
        <MenstrualCycleContext.Provider value={{cycles, setCycles}}>
            {children}
        </MenstrualCycleContext.Provider>
    );
};

