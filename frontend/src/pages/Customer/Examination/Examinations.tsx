import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../../../api/axios';
import {useTableState} from '../../../api/hooks';
import {formatExaminationStatus, createMultiFieldSearch} from '../../../utils/statusMappings';

import plusWhiteIcon from '../../../assets/icons/plus-white.svg';

import TestingTitleBar from '../../../components/feature/TitleBar/TestingTitleBar';
import {SearchInput, UtilityBar} from '../../../components';
import ExaminationsTable from '../../../components/feature/Table/Customer/Examinations';
import DropdownSelect from '../../../components/feature/Filter/DropdownSelect';
import DatePickerInput from '../../../components/feature/Filter/DatePickerInput';
import TestResultPopup from '../../../components/feature/Popup/TestResultPopup';

const plusIcon = plusWhiteIcon;

const TESTS_PER_PAGE = 5;

const Examinations: React.FC = () => {
    const [testRecords, setTestRecords] = useState<any[]>([]);
    const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
    const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [hideRows, setHideRows] = useState<number[]>([]);
    const [showResultPopup, setShowResultPopup] = useState(false);
    const [currentExaminationId, setCurrentExaminationId] = useState<number | null>(null);
    const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([{
        value: '',
        label: 'All slots'
    }]);
    const [slotMap, setSlotMap] = useState<{ [key: string]: string }>({});
    const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([{
        value: '',
        label: 'All status'
    }]);
    const [panelOptions, setPanelOptions] = useState<{ value: string; label: string }[]>([{
        value: '',
        label: 'All panels'
    }]);
    const [selectedPanel, setSelectedPanel] = useState('');
    const navigate = useNavigate();

    const parseDate = (dateStr: string): Date => {

        if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts[0].length === 4) {

                const [year, month, day] = parts.map(Number);
                return new Date(year, month - 1, day);
            } else {

                const [day, month, year] = parts.map(Number);
                return new Date(year, month - 1, day);
            }
        } else if (dateStr.includes('/')) {

            const [day, month, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        }

        return new Date(dateStr);
    };

    const filteredRecords = testRecords.filter((record: any) => {

        const searchFields = ['panels', 'date', 'status', 'statusRaw', 'id', 'panelName'];
        const searchMatch = createMultiFieldSearch(searchTerm, searchFields)(record);

        const slotMatch = selectedSlot ? (
            record.slot === selectedSlot ||
            record.time === selectedSlot ||
            record.slotTime === selectedSlot ||
            record.timeRange === selectedSlot
        ) : true;

        const statusMatch = selectedStatus ? (
            record.status === selectedStatus ||
            record.statusRaw === selectedStatus ||
            record.status.toLowerCase() === selectedStatus.toLowerCase() ||
            record.statusRaw?.toLowerCase() === selectedStatus.toLowerCase()
        ) : true;

        const panelMatch = selectedPanel ? (
            record.panels === selectedPanel ||
            record.panelName === selectedPanel ||
            record.panels?.toLowerCase() === selectedPanel.toLowerCase()
        ) : true;

        let dateMatch = true;
        if (selectedDateFrom || selectedDateTo) {
            try {
                const recordDate = parseDate(record.date);
                const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
                const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
                dateMatch = fromMatch && toMatch;
            } catch {
                dateMatch = true; // Include item if date parsing fails
            }
        }
        
        return searchMatch && slotMatch && statusMatch && panelMatch && dateMatch;
    }).filter(record => !hideRows.includes(record.id));

    
    const {
        data: paginatedData,
        currentPage,
        totalPages,
        selected,
        handlePageChange,
        handleSelectChange,
        handleSelectAll: handleSelectAllBase,
        handleSort,
        sortConfig
    } = useTableState(filteredRecords, {
        initialPageSize: TESTS_PER_PAGE,
        initialSortConfig: { key: 'rawDate', direction: 'desc' }
    });

    const handleSelectAllWrapper = (checked: boolean) => {
        handleSelectAllBase(checked);
    };

    useEffect(() => {
        api.get('/examinations').then(res => {
            let data = res.data;
            if (!Array.isArray(data)) {
                if (data && typeof data === 'object') {
                    data = [data];
                } else {
                    data = [];
                }
            }
            const mapped = data.map((order: any) => {

                const status = formatExaminationStatus(order.examinationStatus || '');

                return {
                    id: order.id,
                    date: order.date ? new Date(order.date).toLocaleDateString('en-GB') : '',
                    slot: order.slot ?? '',
                    time: order.timeRange || '', 
                    panels: order.panelName || 'No info',
                    statusRaw: order.examinationStatus || '',
                    status: status,
                    rawDate: order.date ? new Date(order.date) : null, // Keep raw date for sorting
                };
            });

            const sortedMapped = mapped.sort((a: any, b: any) => {
                if (!a.rawDate && !b.rawDate) return 0;
                if (!a.rawDate) return 1;
                if (!b.rawDate) return -1;
                return b.rawDate.getTime() - a.rawDate.getTime();
            });
            
            setTestRecords(sortedMapped);
        }).catch((error: any) => {
            console.error('Error fetching examinations:', error);
            setTestRecords([]);
        });
    }, []);

    useEffect(() => {
        api.get('/enumerators/slots').then(res => {
            const options = [{value: '', label: 'All slots'}];
            const map: { [key: string]: string } = {};
            (res.data as { name: string; timeRange: string }[]).forEach(slot => {
                if (slot.timeRange !== 'Filler slot, not used') {
                    options.push({value: slot.timeRange, label: slot.timeRange});
                    map[slot.timeRange] = slot.timeRange;
                }
            });
            setSlotOptions(options);
            setSlotMap(map);
        });
    }, []);

    useEffect(() => {
        api.get('/enumerators/examination-status').then(res => {
            const options = [{value: '', label: 'All status'}];
            (res.data as string[]).forEach(status => {
                const formattedLabel = formatExaminationStatus(status);
                options.push({
                    value: status,
                    label: formattedLabel
                });
            });
            setStatusOptions(options);
        }).catch(() => {
            setStatusOptions([{value: '', label: 'All status'}]);
        });
    }, []);

    useEffect(() => {
        api.get('/panels').then(res => {
            const options = [{value: '', label: 'All panels'}];
            (res.data as { panelName: string }[]).forEach(panel => {
                options.push({value: panel.panelName, label: panel.panelName});
            });
            setPanelOptions(options);
        });
    }, []);
    const handleViewExaminationDetail = (id: number) => {
        navigate(`/customer/sti-tests/${id}`);
    };

    const handleCheckout = (id: number) => {
        navigate(`/customer/vnpay-examination-checkout/${id}`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <TestingTitleBar
                title="Testing history"
                onNewOrder={() => {
                    navigate('/customer/sti-tests/packages');
                }}
                newOrderIcon={<img src={plusIcon} alt="Plus" className="w-5 h-5"/>}/>
            <UtilityBar>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by date, slot, or test panels"
                />
                <div className="dropdown-full-width">
                    <DropdownSelect
                        value={selectedSlot}
                        onChange={setSelectedSlot}
                        options={slotOptions}
                        placeholder="Time Slot"
                    />
                </div>
                <div className="dropdown-full-width">
                    <DropdownSelect
                        value={selectedPanel}
                        onChange={setSelectedPanel}
                        options={panelOptions}
                        placeholder="Panel"
                    />
                </div>
                <div className="dropdown-full-width">
                    <DropdownSelect
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        options={statusOptions}
                        placeholder="Status"
                    />
                </div>
                <DatePickerInput
                    selected={selectedDateFrom}
                    onChange={setSelectedDateFrom}
                    placeholder="From date"
                    maxDate={selectedDateTo || undefined}
                />
                <DatePickerInput
                    selected={selectedDateTo}
                    onChange={setSelectedDateTo}
                    placeholder="To date"
                    minDate={selectedDateFrom || undefined}
                />
            </UtilityBar>
            <ExaminationsTable
                filteredRecords={paginatedData}
                slotTimeMap={slotMap}
                selected={selected as number[]}
                onSelectChange={handleSelectChange}
                onSelectAll={handleSelectAllWrapper}
                hideRows={hideRows}
                onDeleteRows={(ids: number[]) => {
                    setHideRows(prev => [...prev, ...ids]);
                    handleSelectChange([]);
                }}
                onViewRows={(ids: number[]) => {
                    if (ids && ids.length > 0) {
                        setCurrentExaminationId(ids[0]);
                        setShowResultPopup(true);
                    }
                }}
                onViewExaminationDetail={handleViewExaminationDetail}
                onCheckout={handleCheckout}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={TESTS_PER_PAGE}
                totalItems={filteredRecords.length}
                sortConfig={sortConfig}
                onSort={handleSort}
            />
            {showResultPopup && currentExaminationId !== null && (
                <TestResultPopup onClose={() => {
                    setShowResultPopup(false);
                    setCurrentExaminationId(null);
                }} examinationId={currentExaminationId}/>
            )}
        </div>
    );
};

export default Examinations;
