import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Doughnut} from 'react-chartjs-2';
import {ArcElement, Chart as ChartJS, Tooltip} from 'chart.js';
import api from '../../api/axios';

ChartJS.register(ArcElement, Tooltip);

const CycleChart: React.FC = () => {
    const navigate = useNavigate();
    const [cycles, setCycles] = useState<any[]>([]);
    const [prediction, setPrediction] = useState<any>(null);

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

    const chartData = cycles.length > 0 && prediction ? {
        labels: ['Period', 'Fertile', 'Other'],
        datasets: [
            {
                data: [prediction.avgPeriod, 6, prediction.avgCycle - prediction.avgPeriod - 6],
                backgroundColor: ['#f472b6', '#34d399', '#fbbf24'],
                borderWidth: 1
            }
        ]
    } : {
        labels: ['Period', 'Fertile', 'Other'],
        datasets: [
            {
                data: [5, 6, 17],
                backgroundColor: ['#f472b6', '#34d399', '#fbbf24'],
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        plugins: {
            legend: {display: false}
        }
    };

    const chartLegends = [
        {color: '#f472b6', label: 'Period'},
        {color: '#34d399', label: 'Fertile'},
        {color: '#fbbf24', label: 'Other'}
    ];

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
                    <div className="flex flex-row items-center justify-center w-full gap-12 mb-8">
                        <div className="w-64 h-64 flex items-center justify-center">
                            <Doughnut data={chartData} options={chartOptions}/>
                        </div>
                        <div className="flex flex-col gap-4 justify-center">
                            {chartLegends.map(l => (
                                <div key={l.label} className="flex items-center gap-3">
                                    <span className="inline-block w-6 h-6 rounded-full"
                                          style={{background: l.color}}></span>
                                    <span className="text-gray-700 text-lg font-medium">{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {prediction && (
                        <div className="bg-pink-50 rounded-xl p-6 w-full max-w-2xl">
                            <h2 className="text-lg font-semibold text-pink-600 mb-4 text-center">Cycle Predictions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-gray-500 text-sm mb-1">Next Ovulation</div>
                                    <div className="text-pink-600 font-bold text-lg">{prediction.ovulation}</div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-gray-500 text-sm mb-1">Next Period</div>
                                    <div className="text-pink-600 font-bold text-lg">{prediction.nextPeriod}</div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-gray-500 text-sm mb-1">Fertile Window</div>
                                    <div className="text-pink-600 font-bold text-sm">{prediction.fertileWindow}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <div className="text-gray-500 text-sm mb-1">Average Cycle Length</div>
                                    <div className="text-pink-600 font-bold text-lg">{prediction.avgCycle} days</div>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <div className="text-gray-500 text-sm mb-1">Average Period Duration</div>
                                    <div className="text-pink-600 font-bold text-lg">{prediction.avgPeriod} days</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CycleChart;
