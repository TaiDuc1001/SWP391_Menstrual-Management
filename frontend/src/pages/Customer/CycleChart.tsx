import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Line} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import api from '../../api/axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CycleChart: React.FC = () => {
    const navigate = useNavigate();
    const [cycles, setCycles] = useState<any[]>([]);

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

    const chartData = cycles.length > 0 ? (() => {
        const sortedCycles = [...cycles]
            .filter(c => c.cycleLength && c.cycleLength > 0)
            .sort((a, b) => new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime())
            .slice(-6);

        const labels = sortedCycles.map((_, index) => `Chu kỳ ${index + 1}`);
        const cycleLengths = sortedCycles.map(c => c.cycleLength);

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
        </div>
    );
};

export default CycleChart;
