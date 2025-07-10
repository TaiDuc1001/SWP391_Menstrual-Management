import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Line, Bar} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    BarElement
} from 'chart.js';
import api from '../../api/axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const CycleChart: React.FC = () => {
    const navigate = useNavigate();
    const [cycles, setCycles] = useState<any[]>([]);
    const [menstruationData, setMenstruationData] = useState<{ [key: string]: number }>({});

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

    const getMenstruationPeriodsFromSymptoms = () => {
        const storageKey = getSymptomsStorageKey();
        const saved = localStorage.getItem(storageKey);
        const symptoms = saved ? JSON.parse(saved) : {};
        
        const menstruationDays: { [key: string]: number } = {};
        
        Object.entries(symptoms).forEach(([dateKey, symptomData]: [string, any]) => {
            if (symptomData.period === 'Menstruating') {
                const date = new Date(dateKey);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                menstruationDays[monthKey] = (menstruationDays[monthKey] || 0) + 1;
            }
        });
        
        return menstruationDays;
    };

    const getMenstruationPeriodsFromCycles = () => {
        const menstruationDays: { [key: string]: number } = {};
        
        cycles.forEach(cycle => {
            const startDate = new Date(cycle.cycleStartDate);
            const periodDuration = cycle.periodDuration || 5;
            
            for (let i = 0; i < periodDuration; i++) {
                const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
                const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                menstruationDays[monthKey] = (menstruationDays[monthKey] || 0) + 1;
            }
        });
        
        return menstruationDays;
    };

    const getCombinedMenstruationData = () => {
        const symptomsData = getMenstruationPeriodsFromSymptoms();
        const cyclesData = getMenstruationPeriodsFromCycles();
        
        const allMonths = new Set([...Object.keys(symptomsData), ...Object.keys(cyclesData)]);
        const combinedData: { [key: string]: number } = {};
        
        allMonths.forEach(month => {
            combinedData[month] = Math.max(symptomsData[month] || 0, cyclesData[month] || 0);
        });
        
        return combinedData;
    };

    const barChartData = (() => {
        const sortedEntries = Object.entries(menstruationData)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-6);
        
        if (sortedEntries.length === 0) {
            return {
                labels: ['Chu kỳ 1', 'Chu kỳ 2', 'Chu kỳ 3', 'Chu kỳ 4', 'Chu kỳ 5', 'Chu kỳ 6'],
                datasets: [
                    {
                        label: 'Số ngày hành kinh',
                        data: [5, 4, 6, 3, 5, 4],
                        backgroundColor: '#ff5a7a',
                        borderColor: '#ff5a7a',
                        borderWidth: 0,
                        borderRadius: 4,
                        borderSkipped: false,
                    }
                ]
            };
        }
        
        const labels = sortedEntries.map((_, index) => `Chu kỳ ${index + 1}`);
        const data = sortedEntries.map(([, days]) => days);
        
        return {
            labels,
            datasets: [
                {
                    label: 'Số ngày hành kinh',
                    data,
                    backgroundColor: '#ff5a7a',
                    borderColor: '#ff5a7a',
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false,
                }
            ]
        };
    })();

    const barChartOptions = {
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
                        return `Số ngày hành kinh: ${context.parsed.y}`;
                    }
                }
            },
            title: {
                display: true,
                text: 'Thời gian hành kinh qua các chu kỳ',
                color: '#6b7280',
                font: {
                    size: 16,
                    weight: 'bold' as const
                },
                padding: {
                    top: 10,
                    bottom: 30
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
                },
                title: {
                    display: true,
                    text: 'Chu kỳ',
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
                        return Number.isInteger(value) ? value : '';
                    }
                },
                title: {
                    display: true,
                    text: 'Số ngày',
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

    useEffect(() => {
        let isMounted = true;
        
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
            
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const data = getCombinedMenstruationData();
        setMenstruationData(data);
    }, [cycles]);

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
        const labels = displayCycles.map((_, index) => `Chu kỳ ${index + 1}`);
        const cycleLengths = displayCycles.map(c => c.actualCycleDays);

        return {
            labels,
            datasets: [
                {
                    label: 'Độ dài chu kỳ (ngày)',
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
        labels: ['Chu kỳ 1', 'Chu kỳ 2', 'Chu kỳ 3', 'Chu kỳ 4', 'Chu kỳ 5'],
        datasets: [
            {
                label: 'Độ dài chu kỳ (ngày)',
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
                    text: 'Số ngày',
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
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-pink-600">Cycle Chart</h1>
                    <button
                        onClick={() => navigate('/customer/dashboard')}
                        className="text-pink-500 hover:underline text-sm"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-4xl h-96 mb-8">
                        <Line data={chartData} options={chartOptions}/>
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                        <span className="inline-block w-4 h-4 rounded-full bg-pink-500"></span>
                        <span className="text-gray-700 text-lg font-medium">Độ dài chu kỳ (ngày)</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-4xl h-96 mb-8">
                        <Bar data={barChartData} options={barChartOptions}/>
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                        <span className="inline-block w-4 h-4 rounded-sm bg-pink-400"></span>
                        <span className="text-gray-700 text-lg font-medium">Số ngày hành kinh</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CycleChart;
