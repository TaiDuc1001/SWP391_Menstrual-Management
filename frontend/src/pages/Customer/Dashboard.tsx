import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import plusIcon from '../../assets/icons/plus-white.svg';
import calendarIcon from '../../assets/icons/calendar.svg';
import hospitalIcon from '../../assets/icons/hospital.svg';
import pdfIcon from '../../assets/icons/pdf.svg';
import bloodIcon from '../../assets/icons/blood.svg';
import strawberyyIcon from '../../assets/icons/strawberyy.svg';
import angryIcon from '../../assets/icons/angry.svg';
import ReminderSettingsPopup from '../../components/feature/Popup/ReminderSettingsPopup';
import SuccessPopup from '../../components/feature/Popup/SuccessPopup';
import api from '../../api/axios';
import {Doughnut} from 'react-chartjs-2';
import {ArcElement, Chart as ChartJS, Tooltip} from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [cycleStart, setCycleStart] = useState('');
    const [ovulationDate, setOvulationDate] = useState('');
    const [daysToOvulation, setDaysToOvulation] = useState(0);
    const [cycleStatus, setCycleStatus] = useState('');
    const [cycleEmojis, setCycleEmojis] = useState([strawberyyIcon, bloodIcon, angryIcon]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [screenings, setScreenings] = useState<any[]>([]);
    const [examinations, setExaminations] = useState<any[]>([]);
    const [cycles, setCycles] = useState<any[]>([]);
    const [showReminderPopup, setShowReminderPopup] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);

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
                setCycleEmojis([strawberyyIcon, bloodIcon, angryIcon]);
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
        api.get('/appointments')
            .then(res => {
                console.log('Appointments raw data:', res.data);
                // Filter upcoming appointments (not cancelled, not finished, in the future)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const upcomingAppointments = res.data
                    .filter((a: any) => {
                        // Filter out cancelled and finished appointments
                        if (a.appointmentStatus === 'CANCELLED' || a.appointmentStatus === 'FINISHED') {
                            return false;
                        }
                        
                        // Filter appointments from today onwards
                        const appointmentDate = new Date(a.date);
                        return appointmentDate >= today;
                    })
                    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 3); // Take only first 3 upcoming appointments
                
                console.log('Filtered upcoming appointments:', upcomingAppointments);
                
                // Fetch doctor ratings for each appointment
                Promise.all(
                    upcomingAppointments.map(async (a: any) => {
                        try {
                            const ratingResponse = await api.get(`/appointments/doctor/${a.doctorId}/average-rating`);
                            const { averageRating } = ratingResponse.data;
                            return {
                                id: a.id,
                                name: a.doctorName,
                                date: new Date(a.date).toLocaleDateString('en-GB'),
                                time: a.timeRange || a.slot || '',
                                avatar: '',
                                rating: averageRating ? Math.round(averageRating * 10) / 10 : 0
                            };
                        } catch (error) {
                            // If rating fetch fails, use default rating
                            return {
                                id: a.id,
                                name: a.doctorName,
                                date: new Date(a.date).toLocaleDateString('en-GB'),
                                time: a.timeRange || a.slot || '',
                                avatar: '',
                                rating: 0
                            };
                        }
                    })
                ).then(appointmentsWithRatings => {
                    if (!isMounted) return;
                    setAppointments(appointmentsWithRatings);
                }).catch(error => {
                    if (!isMounted) return;
                    console.error('Error processing appointments with ratings:', error);
                    // Fallback: set appointments without ratings
                    setAppointments(upcomingAppointments.map((a: any) => ({
                        id: a.id,
                        name: a.doctorName,
                        date: new Date(a.date).toLocaleDateString('en-GB'),
                        time: a.timeRange || a.slot || '',
                        avatar: '',
                        rating: 0
                    })));
                });
            })
            .catch(error => {
                if (!isMounted) return;
                console.error('Error fetching appointments:', error);
                setAppointments([]);
            });
        // Fetch upcoming examinations with error handling
        api.get('/examinations')
            .then(res => {
                console.log('Examinations raw data:', res.data);
                
                // Temporarily show all examinations to debug
                const allExaminations = res.data
                    .map((e: any) => ({
                        id: e.id,
                        name: e.panelName || e.name || 'Health Screening',
                        date: new Date(e.date).toLocaleDateString('en-GB'),
                        time: e.timeRange || 'TBD',
                        place: e.place || e.location || 'Medical Center',
                        status: e.examinationStatus || 'Unknown',
                        rawStatus: e.examinationStatus,
                        rawDate: e.date
                    }))
                    .slice(0, 5); // Show first 5 for debugging
                
                console.log('All examinations (debug):', allExaminations);
                
                // Now filter for actual upcoming ones
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const upcomingExaminations = res.data
                    .filter((e: any) => {
                        console.log(`Exam ${e.id}: status=${e.examinationStatus}, date=${e.date}`);
                        
                        // Skip if cancelled
                        if (e.examinationStatus === 'CANCELLED') {
                            console.log(`Exam ${e.id} skipped: cancelled`);
                            return false;
                        }
                        
                        // Include all non-completed examinations for now
                        if (e.examinationStatus === 'COMPLETED') {
                            console.log(`Exam ${e.id} skipped: completed`);
                            return false;
                        }
                        
                        console.log(`Exam ${e.id} included`);
                        return true;
                    })
                    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 3) // Take only first 3 upcoming
                    .map((e: any) => ({
                        id: e.id,
                        name: e.panelName || e.name || 'Health Screening',
                        date: new Date(e.date).toLocaleDateString('en-GB'),
                        time: e.timeRange || 'TBD',
                        place: e.place || e.location || 'Medical Center',
                        status: e.examinationStatus || 'Scheduled'
                    }));
                
                if (!isMounted) return;
                console.log('Upcoming examinations found:', upcomingExaminations);
                setExaminations(upcomingExaminations);
            })
            .catch(error => {
                if (!isMounted) return;
                console.error('Error fetching examinations:', error);
                setExaminations([]);
            });

        // Fetch latest screening results with error handling
        api.get('/examinations')
            .then(async (res) => {
                console.log('Examinations for screening results:', res.data);
                
                // Find any examination that might have results (completed/examined)
                const potentialResultExaminations = res.data
                    .filter((e: any) => {
                        console.log(`Screening check - Exam ${e.id}: status=${e.examinationStatus}`);
                        return e.examinationStatus === 'COMPLETED' || e.examinationStatus === 'EXAMINED';
                    })
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                console.log('Potential result examinations:', potentialResultExaminations);
                
                const screeningsWithResults = [];
                
                // If we have completed examinations, try to get their details
                if (potentialResultExaminations.length > 0) {
                    for (const exam of potentialResultExaminations.slice(0, 3)) {
                        try {
                            const detailResponse = await api.get(`/examinations/${exam.id}`);
                            const examDetail = detailResponse.data;
                            console.log(`Examination ${exam.id} detail:`, examDetail);
                            
                            // Check if examination has test results
                            if (examDetail.testResults && examDetail.testResults.length > 0) {
                                const hasPositiveResults = examDetail.testResults.some((tr: any) => tr.diagnosis === true);
                                const resultSummary = hasPositiveResults ? 'Abnormal - Require attention' : 'Normal - All good';
                                
                                screeningsWithResults.push({
                                    id: exam.id,
                                    name: exam.panelName || exam.name || 'Health Screening',
                                    result: resultSummary,
                                    date: exam.date,
                                    testResults: examDetail.testResults,
                                    pdf: true
                                });
                                break; // Take first one with results
                            } else {
                                // Show basic info even without detailed results
                                screeningsWithResults.push({
                                    id: exam.id,
                                    name: exam.panelName || exam.name || 'Health Screening',
                                    result: 'Results available',
                                    date: exam.date,
                                    testResults: [],
                                    pdf: true
                                });
                                break;
                            }
                        } catch (error) {
                            console.error(`Error fetching details for examination ${exam.id}:`, error);
                            // Still show basic info
                            screeningsWithResults.push({
                                id: exam.id,
                                name: exam.panelName || exam.name || 'Health Screening',
                                result: 'Results available',
                                date: exam.date,
                                testResults: [],
                                pdf: true
                            });
                            break;
                        }
                    }
                }
                
                if (!isMounted) return;
                console.log('Screening results found:', screeningsWithResults);
                setScreenings(screeningsWithResults);
            })
            .catch(error => {
                if (!isMounted) return;
                console.error('Error fetching screening results:', error);
                setScreenings([]);
            });
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
            <div
                className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow p-6 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-pink-600 mb-1">Xin chào, {userName} <span
                        className="inline-block">👋</span></h2>
                    <p className="text-gray-500">Hôm nay bạn cảm thấy thế nào? Hãy kiểm tra nhanh sức khỏe & cập nhật
                        lịch chu kỳ nhé!</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-pink-500 font-semibold">
                        <img src={calendarIcon} alt="Calendar" className="w-5 h-5"/> Cycle calendar
                    </div>
                    <div className="text-gray-500 text-sm">Starting date: <span
                        className="text-pink-600 font-bold">{cycleStart}</span></div>
                    <div className="bg-pink-100 rounded-xl p-4 flex flex-col items-center">
                        <div className="text-2xl font-bold text-pink-600 mb-1">{cycleStatus}</div>
                        <div className="text-2xl flex gap-2">
                            {cycleEmojis.map((icon, idx) => (
                                <img key={`emoji-${idx}`} src={icon} alt="cycle emoji" className="w-7 h-7 inline"/>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-500 text-sm">Ovulation: <span
                            className="text-pink-600 font-bold">{ovulationDate}</span></span>
                        <button className="text-pink-500 hover:underline text-sm"
                                onClick={() => navigate('/customer/menstrual-cycles')}>Xem lịch
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center w-full">
                        <div className="flex flex-row items-center justify-center w-full gap-8">
                            <div className="w-32 h-32 flex items-center justify-center">
                                <Doughnut data={chartData} options={chartOptions}/>
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                {chartLegends.map(l => (
                                    <div key={l.label} className="flex items-center gap-2">
                                        <span className="inline-block w-4 h-4 rounded-full"
                                              style={{background: l.color}}></span>
                                        <span className="text-gray-700 text-sm font-medium">{l.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {prediction && (
                            <div className="mt-4 text-center w-full">
                                <div className="text-gray-500 text-sm">Ovulation: <span
                                    className="text-pink-600 font-bold">{prediction.ovulation}</span></div>
                                <div className="text-gray-500 text-sm">Next period: <span
                                    className="text-pink-600 font-bold">{prediction.nextPeriod}</span></div>
                                <div className="text-gray-500 text-sm">Fertile window: <span
                                    className="text-pink-600 font-bold">{prediction.fertileWindow}</span></div>
                            </div>
                        )}
                        <button className="text-pink-500 hover:underline text-sm mt-2">View cycle</button>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-pink-500 font-semibold">
                        Your menstrual reminder
                    </div>
                    <div className="flex items-center gap-2 text-pink-600 font-bold text-lg">
                        <span>Only <span className="text-pink-500">{daysToOvulation} days</span> until your next <span
                            className="underline">ovulation</span> ({ovulationDate})</span>
                    </div>
                    <button
                        className="bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold px-4 py-2 rounded-lg shadow transition w-max"
                        onClick={() => setShowReminderPopup(true)}>Set reminder
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-pink-500 font-semibold">
                        <img src={hospitalIcon} alt="Doctor" className="w-5 h-5"/> Upcoming appointments
                    </div>
                    <div className="flex flex-col gap-2">
                        {appointments.map((a) => (
                            <div key={a.id} className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-pink-500">{a.name?.split(' ')[1]?.[0] || 'D'}</div>
                                <div>
                                    <div className="font-semibold text-gray-700">{a.name} <span
                                        className="text-yellow-400">{'★'.repeat(Math.round(a.rating))}</span></div>
                                    <div className="text-xs text-gray-500">{a.date}, {a.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="text-pink-500 hover:underline text-sm mt-2 w-max"
                            onClick={() => navigate('/customer/appointments')}>Xem chi tiết
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-pink-500 font-semibold">
                        <img src={pdfIcon} alt="PDF" className="w-5 h-5"/> Latest screenings
                    </div>
                    <div className="flex flex-col gap-2">
                        {screenings.map((s, idx) => (
                            <div key={`screening-${s.name}-${idx}`} className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">{s.name} - <span
                                    className={s.result.includes('Abnormal') ? 'text-red-600' : 'text-green-600'}>{s.result}</span></span>
                                {s.pdf &&
                                    <button 
                                        className="text-pink-500 hover:underline text-sm"
                                        onClick={() => navigate(`/customer/sti-tests/${s.id}`)}
                                    >
                                        Xem chi tiết
                                    </button>}
                            </div>
                        ))}
                        {screenings.length === 0 && (
                            <div className="text-gray-400 text-sm">Chưa có kết quả xét nghiệm</div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-pink-500 font-semibold">
                        <img src={calendarIcon} alt="Calendar" className="w-5 h-5"/> Upcoming examinations
                    </div>
                    <div className="flex flex-col gap-2">
                        {examinations.map((e, idx) => (
                            <div key={`examination-${e.name}-${idx}`} className="flex flex-col gap-1 bg-pink-50 rounded-lg p-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-pink-600">{e.name}</span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${e.status === 'In Progress' || e.status === 'Pending' ? 'bg-pink-200 text-pink-700' : 'bg-gray-200 text-gray-500'}`}>{e.status}</span>
                                </div>
                                <div className="text-xs text-gray-500">{e.place} | {e.date} - {e.time}</div>
                            </div>
                        ))}
                        {examinations.length === 0 && (
                            <div className="text-gray-400 text-sm">Không có cuộc hẹn xét nghiệm sắp tới</div>
                        )}
                    </div>
                </div>
            </div>
            {prediction && (
                <div
                    className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow p-6 flex flex-col gap-3 mt-6">
                    <h3 className="font-semibold text-lg text-pink-600 mb-2">Dự đoán & Phân tích</h3>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2"><span
                            className="w-4 h-4 bg-yellow-400 rounded-full inline-block"></span> Ngày rụng trứng tiếp
                            theo <span className="ml-auto font-semibold text-gray-700">{prediction.ovulation}</span>
                        </div>
                        <div className="flex items-center gap-2"><span
                            className="w-4 h-4 bg-green-500 rounded-full inline-block"></span> Khả năng thụ thai
                            cao <span className="ml-auto font-semibold text-gray-700">{prediction.fertileWindow}</span>
                        </div>
                        <div className="flex items-center gap-2"><span
                            className="w-4 h-4 bg-red-500 rounded-full inline-block"></span> Kỳ kinh tiếp theo dự
                            kiến <span className="ml-auto font-semibold text-gray-700">{prediction.nextPeriod}</span>
                        </div>
                        <div className="flex items-center gap-2"><span
                            className="w-4 h-4 bg-blue-400 rounded-full inline-block"></span> Cảnh báo chu kỳ <span
                            className="ml-auto font-semibold text-gray-700">Bình thường</span></div>
                    </div>
                </div>
            )}
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