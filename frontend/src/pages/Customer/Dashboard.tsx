import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import plusIcon from '../../assets/icons/plus-white.svg';
import calendarIcon from '../../assets/icons/calendar.svg';
import hospitalIcon from '../../assets/icons/hospital.svg';
import bloodIcon from '../../assets/icons/blood.svg';
import strawberyyIcon from '../../assets/icons/strawberyy.svg';
import angryIcon from '../../assets/icons/angry.svg';
import ReminderSettingsPopup from '../../components/feature/Popup/ReminderSettingsPopup';
import SuccessPopup from '../../components/feature/Popup/SuccessPopup';
import api from '../../api/axios';
import {Line, Bar} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    BarElement,
    Title,
    Tooltip
} from 'chart.js';
import { usePublicBlogs } from '../../api/hooks';
import { SimpleBlogDTO } from '../../api/services/blogService';
import '../../styles/pages/cycle-dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { blogs } = usePublicBlogs();
    const [userName, setUserName] = useState('');
    const [cycleStart, setCycleStart] = useState('');
    const [ovulationDate, setOvulationDate] = useState('');
    const [daysToOvulation, setDaysToOvulation] = useState(0);
    const [cycleStatus, setCycleStatus] = useState('');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [examinations, setExaminations] = useState<any[]>([]);
    const [cycles, setCycles] = useState<any[]>([]);
    const [showReminderPopup, setShowReminderPopup] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [recentBlogs, setRecentBlogs] = useState<SimpleBlogDTO[]>([]);
    const [currentChart, setCurrentChart] = useState<'cycle' | 'menstruation'>('cycle');

    // Function to fetch appointments data
    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            console.log('Appointments raw data:', res.data);
            // Get 3 most recent appointments (excluding cancelled ones)
            const recentAppointments = res.data
                .filter((a: any) => {
                    // Filter out cancelled appointments only
                    return a.appointmentStatus !== 'CANCELLED';
                })
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3); // Take only first 3 most recent appointments
            
            console.log('Recent appointments:', recentAppointments);
            
            // Fetch doctor ratings for each appointment
            const appointmentsWithRatings = await Promise.all(
                recentAppointments.map(async (a: any) => {
                    try {
                        const ratingResponse = await api.get(`/appointments/doctor/${a.doctorId}/average-rating`);
                        const { averageRating } = ratingResponse.data;
                        return {
                            id: a.id,
                            name: a.doctorName,
                            date: new Date(a.date).toLocaleDateString('en-GB'),
                            time: a.timeRange || a.slot || '',
                            avatar: '',
                            rating: averageRating ? Math.round(averageRating * 10) / 10 : 0,
                            status: a.appointmentStatus
                        };
                    } catch (error) {
                        // If rating fetch fails, use default rating
                        return {
                            id: a.id,
                            name: a.doctorName,
                            date: new Date(a.date).toLocaleDateString('en-GB'),
                            time: a.timeRange || a.slot || '',
                            avatar: '',
                            rating: 0,
                            status: a.appointmentStatus
                        };
                    }
                })
            );
            
            setAppointments(appointmentsWithRatings);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments([]);
        }
    };

    const fetchExaminations = async () => {
        try {
            const res = await api.get('/examinations');
            console.log('Examinations raw data:', res.data);
            
            const recentExaminations = res.data
                .filter((e: any) => {
                    return e.examinationStatus !== 'CANCELLED';
                })
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3)
                .map((e: any) => ({
                    id: e.id,
                    name: e.panelName || e.name || 'Health Screening',
                    date: new Date(e.date).toLocaleDateString('en-GB'),
                    time: e.timeRange || 'TBD',
                    place: e.place || e.location || 'Medical Center',
                    status: e.examinationStatus || 'Scheduled'
                }));
            
            setExaminations(recentExaminations);
        } catch (error) {
            console.error('Error fetching examinations:', error);
            setExaminations([]);
        }
    };

    useEffect(() => {
        let isMounted = true; // Flag to prevent setState after unmount
        
        setUserName('Thiên An');
        // Fetch cycle data with error handling
        api.get('/cycles/closest')
            .then(res => {
                if (!isMounted) return; // Prevent setState if component unmounted
                console.log('Cycle data received:', res.data);
                const cycle = res.data;
                setCycleStart(cycle.cycleStartDate || '');
                setCycleStatus(cycle.status || '');
                setOvulationDate(cycle.ovulationDate || '');
                setDaysToOvulation(cycle.daysToOvulation || 0);
            })
            .catch(error => {
                if (!isMounted) return;
                console.error('Error fetching cycle data:', error);
                // Set default values if API fails
                setCycleStart('');
                setCycleStatus('No data');
                setOvulationDate('');
                setDaysToOvulation(0);
            });
        // Fetch appointments with error handling
        fetchAppointments();
        fetchExaminations();

        // Fetch all cycles data for prediction with error handling
        api.get('/cycles')
            .then(res => {
                if (!isMounted) return;
                console.log('All cycles data received:', res.data);
                setCycles(res.data);
            })
            .catch(error => {
                if (!isMounted) return;
                console.error('Error fetching cycles data:', error);
                setCycles([]);
            });
            
        // Cleanup function to prevent setState after unmount
        return () => {
            isMounted = false;
        };
    }, []);

    // Refresh appointments when page becomes visible (e.g., returning from booking)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchAppointments();
                fetchExaminations();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (cycles.length > 0) {
            const sorted = [...cycles].sort((a, b) => new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime());
            const last = sorted[sorted.length - 1];
            const avgCycle = Math.round(sorted.reduce((acc, c) => acc + (c.cycleLength || 28), 0) / sorted.length);
            const avgPeriod = Math.round(sorted.reduce((acc, c) => acc + (c.periodDuration || 5), 0) / sorted.length);
            const lastStart = new Date(last.cycleStartDate);
            const nextPeriod = new Date(lastStart);
            nextPeriod.setDate(lastStart.getDate() + avgCycle);
            const ovulation = new Date(lastStart);
            ovulation.setDate(lastStart.getDate() + avgCycle - 14);
            const fertileStart = new Date(ovulation);
            fertileStart.setDate(ovulation.getDate() - 4);
            const fertileEnd = new Date(ovulation);
            fertileEnd.setDate(ovulation.getDate() + 1);
            setPrediction({
                nextPeriod: nextPeriod.toLocaleDateString('en-GB'),
                ovulation: ovulation.toLocaleDateString('en-GB'),
                fertileWindow: `${fertileStart.toLocaleDateString('en-GB')} - ${fertileEnd.toLocaleDateString('en-GB')}`,
                avgCycle,
                avgPeriod
            });
        }
    }, [cycles]);

    useEffect(() => {
        // Get 3 most recent blogs for health tips
        if (blogs.length > 0) {
            const sortedBlogs = [...blogs]
                .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
                .slice(0, 3);
            setRecentBlogs(sortedBlogs);
        }
    }, [blogs]);

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    useEffect(() => {
        // Log recent blogs with formatted dates
        console.log('Recent blogs:', recentBlogs);
    }, [recentBlogs]);

    const chartData = cycles.length > 0 ? (() => {
        const sortedCycles = [...cycles]
            .sort((a, b) => new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime());

        const cyclesWithActualDays = sortedCycles.map((cycle, index) => {
            const start = new Date(cycle.cycleStartDate);
            const nextCycle = sortedCycles[index + 1];
            
            const actualCycleDays = nextCycle
                ? Math.ceil((new Date(nextCycle.cycleStartDate).getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
                : null;

            return {
                ...cycle,
                actualCycleDays
            };
        }).filter(c => c.actualCycleDays && c.actualCycleDays > 0);

        const displayCycles = cyclesWithActualDays.slice(-6);
        const labels = displayCycles.map((_, index) => `Cycle ${index + 1}`);
        const cycleLengths = displayCycles.map(c => c.actualCycleDays);

        return {
            labels,
            datasets: [
                {
                    label: 'Cycle length (days)',
                    data: cycleLengths,
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    tension: 0.4,
                    pointBackgroundColor: '#ec4899',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true
                }
            ]
        };
    })() : {
        labels: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5'],
        datasets: [
            {
                label: 'Cycle length (days)',
                data: [28, 27, 30, 26, 29],
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#ec4899',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true
            }
        ]
    };

    const getCurrentUserId = (): string => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsedInfo = JSON.parse(userInfo);
                return parsedInfo.id?.toString() || 'default';
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

    const getDetailedSymptomsStorageKey = (): string => {
        const userId = getCurrentUserId();
        return `menstrual_symptoms_detailed_${userId}`;
    };

    const getMenstruationPeriodsFromSymptoms = () => {
        const symptomsKey = getSymptomsStorageKey();
        const storedSymptoms = localStorage.getItem(symptomsKey);
        const menstruationData: { [key: string]: number } = {};
        
        if (storedSymptoms) {
            try {
                const symptoms = JSON.parse(storedSymptoms);
                const menstruationPeriods: { [key: string]: Set<string> } = {};
                
                Object.entries(symptoms).forEach(([dateKey, symptomData]: [string, any]) => {
                    if (symptomData.period === 'Menstruating') {
                        const date = new Date(dateKey);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        
                        if (!menstruationPeriods[monthKey]) {
                            menstruationPeriods[monthKey] = new Set();
                        }
                        menstruationPeriods[monthKey].add(dateKey);
                    }
                });
                
                Object.entries(menstruationPeriods).forEach(([monthKey, dates]) => {
                    menstruationData[monthKey] = dates.size;
                });
            } catch (error) {
                console.error('Error parsing symptoms data:', error);
            }
        }
        
        return menstruationData;
    };

    const getMenstruationPeriodsFromCycles = () => {
        const menstruationData: { [key: string]: number } = {};
        
        cycles.forEach((cycle, index) => {
            const startDate = new Date(cycle.cycleStartDate);
            const periodDuration = cycle.periodDuration || 5;
            
            const monthKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
            menstruationData[`Cycle ${index + 1}`] = periodDuration;
        });
        
        return menstruationData;
    };

    const getCombinedMenstruationData = () => {
        const symptomsData = getMenstruationPeriodsFromSymptoms();
        const cyclesData = getMenstruationPeriodsFromCycles();
        
        return Object.keys(cyclesData).length > 0 ? cyclesData : symptomsData;
    };

    const menstruationChartData = (() => {
        const combinedData = getCombinedMenstruationData();
        const labels = Object.keys(combinedData);
        const data = Object.values(combinedData);

        if (labels.length === 0) {
            return {
                labels: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6'],
                datasets: [
                    {
                        label: 'Menstrual days',
                        data: [5, 4, 6, 3, 5, 4],
                        backgroundColor: '#ff5a7a',
                        borderColor: '#ff5a7a',
                        borderWidth: 0,
                        borderRadius: 4,
                        borderSkipped: false
                    }
                ]
            };
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Menstrual days',
                    data,
                    backgroundColor: '#ff5a7a',
                    borderColor: '#ff5a7a',
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        };
    })();

    const menstruationChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#ff5a7a',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context: any) {
                        return `Menstrual days: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 7,
                grid: {
                    color: 'rgba(156, 163, 175, 0.3)'
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    },
                    stepSize: 1,
                    callback: function(value: any) {
                        return `${value} days`;
                    }
                },
                title: {
                    display: true,
                    text: 'Days',
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            }
        },
        elements: {
            bar: {
                borderWidth: 0
            }
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(236, 72, 153, 0.9)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#ec4899',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: false,
                min: 20,
                max: 35,
                grid: {
                    color: 'rgba(156, 163, 175, 0.3)'
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 12
                    },
                    callback: function(value: any) {
                        return value;
                    }
                },
                title: {
                    display: true,
                    text: 'Days',
                    color: '#9ca3af',
                    font: {
                        size: 12
                    }
                }
            }
        },
        elements: {
            point: {
                hoverBackgroundColor: '#ec4899'
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const
        }
    };



    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div
                className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow p-6 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-1">Hello, {userName} <span
                        className="inline-block">👋</span></h2>
                    <p className="text-gray-500">How are you feeling today? Let's do a quick health check & update your cycle calendar!</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                        className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
                        onClick={() => navigate('/customer/menstrual-cycles', {state: {openCyclePopup: true}})}
                    >
                        <img src={plusIcon} alt="New" className="w-4 h-4"/> New menstrual cycle
                    </button>
                    <button
                        className="bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
                        onClick={() => navigate('/customer/appointments/book')}
                    >
                        <img src={calendarIcon} alt="Calendar" className="w-4 h-4"/> Book an appointment
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3 h-full relative">
                    <div className="flex items-center gap-2 text-pink-500 font-semibold">
                        <img src={calendarIcon} alt="Calendar" className="w-5 h-5"/> Cycle calendar
                    </div>
                    <button 
                        className="chart-view-cycle-btn"
                        onClick={() => navigate('/customer/cycle-chart')}>
                        View Cycle
                    </button>
                    <div className="text-gray-500 text-sm">Today: <span
                        className="text-pink-600 font-bold">{new Date().toLocaleDateString('en-GB')}</span></div>
                    <div className="bg-pink-100 rounded-xl p-4 flex flex-col items-center">
                        <div className="text-2xl font-bold text-pink-600 mb-1">{cycleStatus}</div>
                        <div className="text-2xl flex gap-2">
                            {(() => {
                                const today = new Date();
                                const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                const symptomsKey = getSymptomsStorageKey();
                                const storedSymptoms = localStorage.getItem(symptomsKey);
                                const detailedStorageKey = getDetailedSymptomsStorageKey();
                                const detailedSaved = localStorage.getItem(detailedStorageKey);
                                const dayNotesSaved = localStorage.getItem('menstrual_day_notes');
                                const icons = [];
                                
                                let hasSymptoms = false;
                                let hasFlow = false;
                                let hasNote = false;
                                
                                if (storedSymptoms) {
                                    try {
                                        const symptoms = JSON.parse(storedSymptoms);
                                        const todaySymptom = symptoms[todayKey];
                                        
                                        if (todaySymptom) {
                                            if (todaySymptom.symptom && todaySymptom.symptom !== 'None') {
                                                hasSymptoms = true;
                                            }
                                            if (todaySymptom.period === 'Menstruating' || todaySymptom.flow) {
                                                hasFlow = true;
                                            }
                                        }
                                    } catch (error) {
                                        console.error('Error parsing symptoms:', error);
                                    }
                                }
                                
                                if (detailedSaved) {
                                    try {
                                        const detailedData = JSON.parse(detailedSaved);
                                        const dayDetailedData = detailedData[todayKey];
                                        
                                        if (dayDetailedData) {
                                            if (dayDetailedData.symptoms && dayDetailedData.symptoms.length > 0) {
                                                hasSymptoms = true;
                                            }
                                            if (dayDetailedData.periods || dayDetailedData.flowLevel > 0) {
                                                hasFlow = true;
                                            }
                                        }
                                    } catch (error) {
                                        console.error('Error parsing detailed symptoms:', error);
                                    }
                                }
                                
                                if (dayNotesSaved) {
                                    try {
                                        const dayNotes = JSON.parse(dayNotesSaved);
                                        if (dayNotes[todayKey] && dayNotes[todayKey].trim() !== '') {
                                            hasNote = true;
                                        }
                                    } catch (error) {
                                        console.error('Error parsing day notes:', error);
                                    }
                                }
                                
                                if (hasNote) {
                                    icons.push(<img key="angry" src={angryIcon} alt="has note" className="w-7 h-7 inline"/>);
                                }
                                
                                if (hasFlow) {
                                    icons.push(<img key="blood" src={bloodIcon} alt="menstruating" className="w-7 h-7 inline"/>);
                                }
                                
                                if (hasSymptoms) {
                                    icons.push(<img key="strawberry" src={strawberyyIcon} alt="has symptoms" className="w-7 h-7 inline"/>);
                                }
                                
                                if (icons.length === 0) {
                                    icons.push(<img key="default" src={strawberyyIcon} alt="default" className="w-7 h-7 inline"/>);
                                }
                                
                                return icons;
                            })()}
                        </div>
                    </div>
                    <div className="flex justify-end items-center mt-2">
                        <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium"
                                onClick={() => navigate('/customer/menstrual-cycles')}>View Calendar
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 w-full">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">
                                {currentChart === 'cycle' ? 'Cycle Length' : 'Menstrual Period Duration'}
                            </h3>
                        </div>
                        <div className="relative w-full h-96 mb-6">
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
                                <button 
                                    onClick={() => setCurrentChart(currentChart === 'cycle' ? 'menstruation' : 'cycle')}
                                    className="p-2 rounded-full hover:bg-pink-100 transition-colors shadow bg-white border border-pink-200"
                                >
                                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
                                <button 
                                    onClick={() => setCurrentChart(currentChart === 'cycle' ? 'menstruation' : 'cycle')}
                                    className="p-2 rounded-full hover:bg-pink-100 transition-colors shadow bg-white border border-pink-200"
                                >
                                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="w-full h-full px-12">
                                {currentChart === 'cycle' ? (
                                    <Line data={chartData} options={chartOptions}/>
                                ) : (
                                    <Bar data={menstruationChartData} options={menstruationChartOptions}/>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`inline-block w-4 h-4 rounded-full ${currentChart === 'cycle' ? 'bg-pink-500' : 'bg-red-400'}`}></span>
                            <span className="text-gray-700 text-sm font-medium">
                                {currentChart === 'cycle' ? 'Cycle length (days)' : 'Menstrual days'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-pink-500 font-semibold">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16.5C6.41 16.5 3.5 13.59 3.5 10C3.5 6.41 6.41 3.5 10 3.5C13.59 3.5 16.5 6.41 16.5 10C16.5 13.59 13.59 16.5 10 16.5ZM10.75 7H9.25V11.25L13 13.27L13.75 12.04L10.75 10.32V7Z" fill="#000"/>
                            </svg>
                            Tips for Health
                        </div>
                        <div className="flex flex-col gap-3">
                            {recentBlogs.map((blog) => (
                                <div key={blog.id} className="flex items-start gap-3 cursor-pointer hover:bg-pink-50 p-3 rounded-lg transition-colors border border-gray-100" onClick={() => navigate('/customer/health-tips')}>
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.447.894L10 15.118l-4.553 1.776A1 1 0 014 16V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 2a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-800 text-sm leading-5 mb-1 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                                            {blog.title}
                                        </h4>
                                        <p className="text-gray-500 text-xs">
                                            {formatDate(blog.publishDate)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentBlogs.length === 0 && (
                                <div className="text-gray-400 text-sm text-center py-4 border border-gray-100 rounded-lg">
                                    No articles available
                                </div>
                            )}
                        </div>
                        <button 
                            className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium mt-2"
                            onClick={() => navigate('/customer/health-tips')}
                        >
                            View all Tips
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-pink-500 font-semibold">
                            <img src={calendarIcon} alt="Calendar" className="w-5 h-5"/> Recent examinations
                        </div>
                        <div className="flex flex-col gap-2">
                            {examinations.map((e, idx) => (
                                <div key={`examination-${e.name}-${idx}`} className="flex flex-col gap-1 bg-pink-50 rounded-lg p-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-pink-600">{e.name}</span>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                e.status === 'SCHEDULED' ? 'bg-blue-200 text-blue-700' :
                                                e.status === 'COMPLETED' ? 'bg-green-200 text-green-700' :
                                                e.status === 'IN_PROGRESS' ? 'bg-yellow-200 text-yellow-700' :
                                                'bg-gray-200 text-gray-700'
                                            }`}>{e.status}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{e.place} | {e.date} - {e.time}</div>
                                </div>
                            ))}
                            {examinations.length === 0 && (
                                <div className="text-gray-400 text-sm">No examination appointments</div>
                            )}
                        </div>
                        <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium mt-2"
                                onClick={() => navigate('/customer/sti-tests')}>View Tests
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-pink-500 font-semibold">
                            <img src={hospitalIcon} alt="Doctor" className="w-5 h-5"/> Recent appointments
                        </div>
                        <div className="flex flex-col gap-2">
                            {appointments.map((a) => (
                                <div key={a.id} className="flex flex-col gap-1 bg-pink-50 rounded-lg p-2">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-pink-500">{a.name?.split(' ')[1]?.[0] || 'D'}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">{a.name} <span
                                                    className="text-yellow-400">{'★'.repeat(Math.round(a.rating))}</span></span>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        a.status === 'SCHEDULED' ? 'bg-blue-200 text-blue-700' :
                                                        a.status === 'FINISHED' ? 'bg-green-200 text-green-700' :
                                                        a.status === 'IN_PROGRESS' ? 'bg-yellow-200 text-yellow-700' :
                                                        'bg-gray-200 text-gray-700'
                                                    }`}>{a.status}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{a.date}, {a.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {appointments.length === 0 && (
                                <div className="text-gray-400 text-sm">No consultation appointments</div>
                            )}
                        </div>
                        <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium mt-2"
                                onClick={() => navigate('/customer/appointments')}>View Detail
                        </button>
                    </div>
                </div>
            </div>
            <ReminderSettingsPopup
                open={showReminderPopup}
                onClose={() => setShowReminderPopup(false)}
                onSave={() => {
                    setShowReminderPopup(false);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 1200);
                }}
            />
            <SuccessPopup open={showSuccess} onClose={() => setShowSuccess(false)} message="Successfully!"/>
        </div>
    );
};

export default Dashboard;