import React, {useState} from 'react';
import plusWhiteIcon from '../../../assets/icons/plus-white.svg';
import searchIcon from '../../../assets/icons/search.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/trash-bin.svg';
import NewServiceButton from '../../../components/common/Button/AdminCreateButton';

const tabs = [
    {label: 'Service Management'},
    {label: 'Consultation Packages'},
    {label: 'Promotions'},
];

const services = [
    {
        id: 1,
        name: 'HIV Test',
        desc: 'Rapid test for HIV detection with same-day results.',
        time: '30 minutes',
        price: '350,000đ',
        status: 'In Progress',
    },
    {
        id: 2,
        name: 'HPV Test',
        desc: 'High-accuracy test for HPV detection, specifically for women.',
        time: '40 minutes',
        price: '420,000đ',
        status: 'In Progress',
    },
    {
        id: 3,
        name: 'Gonorrhea Test',
        desc: 'Rapid test for gonorrhea detection, results available within 1 hour.',
        time: '1 hour',
        price: '310,000đ',
        status: 'Stopped',
    },
    {
        id: 4,
        name: 'Syphilis Test',
        desc: 'Qualitative and quantitative test for syphilis detection, results available within the same day.',
        time: '30 minutes',
        price: '350,000đ',
        status: 'In Progress',
    },
];

const getStatusBadge = (status: string) => {
    if (status === 'In Progress') {
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">{status}</span>;
    }
    return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">{status}</span>;
};

const TestPanels: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState('');
    const totalServices = 12;
    const pageSize = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalServices / pageSize);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">
                    Service Management
                </h1>
            </div>
            <div className="bg-white rounded shadow w-full p-4">
                <div className="flex border-b mb-4">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab.label}
                            className={`px-6 py-2 font-medium border-b-2 transition ${activeTab === idx ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
                            onClick={() => setActiveTab(idx)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-[400px]">
                        <input
                            type="text"
                            placeholder="Search by service name, status, or price..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                        />
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400"/>
                        </span>
                    </div>
                    <NewServiceButton icon={<img src={plusWhiteIcon} alt="Plus" className="w-5 h-5"/>}>
                        Create new service
                    </NewServiceButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-50 text-gray-700">
                            <th className="p-2 text-left">Service name</th>
                            <th className="p-2 text-left">Detail</th>
                            <th className="p-2 text-center">Duration</th>
                            <th className="p-2 text-center w-10">Turnaround time</th>
                            <th className="p-2 text-center">Price</th>
                            <th className="p-2 text-center">Status</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {services.map((s) => (
                            <tr key={s.id} className="border-b last:border-b-0">
                                <td className="p-2 whitespace-nowrap">{s.name}</td>
                                <td className="p-2">{s.desc}</td>
                                <td className="p-2 text-center">{s.time}</td>
                                <td className="p-2 text-center">24 hours</td>
                                <td className="p-2 text-center text-blue-600 font-semibold">{s.price}</td>
                                <td className="p-2 text-center">{getStatusBadge(s.status)}</td>
                                <td className="p-2 text-center">
                                    <button className="inline-block mr-4" title="Edit"><img src={editIcon} alt="edit"
                                                                                            className="w-4 h-4"/>
                                    </button>
                                    <button className="inline-block" title="Delete"><img src={deleteIcon} alt="delete"
                                                                                         className="w-4 h-4"/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Displaying 1-4 of {totalServices} services</span>
                    <div className="flex items-center gap-1">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}
                                className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-200' : 'bg-white border'}`}>{'<'}</button>
                        {[1, 2, 3].map((i) => (
                            <button key={i}
                                    className={`px-2 py-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{i}</button>
                        ))}
                        <button disabled className="px-2 py-1 rounded bg-white border">...</button>
                        <button className="px-2 py-1 rounded bg-white border">{totalPages}</button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}
                                className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200' : 'bg-white border'}`}>{'>'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPanels;
