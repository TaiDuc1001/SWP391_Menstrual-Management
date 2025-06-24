import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {DropdownSelect, MultiSelectDropdown, SearchInput, TagBadge, TitleBar, TypeBadge} from '../../../components';
import ActionButton from '../../../components/common/Button/ActionButton';
import {api} from '../../../api';
import {
    applyPagination,
    createPackageFilter,
    createTypeOptions,
    TAG_BADGE_STYLES,
    TYPE_BADGE_STYLES
} from '../../../utils';

const Panels: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [tag, setTag] = useState<string[]>([]);
    const [panels, setPanels] = useState<any[]>([]);

    useEffect(() => {
        api.get('/panels')
            .then(res => setPanels(res.data))
            .catch(() => setPanels([]));
    }, []);
    const typeOptions = createTypeOptions(
        Array.from(new Set(panels.map(pkg => pkg.panelType)))
    );
    const tagOptions = Array.from(new Set(panels.map(pkg => pkg.panelTag))).filter(Boolean);    // Function to sort packages based on priority
    const sortPackagesByPriority = (packages: any[]) => {
        return packages.sort((a, b) => {
            const nameA = a.panelName.toLowerCase();
            const nameB = b.panelName.toLowerCase();
            const typeA = a.panelType?.toLowerCase() || '';
            const typeB = b.panelType?.toLowerCase() || '';
            
            // Priority order: health checkups and pregnancy first, HIV last
            const getOrderPriority = (name: string, type: string) => {
                // Khám thai và sức khỏe lên đầu
                if (name.includes('thai') || name.includes('pregnancy') || 
                    name.includes('khám') || name.includes('health') || 
                    type.includes('general') || type.includes('basic')) return 1;
                
                // Các gói xét nghiệm STI khác ở giữa
                if (name.includes('giang mai') || name.includes('syphilis') ||
                    name.includes('chlamydia') || name.includes('gonorrhea')) return 2;
                
                // HIV xuống cuối cùng
                if (name.includes('hiv')) return 999;
                
                // Các gói khác
                return 500;
            };
            
            const priorityA = getOrderPriority(nameA, typeA);
            const priorityB = getOrderPriority(nameB, typeB);
            
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            
            // If same priority, sort alphabetically
            return nameA.localeCompare(nameB);
        });
    };

    const filteredPackages = sortPackagesByPriority(panels.filter(createPackageFilter(search, type, tag)));

    const PACKAGES_PER_PAGE = 4;
    const paginationResult = applyPagination(filteredPackages, {
        currentPage,
        itemsPerPage: PACKAGES_PER_PAGE
    });
    const {items: pagedPackages, totalPages} = paginationResult;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="w-4/5 mx-auto">
                <TitleBar
                    text="Available Packages"
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                    onButtonClick={() => navigate(-1)}
                />
            </div>            <div className="mb-4 flex space-x-4 w-full max-w-6xl mx-auto px-4">
                <SearchInput
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        setCurrentPage(1);
                    }}
                    placeholder="Search by disease name, package name, symptoms..."
                    className="flex-grow"
                />
                <DropdownSelect
                    value={type}
                    onChange={(v: string) => {
                        setType(v);
                        setCurrentPage(1);
                    }}
                    options={typeOptions}
                    placeholder="Type"
                />
                <MultiSelectDropdown
                    selected={tag}
                    setSelected={setTag}
                    options={tagOptions}
                    showDropdown={false}
                    setShowDropdown={() => {
                    }}
                    placeholder="Tag"
                />
            </div>            <div className="space-y-4 w-4/5 mx-auto">
                {pagedPackages.map(pkg => (                <div key={pkg.id}
                         className="border rounded-lg p-4 flex flex-col md:flex-row justify-between bg-white hover:shadow-lg transition-shadow duration-200 w-full">
                        <div className="flex-1 pr-0 md:pr-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TypeBadge label={pkg.panelType} className={TYPE_BADGE_STYLES[pkg.panelType] || ''}/>
                                {pkg.panelTag &&
                                    <TagBadge label={pkg.panelTag} className={TAG_BADGE_STYLES[pkg.panelTag] || ''}/>}
                            </div><div className="font-bold text-lg mb-2">{pkg.panelName}</div>
                            <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {pkg.description.length > 150 
                                    ? `${pkg.description.substring(0, 150)}...` 
                                    : pkg.description
                                }
                            </div>
                              {/* Tests included section - compact */}
                            <div className="mb-3">
                                <div className="font-semibold text-sm text-gray-700 mb-1">Tests included:</div>
                                {pkg.testTypesNames && pkg.testTypesNames.length > 0 ? (
                                    <div className="text-gray-600 text-sm">
                                        {pkg.testTypesNames.length <= 3 ? (
                                            <ul className="list-disc pl-5 space-y-0.5">
                                                {pkg.testTypesNames.map((testName: string, idx: number) => (
                                                    <li key={idx} className="font-medium">{testName}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="pl-2">
                                                <span className="font-medium">{pkg.testTypesNames.slice(0, 2).join(', ')}</span>
                                                <span className="text-gray-500"> and {pkg.testTypesNames.length - 2} more tests</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm italic pl-2">
                                        Test details available after booking
                                    </div>
                                )}
                            </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <span>⏱</span>
                                    <span>{pkg.responseTime}h results</span>
                                </span>
                                {pkg.price && (
                                    <span className="font-bold text-pink-600 text-base">
                                        {pkg.price.toLocaleString()} VND
                                    </span>
                                )}
                            </div>
                        </div>                        <div className="flex flex-col justify-end items-stretch md:items-end mt-4 md:mt-0 md:ml-4 md:self-end shrink-0">
                            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                                <ActionButton
                                    outlined
                                    variant="secondary"
                                    actionType="learn-more"
                                    onClick={() => navigate(`/customer/sti-tests/packages/${pkg.id}`)}
                                >
                                    Learn more
                                </ActionButton>
                                <ActionButton
                                    variant="primary"
                                    actionType="book"
                                    onClick={() => navigate('/customer/sti-tests/book', {state: {panelId: pkg.id}})}
                                >
                                    Book
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                    >
                        Prev
                    </button>
                    {Array.from({length: totalPages}, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded font-semibold ${currentPage === i + 1 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Panels;
