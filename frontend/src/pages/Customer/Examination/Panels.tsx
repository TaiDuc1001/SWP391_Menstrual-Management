import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  TypeBadge,
  TagBadge,
  Card,
  SearchInput,
  DropdownSelect,
  MultiSelectDropdown,
  TitleBar,
  Pagination
} from '../../../components';
import ActionButton from '../../../components/common/Button/ActionButton';
import { api } from '../../../api';
import { cn, cardClasses } from '../../../utils';
import { TYPE_BADGE_STYLES, TAG_BADGE_STYLES, createTypeOptions, createPackageFilter, applyPagination } from '../../../utils';

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
  const tagOptions = Array.from(new Set(panels.map(pkg => pkg.panelTag))).filter(Boolean);

  const filteredPackages = panels.filter(createPackageFilter(search, type, tag));

  const PACKAGES_PER_PAGE = 4;
  const paginationResult = applyPagination(filteredPackages, {
    currentPage,
    itemsPerPage: PACKAGES_PER_PAGE
  });
  const { items: pagedPackages, totalPages } = paginationResult;

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
      </div>      {/* Utility Bar */}
      <div className="mb-4 flex space-x-4 w-4/5 mx-auto" style={{ maxWidth: '100%' }}>
        <SearchInput
          value={search}
          onChange={(value) => { setSearch(value); setCurrentPage(1); }}
          placeholder="Search by disease name, package name, symptoms..."
          className="flex-1"
        />
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
          showDropdown={false}
          setShowDropdown={() => {}}
          placeholder="Tag"
        />
      </div>
      <div className="space-y-4 w-4/5 mx-auto">
        {pagedPackages.map(pkg => (
          <div key={pkg.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between bg-gray-50 hover:shadow w-full">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TypeBadge label={pkg.panelType} className={TYPE_BADGE_STYLES[pkg.panelType] || ''} />
                {pkg.panelTag && <TagBadge label={pkg.panelTag} className={TAG_BADGE_STYLES[pkg.panelTag] || ''} />}
              </div>
              <div className="font-bold text-lg mb-1">{pkg.panelName}</div>
              <div className="text-gray-600 text-sm mb-1">{pkg.description}</div>
              <div className="text-gray-400 text-xs">Results in {pkg.responseTime} hours</div>
            </div>
            <div className="flex flex-col items-end mt-4 md:mt-0 md:ml-4">
              {/* Price and consultation info can be added if available in API */}
              <div className="flex gap-2">
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
                  onClick={() => navigate('/customer/sti-tests/book', { state: { panelId: pkg.id } })}
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

export default Panels;
