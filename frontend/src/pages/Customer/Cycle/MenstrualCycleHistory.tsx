import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {SearchInput} from '../../../components';
import DatePickerInput from '../../../components/feature/Filter/DatePickerInput';
import MenstrualCyclePopup from '../../../components/feature/Popup/MenstrualCyclePopup';
import SuccessPopup from '../../../components/feature/Popup/SuccessPopup';
import { useCycles } from '../../../api/hooks';
import { CycleData } from '../../../api/services';

const MenstrualCycleHistory: React.FC = () => {
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const [showCyclePopup, setShowCyclePopup] = useState(false);
    const [editRow, setEditRow] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const { cycles, createCycle, deleteCyclesForMonth } = useCycles();

    const formatDateToDMY = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const parseDate = (str: string) => {
        if (!str) return new Date('');
        const [day, month, year] = str.split('/').map(Number);
        if (!day || !month || !year) return new Date('');
        return new Date(year, month - 1, day);
    };

    const formatDate = (str: string) => {
        if (!str) return '';
        const [day, month, year] = str.split('/');
        if (!day || !month || !year) return str;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    };

    const transformedCycles = cycles.map((cycle: CycleData) => {
        const startDate = formatDateToDMY(cycle.cycleStartDate);
        const start = new Date(cycle.cycleStartDate);
        const periodEnd = new Date(start.getTime() + (cycle.periodDuration - 1) * 24 * 60 * 60 * 1000);
        
        const nextCycle = cycles
            .filter(c => new Date(c.cycleStartDate) > start)
            .sort((a, b) => new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime())[0];
        
        const cycleEndDate = nextCycle 
            ? new Date(new Date(nextCycle.cycleStartDate).getTime() - 24 * 60 * 60 * 1000)
            : null;
        
        const actualCycleDays = nextCycle
            ? Math.ceil((new Date(nextCycle.cycleStartDate).getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
            : null;

        return {
            id: cycle.id,
            startDate,
            endDate: cycleEndDate ? formatDateToDMY(cycleEndDate.toISOString()) : '',
            periodDays: `${startDate} - ${formatDateToDMY(periodEnd.toISOString())}`,
            cycle: actualCycleDays
        };
    });

    const filteredData = transformedCycles.filter((row: any) => {
        const searchMatch =
            search === '' ||
            row.startDate.includes(search) ||
            row.endDate.includes(search) ||
            row.periodDays.includes(search) ||
            row.cycle.toString().includes(search);
        
        const formattedStart = row.startDate;
        const formattedEnd = row.endDate;
        const searchLower = search.toLowerCase();
        const dateMatch =
            formattedStart.toLowerCase().includes(searchLower) ||
            formattedEnd.toLowerCase().includes(searchLower);
        
        const start = fromDate ? parseDate(row.startDate) >= fromDate : true;
        const end = toDate ? parseDate(row.endDate) <= toDate : true;
        return (searchMatch || dateMatch) && start && end;
    });

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(filteredData.map(row => row.id));
        } else {
            setSelected([]);
        }
    };

    const handleCheckboxChange = (id: number) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = async (ids?: number[]) => {
        const idsToDelete = ids && ids.length > 0 ? ids : selected;
        try {
            for (const id of idsToDelete) {
                const cycle = cycles.find(c => c.id === id);
                if (cycle) {
                    const cycleDate = new Date(cycle.cycleStartDate);
                    await deleteCyclesForMonth(cycleDate.getFullYear(), cycleDate.getMonth());
                }
            }
            setSelected([]);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1500);
        } catch (error) {
            console.error('Error deleting cycles:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-full">
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
                <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2 mb-2">
                    <span className="inline-block w-6 h-6 bg-pink-400 rounded-full mr-2"></span>
                    Lịch sử chu kỳ
                </h2>
                <div className="flex-1 flex gap-2 justify-end">
                    <SearchInput value={search} onChange={setSearch}
                                 placeholder="Search by dates, period days, cycle days..."/>
                    <DatePickerInput selected={fromDate} onChange={setFromDate} placeholder="From date"/>
                    <DatePickerInput selected={toDate} onChange={setToDate} placeholder="End date"/>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
                        <span className="inline-block w-4 h-4 bg-pink-400 rounded-full"></span>
                        Lịch sử chu kỳ
                    </h3>
                    <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-pink-500 font-semibold text-sm">
              <input type="checkbox" checked={selected.length === filteredData.length && filteredData.length > 0}
                     onChange={handleSelectAll} className="accent-pink-500"/>
                {selected.length} selected
            </span>
                        <button
                            className="text-sm px-3 py-1 rounded bg-red-100 text-red-600 font-semibold shadow hover:bg-red-200 transition disabled:opacity-50"
                            title="Delete"
                            onClick={() => handleDelete(selected)}
                            disabled={selected.length === 0}
                        >
                            Delete
                        </button>
                        <button className="text-xl text-pink-400 hover:text-pink-600" title="View"><i
                            className="fa fa-eye"></i></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm mt-2">
                        <thead>
                        <tr className="text-gray-500">
                            <th className="py-2 w-8"></th>
                            <th className="py-2 font-medium"><span className="inline-flex items-center gap-1"><i
                                className="fa fa-calendar text-pink-400"></i> Start day</span></th>
                            <th className="py-2 font-medium"><span className="inline-flex items-center gap-1"><i
                                className="fa fa-calendar text-pink-400"></i> End day</span></th>
                            <th className="py-2 font-medium">Period days</th>
                            <th className="py-2 font-medium">Cycle (days)</th>
                            <th className="py-2 w-24"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredData.map((row, idx) => (
                            <tr key={row.id}
                                className="text-center border-b last:border-b-0 hover:bg-pink-50 transition">
                                <td className="py-2">
                                    <input type="checkbox" checked={selected.includes(row.id)}
                                           onChange={() => handleCheckboxChange(row.id)} className="accent-pink-500"/>
                                </td>
                                <td className="py-2 font-semibold text-gray-700">{formatDate(row.startDate)}</td>
                                <td className="py-2 font-semibold text-gray-700">{formatDate(row.endDate)}</td>
                                <td className="py-2">{row.periodDays}</td>
                                <td className="py-2">{row.cycle || ''}</td>
                                <td className="py-2">
                                    <button
                                        className="bg-pink-400 text-white px-4 py-1 rounded font-semibold shadow hover:bg-pink-500 transition"
                                        onClick={() => {
                                            setEditRow(row);
                                            setShowCyclePopup(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <MenstrualCyclePopup
                open={showCyclePopup}
                onClose={() => {
                    setShowCyclePopup(false);
                    setEditRow(null);
                }}
                hideCycleLength={true}
                onSave={async (data) => {
                    setShowCyclePopup(false);
                    setEditRow(null);
                    
                    try {
                        const parseDMY = (str: string) => {
                            const [day, month, year] = str.split('/').map(Number);
                            return new Date(year, month - 1, day);
                        };
                        
                        const startDate = parseDMY(data.startDate);
                        const isoStartDate = startDate.toISOString().split('T')[0];
                        
                        if (!editRow || !editRow.id) {
                            await createCycle({
                                startDate: isoStartDate,
                                cycleLength: data.cycleLength,
                                periodDuration: data.duration
                            });
                        }
                        
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 1500);
                    } catch (error) {
                        console.error('Error saving cycle:', error);
                    }
                }}
                editRow={editRow}
            />
            {showSuccess && (
                <SuccessPopup
                    open={showSuccess}
                    onClose={() => setShowSuccess(false)}
                    message="Successfully"
                />
            )}
        </div>
    );
};


export default MenstrualCycleHistory;
