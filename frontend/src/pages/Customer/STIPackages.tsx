import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TypeBadge from '../../components/Badge/TypeBadge';
import TagBadge from '../../components/Badge/TagBadge';
import ActionButton from '../../components/Button/ActionButton';
import searchIcon from '../../assets/icons/search.svg';
import DropdownSelect from '../../components/Filter/DropdownSelect';
import MultiSelectDropdown from '../../components/Filter/MultiSelectDropdown';
import TitleBar from '../../components/TitleBar/TitleBar';

const TYPE_BADGE_STYLES: Record<string, string> = {
  Comprehensive: 'bg-blue-100 text-blue-600',
  Specialized: 'bg-orange-100 text-orange-600',
  Preventive: 'bg-yellow-100 text-yellow-600',
};
const TAG_BADGE_STYLES: Record<string, string> = {
  Recommended: 'bg-green-100 text-green-600',
  'Best Value': 'bg-green-100 text-green-600',
  'Budget-Friendly': 'bg-green-100 text-green-600',
  Popular: 'bg-pink-100 text-pink-600',
  Express: 'bg-green-100 text-green-600',
};

const availablePackages = [
  {
    id: 1,
    type: 'Comprehensive',
    label: 'Comprehensive STI Screening Package',
    tags: ['Recommended', 'Best Value'],
    tests: '8 tests (HIV I/II, Syphilis, Chlamydia, Gonorrhea, Herpes Simplex Virus 1/2, HPV, Hepatitis B)',
    resultTime: 'Results in 24-48 hours',
    price: '2,500,000 VND',
    priceNote: 'Final price may vary based on clinic',
    sampleType: 'Blood, Urine, Swab',
    consultation: 'Includes free post-test consultation',
  },
  {
    id: 2,
    type: 'Specialized',
    label: 'Specialized STI Screening Package',
    tags: ['Popular'],
    tests: '5 tests (HIV, Syphilis, Chlamydia, Gonorrhea, Trichomoniasis)',
    resultTime: 'Results in 12-24 hours',
    price: '3,800,000 VND',
    priceNote: 'Price includes express processing',
    sampleType: 'Blood, Urine',
    consultation: 'Optional consultation for 500,000 VND',
  },
  {
    id: 3,
    type: 'Preventive',
    label: 'Basic STI Screening Package',
    tags: ['Budget-Friendly'],
    tests: '4 tests (HIV, Syphilis, Chlamydia, Gonorrhea)',
    resultTime: 'Results in 48-72 hours',
    price: '1,200,000 VND',
    priceNote: 'Promotional price, valid until end of month',
    sampleType: 'Blood, Urine',
    consultation: 'No consultation included',
  },
  {
    id: 4,
    type: 'Preventive',
    label: 'Standard STI Screening Package',
    tags: [],
    tests: '3 tests (HIV, Syphilis, Chlamydia)',
    resultTime: 'Results in 72 hours',
    price: '900,000 VND',
    priceNote: 'Fixed price, no additional fees',
    sampleType: 'Blood',
    consultation: 'No consultation included',
  },
  {
    id: 5,
    type: 'Specialized',
    label: 'Advanced STI Testing Package',
    tags: ['Popular', 'Express'],
    tests: '6 tests (HIV, Syphilis, Chlamydia, Gonorrhea, Herpes, Hepatitis C)',
    resultTime: 'Results in 12-18 hours',
    price: '4,200,000 VND',
    priceNote: 'Price includes priority lab processing',
    sampleType: 'Blood, Swab',
    consultation: 'Includes free teleconsultation',
  },
];

const PACKAGES_PER_PAGE = 4;

const STIPackages: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sampleType, setSampleType] = useState<string[]>([]);
  const [testType, setTestType] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [showSampleTypeDropdown, setShowSampleTypeDropdown] = useState(false);
  const [showTestTypeDropdown, setShowTestTypeDropdown] = useState(false);
  const [tag, setTag] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagOptions = Array.from(new Set(availablePackages.flatMap(pkg => pkg.tags))).filter(Boolean);

  const typeOptions = [
    { value: '', label: 'All types' },
    { value: 'Comprehensive', label: 'Comprehensive' },
    { value: 'Specialized', label: 'Specialized' },
    { value: 'Preventive', label: 'Preventive' },
  ];
  const sampleTypeOptions = ['Blood', 'Urine', 'Swab'];
  const testTypeOptions = Array.from(new Set(availablePackages.flatMap(pkg => pkg.tests.match(/\((.*?)\)/g)?.flatMap(t => t.replace(/[()]/g, '').split(',').map(s => s.trim())) || [])));

  const priceOptions = [
    { value: '', label: 'All price ranges' },
    { value: 'low', label: 'Under 2 million' },
    { value: 'mid', label: '2-4 million' },
    { value: 'high', label: 'Over 4 million' },
  ];

  const filteredPackages = availablePackages.filter(pkg => {
    const matchesSearch =
      search === '' ||
      pkg.label.toLowerCase().includes(search.toLowerCase()) ||
      pkg.tests.toLowerCase().includes(search.toLowerCase());
    const matchesType = !type || pkg.type === type;
    const matchesSampleType = sampleType.length === 0 || sampleType.some(type => pkg.sampleType.includes(type));
    const matchesTestType = testType.length === 0 || (pkg.tests && testType.some(t => pkg.tests.toLowerCase().includes(t.toLowerCase())));
    const priceNum = Number(pkg.price.replace(/[^\d]/g, ''));
    let matchesPrice = true;
    if (price === 'low') matchesPrice = priceNum < 2000000;
    else if (price === 'mid') matchesPrice = priceNum >= 2000000 && priceNum <= 4000000;
    else if (price === 'high') matchesPrice = priceNum > 4000000;
    const matchesTag = tag.length === 0 || pkg.tags.some(t => tag.includes(t));
    return matchesSearch && matchesType && matchesSampleType && matchesTestType && matchesPrice && matchesTag;
  });

  const totalPages = Math.ceil(filteredPackages.length / PACKAGES_PER_PAGE);
  const startIdx = (currentPage - 1) * PACKAGES_PER_PAGE;
  const endIdx = startIdx + PACKAGES_PER_PAGE;
  const pagedPackages = filteredPackages.slice(startIdx, endIdx);

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
      </div>
      {/* Utility Bar */}
      <div className="mb-4 flex space-x-4 w-4/5 mx-auto" style={{ maxWidth: '100%' }}>
        <div className="flex items-center flex-1 bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm">
          <img src={searchIcon} alt="search" className="w-5 h-5 mr-2 opacity-40" />
          <input
            type="text"
            placeholder="Search by disease name, package name, symptoms..."
            className="flex-1 outline-none bg-transparent text-gray-500 placeholder-gray-400"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <DropdownSelect
          value={type}
          onChange={(v: string) => { setType(v); setCurrentPage(1); }}
          options={typeOptions}
          placeholder="Type"
        />
        <MultiSelectDropdown
          selected={tag}
          setSelected={setTag}
          options={tagOptions}
          showDropdown={showTagDropdown}
          setShowDropdown={setShowTagDropdown}
          placeholder="Tag"
        />
        <MultiSelectDropdown
          selected={sampleType}
          setSelected={setSampleType}
          options={sampleTypeOptions}
          showDropdown={showSampleTypeDropdown}
          setShowDropdown={setShowSampleTypeDropdown}
          placeholder="Sample type"
        />
        <MultiSelectDropdown
          selected={testType}
          setSelected={setTestType}
          options={testTypeOptions}
          showDropdown={showTestTypeDropdown}
          setShowDropdown={setShowTestTypeDropdown}
          placeholder="Test type"
        />
        <DropdownSelect
          value={price}
          onChange={(v: string) => { setPrice(v); setCurrentPage(1); }}
          options={priceOptions}
          placeholder="Price range"
        />
      </div>
      <div className="space-y-4 w-4/5 mx-auto">
        {pagedPackages.map(pkg => (
          <div key={pkg.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between bg-gray-50 hover:shadow w-full">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TypeBadge label={pkg.type} className={TYPE_BADGE_STYLES[pkg.type] || ''} />
                {pkg.tags.map(tag => (
                  <TagBadge key={tag} label={tag} className={TAG_BADGE_STYLES[tag] || ''} />
                ))}
              </div>
              <div className="font-bold text-lg mb-1">{pkg.label}</div>
              <div className="text-gray-600 text-sm mb-1">{pkg.tests}</div>
              <div className="text-gray-500 text-xs mb-1">Sample type: {pkg.sampleType}</div>
              <div className="text-gray-400 text-xs">{pkg.resultTime}</div>
            </div>
            <div className="flex flex-col items-end mt-4 md:mt-0 md:ml-4">
              <div className="text-pink-500 font-bold text-xl">{pkg.price}</div>
              <div className="text-gray-400 text-xs mb-2">{pkg.priceNote}</div>
              <div className="flex gap-2">
                <ActionButton
                  outlined
                  variant="secondary"
                  actionType="learn-more"
                  onClick={() => navigate(`/sti-tests/packages/${pkg.id}`)}
                >
                  Learn more
                </ActionButton>
                <ActionButton
                  variant="primary"
                  actionType="book"
                  onClick={() => navigate('/sti-tests/book')}
                >
                  Book
                </ActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
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

export default STIPackages;
