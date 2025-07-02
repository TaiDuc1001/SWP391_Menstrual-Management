import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import MenstrualCyclePopup from '../../../components/feature/Popup/MenstrualCyclePopup';
import SpecialDayPopup from '../../../components/feature/Popup/SpecialDayPopup';
import SuccessPopup from '../../../components/feature/Popup/SuccessPopup';
import ReminderSettingsPopup from '../../../components/feature/Popup/ReminderSettingsPopup';
import DayNotePopup from '../../../components/feature/Popup/DayNotePopup';
import PredictCyclePopup from '../../../components/feature/Popup/PredictCyclePopup';
import PredictedCalendarPopup from '../../../components/feature/Popup/PredictedCalendarPopup';
import {MenstrualCycleProvider} from '../../../context/MenstrualCycleContext';
import { useCycles, useAIRecommendations } from '../../../api/hooks';
import { CycleData, CycleCreationRequest } from '../../../api/services';
import '../../../styles/pages/cycle-dashboard.css';

const MenstrualCycleDashboard: React.FC = () => {
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [showCyclePopup, setShowCyclePopup] = useState(false);
    const [showSpecialDayPopup, setShowSpecialDayPopup] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showReminderPopup, setShowReminderPopup] = useState(false);
    const [showDayNote, setShowDayNote] = useState(false);
    const [showPredictPopup, setShowPredictPopup] = useState(false);
    const [showPredictedCalendar, setShowPredictedCalendar] = useState(false);
    const [selectedPredictMonth, setSelectedPredictMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [currentCycleStartDate, setCurrentCycleStartDate] = useState<string>('');
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const location = useLocation();
    const navigate = useNavigate();
    const { cycles, loading: cyclesLoading, refetch, createCycle, deleteAllCycles } = useCycles();
    const { recommendations, healthConcerns, needsSTITesting, healthIssueDescription, loading: aiLoading, generateRecommendations } = useAIRecommendations();

    useEffect(() => {
        if (location.state && location.state.openCyclePopup) {
            setShowCyclePopup(true);
            navigate(location.pathname, {replace: true, state: {}});
        }
    }, [location, navigate]);

    const getDaysInMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const days: (number | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(day);
        return days;
    };
    const days = getDaysInMonth(currentMonth, currentYear);

    const getCycleAnnotation = (day: number | null) => {
        if (!day || !cycles || cycles.length === 0) return null;
        
        const currentDate = new Date(currentYear, currentMonth, day);
        const sortedCycles = [...cycles].sort((a, b) => new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime());
        
        const cycleIndex = sortedCycles.findIndex(cycle => {
            const cycleDate = new Date(cycle.cycleStartDate);
            return cycleDate.getDate() === currentDate.getDate() &&
                   cycleDate.getMonth() === currentDate.getMonth() &&
                   cycleDate.getFullYear() === currentDate.getFullYear();
        });
        
        if (cycleIndex !== -1) {
            return {
                type: 'start',
                cycleNumber: cycleIndex + 1
            };
        }
        
        return null;
    };

    const getDayTypeForCalendar = (day: number | null) => {
        if (!day) return '';
        
        const currentDate = new Date(currentYear, currentMonth, day);
        
        if (cycles && cycles.length > 0) {
            const sortedCycles = [...cycles].sort((a, b) => new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime());
            
            // Find cycle that matches current month and year
            const cycleForCurrentMonth = sortedCycles.find(cycle => {
                const cycleDate = new Date(cycle.cycleStartDate);
                return cycleDate.getFullYear() === currentYear && cycleDate.getMonth() === currentMonth;
            });
            
            if (cycleForCurrentMonth) {
                const cycleStart = new Date(cycleForCurrentMonth.cycleStartDate);
                const periodEnd = new Date(cycleStart.getTime() + (cycleForCurrentMonth.periodDuration - 1) * 24 * 60 * 60 * 1000);
                
                // Check if current date is within period days
                if (currentDate.getTime() >= cycleStart.getTime() && currentDate.getTime() <= periodEnd.getTime()) {
                    return 'period';
                }
            }
        }
        
        return '';
    };

    // Get user-specific storage key for symptoms
    const getCurrentUserId = (): string => {
        try {
            const userProfile = localStorage.getItem('userProfile');
            if (userProfile) {
                const parsed = JSON.parse(userProfile);
                return parsed.id?.toString() || 'default';
            }
        } catch (error) {
            console.error('Error getting user ID:', error);
        }
        return 'default';
    };

    const getSymptomsStorageKey = (): string => {
        const userId = getCurrentUserId();
        return `menstrual_symptoms_${userId}`;
    };

    const [symptoms, setSymptoms] = useState<{
        [key: string]: { symptom: string; period: string; flow: string }
    }>(() => {
        const storageKey = getSymptomsStorageKey();
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : {};
    });

    const [dayNotes, setDayNotes] = useState<{
        [key: string]: string
    }>(() => {
        const saved = localStorage.getItem('menstrual_day_notes');
        return saved ? JSON.parse(saved) : {};
    });

    const [specialDays, setSpecialDays] = useState<{
        [key: string]: { ovulationDays: string; fertileWindow: string }
    }>(() => {
        const saved = localStorage.getItem('menstrual_special_days');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        const storageKey = getSymptomsStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(symptoms));
    }, [symptoms]);

    useEffect(() => {
        localStorage.setItem('menstrual_day_notes', JSON.stringify(dayNotes));
    }, [dayNotes]);

    useEffect(() => {
        localStorage.setItem('menstrual_special_days', JSON.stringify(specialDays));
    }, [specialDays]);

    useEffect(() => {
        // Clear period days for June 2025 (month 5, since months are 0-indexed)
        const targetYear = 2025;
        const targetMonth = 5; // June
        const daysInJune = getDaysInMonth(targetMonth, targetYear);
        
        const newSymptoms = { ...symptoms };
        let hasChanges = false;
        
        daysInJune.forEach(day => {
            if (day) {
                const dayKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const symptomData = newSymptoms[dayKey];
                if (symptomData && symptomData.period === 'Menstruating' && symptomData.flow === 'Heavy') {
                    delete newSymptoms[dayKey];
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            setSymptoms(newSymptoms);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1200);
        }
    }, []); // Empty dependency array to run only once on mount

    useEffect(() => {
        console.log('Cycles updated in dashboard:', cycles);
        console.log('Current month/year:', currentMonth + 1, currentYear);
        
        // Force calendar re-render when cycles change
        if (cycles.length > 0) {
            const currentMonthCycles = cycles.filter(cycle => {
                const cycleDate = new Date(cycle.cycleStartDate);
                return cycleDate.getFullYear() === currentYear && cycleDate.getMonth() === currentMonth;
            });
            console.log('Cycles for current month:', currentMonthCycles);
        }
    }, [cycles, currentMonth, currentYear]);

    const [hasGeneratedRecommendations, setHasGeneratedRecommendations] = useState(false);
    
    useEffect(() => {
        if (cycles.length > 0 && !hasGeneratedRecommendations && !aiLoading) {
            generateRecommendations(cycles, symptoms, false);
            setHasGeneratedRecommendations(true);
        }
    }, [cycles.length, hasGeneratedRecommendations, aiLoading]);
    
    const handleGenerateRecommendations = () => {
        if (cycles.length > 0) {
            console.log('Refresh button clicked - cycles data:', cycles);
            console.log('Refresh button clicked - symptoms from localStorage:', symptoms);
            generateRecommendations(cycles, symptoms, true);
        }
    };

    const handleClearAllCycles = async () => {
        if (window.confirm('Are you sure you want to delete all cycle declarations? This action cannot be undone.')) {
            try {
                await deleteAllCycles();
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 1200);
            } catch (error) {
                console.error('Error deleting cycles:', error);
            }
        }
    };

    const historyData = cycles;

    return (
        <div className="p-3 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen w-full">
            <div className="flex w-full">
                <main className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-extrabold text-purple-700 flex items-center gap-2">
                            <span
                                className="inline-block w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                            My Cycle
                        </h2>
                        <div className="flex gap-2">
                            <button
                                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                                onClick={() => setShowPredictPopup(true)}>Predict Cycle
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div
                            className="col-span-2 bg-white rounded-2xl shadow p-4 flex flex-col border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    <span
                                        className="inline-block w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                                    Cycle calendar for {currentMonth + 1}/{currentYear}
                                </h3>
                                <div className="flex gap-2">
                                    {(currentYear < now.getFullYear() || (currentYear === now.getFullYear() && currentMonth <= now.getMonth())) && (
                                        <button
                                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                                            onClick={() => setShowCyclePopup(true)}>Declare Cycle
                                        </button>
                                    )}
                                    <button onClick={() => setCurrentMonth(m => m === 0 ? 11 : m - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600 transition-all duration-200 hover:scale-105">{'<'}</button>
                                    <button onClick={() => setCurrentMonth(m => m === 11 ? 0 : m + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600 transition-all duration-200 hover:scale-105">{'>'}</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-3" key={`calendar-${currentMonth}-${currentYear}-${cycles?.length || 0}-${Date.now()}`}>
                                {weekDays.map((wd, idx) => (
                                    <div key={idx}
                                         className="text-center text-xs font-medium text-gray-700 py-1 bg-gradient-to-b from-gray-50 to-gray-100 rounded shadow-sm">{wd}</div>
                                ))}
                                {days.map((day, idx) => {
                                    let type = '';
                                    if (cycles && cycles.length > 0) {
                                        type = getDayTypeForCalendar(day);
                                    }
                                    let hasSymptom = false;
                                    let hasNote = false;
                                    if (day) {
                                        const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const symptomData = symptoms[dayKey];
                                        hasSymptom = !!(symptomData && symptomData.symptom && symptomData.symptom !== 'None');
                                        hasNote = !!(dayNotes[dayKey] && dayNotes[dayKey].trim() !== '');
                                    }
                                    let style = "cycle-regular-day";
                                    if (type === 'period') style = "cycle-period-day";
                                    
                                    if (hasSymptom) style += ' cycle-symptom-border';
                                    if (hasNote) style += ' cycle-note-indicator';
                                    
                                    return (
                                        <div key={idx} className="flex justify-center items-center h-10">
                                            {day ? (
                                                <div className="relative">
                                                    <div
                                                        className={style}
                                                        onClick={() => {
                                                            if (day) {
                                                                setSelectedDay(day);
                                                                setShowDayNote(true);
                                                            }
                                                        }}
                                                    >
                                                        {day}
                                                    </div>
                                                </div>
                                            ) : <div className="w-10 h-10"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 mt-2 text-xs items-center flex-wrap">
                                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{backgroundColor: '#ff5047'}}></span> Period days (declared)
                                </div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-indigo-400 rounded-full inline-block bg-white"></span> Has symptoms
                                </div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block bg-gray-200 relative" style={{fontSize: '8px'}}>📝</span> Has note
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 rounded-2xl shadow p-4 flex flex-col gap-2">
                            <h3 className="font-semibold text-lg text-purple-800 mb-2">Predictions & Analysis</h3>
                            <div className="flex flex-col gap-1 text-xs">
                                <div className="flex items-center gap-1"><span
                                    className="w-3 h-3 bg-gradient-to-br from-red-600 via-red-500 to-pink-500 rounded-full inline-block"></span> Next
                                    period expected <span
                                        className="ml-auto font-semibold text-gray-800">12/06/2024</span></div>
                                <div className="flex items-center gap-1"><span
                                    className="w-3 h-3 bg-blue-400 rounded-full inline-block"></span> Cycle
                                    alert <span className="ml-auto font-semibold text-gray-800">Normal</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white rounded-2xl shadow p-4 col-span-1">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    <span
                                        className="inline-block w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                                    Cycle history
                                </h3>
                                <a
                                    href="/menstrual-cycles/all"
                                    className="text-purple-600 text-xs font-semibold hover:underline"
                                    onClick={e => {
                                        e.preventDefault();
                                        navigate('/customer/menstrual-cycles/all');
                                    }}
                                >
                                    View all
                                </a>
                            </div>
                            <div className={historyData.length > 3 ? "overflow-y-auto max-h-32 transition-all" : ""}
                                 id="cycle-history-body">
                                <table className="w-full text-xs mt-2">
                                    <thead>
                                    <tr className="text-gray-600">
                                        <th className="py-1 font-medium">Start</th>
                                        <th className="py-1 font-medium">End</th>
                                        <th className="py-1 font-medium">Period days</th>
                                        <th className="py-1 font-medium">Cycle (days)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((row: CycleData, idx: number) => (
                                        <tr key={idx}
                                            className="text-center border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                                            <td className="py-1">
                                                {row.cycleStartDate}
                                            </td>
                                            <td className="py-1">
                                                {row.cycleStartDate ? new Date(new Date(row.cycleStartDate).getTime() + row.periodDuration * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : ''}
                                            </td>
                                            <td className="py-1">
                                                {row.periodDuration}
                                            </td>
                                            <td className="py-1">
                                                {row.cycleLength}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div
                            className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 rounded-2xl shadow p-4 col-span-2 flex flex-col gap-2">
                            <h3 className="font-semibold text-lg text-purple-800 mb-2 flex items-center gap-2">
                                <span
                                    className="inline-block w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                                AI Recommendations
                                {aiLoading && (
                                    <div className="ml-2 w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                                )}
                                <button
                                    onClick={handleGenerateRecommendations}
                                    disabled={aiLoading}
                                    className="ml-auto text-xs bg-white border border-purple-400 text-purple-600 px-2 py-1 rounded hover:bg-purple-50 transition-all duration-200 disabled:opacity-50"
                                >
                                    Refresh
                                </button>
                            </h3>
                            <ul className="list-disc pl-4 text-xs text-gray-800 flex flex-col gap-1">
                                {recommendations.length > 0 ? recommendations.map((recommendation, index) => (
                                    <li key={index} dangerouslySetInnerHTML={{ __html: recommendation }}></li>
                                )) : (
                                    <>
                                        <li><span className="font-semibold text-pink-600">Cycle trend:</span> Regular and
                                            stable. <span className="font-semibold text-pink-600">Suggestion:</span> Keep
                                            maintaining healthy lifestyle habits!
                                        </li>
                                        <li><span className="font-semibold text-yellow-600">Reminder:</span> If you notice
                                            irregular periods, consider <span
                                                className="underline">regular gynecological check-ups</span>.
                                        </li>
                                        <li><span className="font-semibold text-red-500">Note:</span> If stress persists,
                                            try to spend more time relaxing and resting.
                                        </li>
                                        <li><span
                                            className="font-semibold text-green-600">Food & exercise suggestions:</span> Eat
                                            more fruits, green vegetables and do gentle yoga during menstruation to reduce fatigue.
                                        </li>
                                    </>
                                )}
                            </ul>
                            {recommendations.length === 0 && (
                                <div className="mt-2 text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                                    <span className="font-semibold">Note:</span> AI recommendations are temporarily unavailable. Showing default health tips.
                                </div>
                            )}
                            
                            {/* Health Concerns Alert */}
                            {healthConcerns && (
                                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg shadow-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-orange-500 text-sm flex-shrink-0">⚠️</span>
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold text-orange-700 mb-1">Health Concern Detected</div>
                                            {healthIssueDescription && (
                                                <div className="text-xs text-orange-600 mt-1">{healthIssueDescription}</div>
                                            )}
                                            {needsSTITesting && (
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => navigate('/customer/sti-tests/packages')}
                                                        className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                                                    >
                                                        🩺 Book STI Testing
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <MenstrualCyclePopup
                        open={showCyclePopup}
                        onClose={() => setShowCyclePopup(false)}
                        isPreviousMonth={currentYear < now.getFullYear() || (currentYear === now.getFullYear() && currentMonth <= now.getMonth())}
                        defaultMonth={currentMonth}
                        defaultYear={currentYear}
                        onSave={async (data) => {
                            try {
                                const [day, month, year] = data.startDate.split('/');
                                const formattedStartDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                setCurrentCycleStartDate(formattedStartDate);
                                
                                await createCycle({
                                    startDate: formattedStartDate,
                                    cycleLength: data.cycleLength,
                                    periodDuration: data.duration
                                });
                                
                                // Force re-fetch cycles to ensure state consistency
                                await refetch();
                                
                                setShowCyclePopup(false);
                                setShowSuccess(true);
                                setTimeout(() => setShowSuccess(false), 1200);
                            } catch (error) {
                                console.error('Error creating cycle:', error);
                            }
                        }}
                    />
                    <SpecialDayPopup
                        open={showSpecialDayPopup}
                        onClose={() => setShowSpecialDayPopup(false)}
                        defaultMonth={currentMonth}
                        defaultYear={currentYear}
                        onSave={(data) => {
                            if (currentCycleStartDate) {
                                setSpecialDays(prev => ({
                                    ...prev,
                                    [currentCycleStartDate]: {
                                        ovulationDays: data.ovulationDays,
                                        fertileWindow: data.fertileWindow
                                    }
                                }));
                            }
                            
                            setShowSpecialDayPopup(false);
                            setShowSuccess(true);
                            setTimeout(() => setShowSuccess(false), 1200);
                        }}
                    />
                    <ReminderSettingsPopup
                        open={showReminderPopup}
                        onClose={() => setShowReminderPopup(false)}
                        onSave={() => {
                            setShowReminderPopup(false);
                            setShowSuccess(true);
                            setTimeout(() => setShowSuccess(false), 1200);
                        }}
                    />
                    <DayNotePopup
                        open={showDayNote}
                        onClose={() => setShowDayNote(false)} 
                        onSave={(data) => {
                            setShowDayNote(false);
                            setShowSuccess(true);
                            if (selectedDay) {
                                const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                                
                                // Update symptoms
                                if (data.symptom === 'None') {
                                    setSymptoms(prev => {
                                        const newState = {...prev};
                                        delete newState[key];
                                        return newState;
                                    });
                                } else {
                                    setSymptoms(prev => ({...prev, [key]: {symptom: data.symptom, period: data.period, flow: data.flow}}));
                                }
                                
                                // Update notes
                                if (data.note.trim() === '') {
                                    setDayNotes(prev => {
                                        const newState = {...prev};
                                        delete newState[key];
                                        return newState;
                                    });
                                } else {
                                    setDayNotes(prev => ({...prev, [key]: data.note}));
                                }
                                
                                setHasGeneratedRecommendations(false);
                            }
                            setTimeout(() => setShowSuccess(false), 1200);
                        }}
                        defaultValue={(() => {
                            if (selectedDay) {
                                const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                                return symptoms[dayKey];
                            }
                            return undefined;
                        })()}
                        defaultNote={(() => {
                            if (selectedDay) {
                                const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                                return dayNotes[dayKey] || '';
                            }
                            return '';
                        })()}
                    />
                    <PredictCyclePopup
                        open={showPredictPopup}
                        onClose={() => setShowPredictPopup(false)}
                        onSave={(selectedMonth) => {
                            setSelectedPredictMonth(selectedMonth);
                            setShowPredictPopup(false);
                            setShowPredictedCalendar(true);
                        }}
                    />
                    <PredictedCalendarPopup
                        open={showPredictedCalendar}
                        onClose={() => {
                            setShowPredictedCalendar(false);
                            setShowPredictPopup(true);
                        }}
                        selectedMonth={selectedPredictMonth}
                    />
                    <SuccessPopup open={showSuccess} onClose={() => setShowSuccess(false)} message="Successfully!"/>
                </main>
            </div>
        </div>
    );
};

export default function MenstrualCyclesWithProvider() {
    return (
        <MenstrualCycleProvider>
            <MenstrualCycleDashboard/>
        </MenstrualCycleProvider>
    );
}