import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    badge: 'Comprehensive',
    badgeColor: 'bg-blue-100 text-blue-600',
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
    badge: 'Specialized',
    badgeColor: 'bg-orange-100 text-orange-600',
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
    badge: 'Preventive',
    badgeColor: 'bg-yellow-100 text-yellow-600',
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
    badge: 'Preventive',
    badgeColor: 'bg-yellow-100 text-yellow-600',
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
    badge: 'Specialized',
    badgeColor: 'bg-orange-100 text-orange-600',
    sampleType: 'Blood, Swab',
    consultation: 'Includes free teleconsultation',
  },
];

const PACKAGES_PER_PAGE = 4;

const STIPackages: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(availablePackages.length / PACKAGES_PER_PAGE);

  const startIdx = (currentPage - 1) * PACKAGES_PER_PAGE;
  const endIdx = startIdx + PACKAGES_PER_PAGE;
  const pagedPackages = availablePackages.slice(startIdx, endIdx);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">Available Packages</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>
      <div className="space-y-4 max-w-2xl mx-auto">
        {pagedPackages.map(pkg => (
          <div key={pkg.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between bg-gray-50 hover:shadow">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${pkg.badgeColor}`}>{pkg.badge}</span>
                {pkg.tags.map(tag => (
                  <span key={tag} className="ml-2 px-2 py-1 rounded bg-green-100 text-green-600 text-xs font-semibold">{tag}</span>
                ))}
                {pkg.tags.includes('Popular') && (
                  <span className="ml-2 px-2 py-1 rounded bg-pink-100 text-pink-600 text-xs font-semibold">Popular</span>
                )}
              </div>
              <div className="font-bold text-lg mb-1">{pkg.label}</div>
              <div className="text-gray-600 text-sm mb-1">{pkg.tests}</div>
              <div className="text-gray-400 text-xs">{pkg.resultTime}</div>
            </div>
            <div className="flex flex-col items-end mt-4 md:mt-0 md:ml-4">
              <div className="text-pink-500 font-bold text-xl">{pkg.price}</div>
              <div className="text-gray-400 text-xs mb-2">{pkg.priceNote}</div>
              <div className="flex gap-2">
                <button className="bg-pink-100 text-pink-600 px-3 py-1 rounded font-semibold text-sm hover:bg-pink-200">Learn more</button>
                <button className="bg-pink-500 text-white px-4 py-1 rounded font-semibold text-sm hover:bg-pink-600">Book</button>
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
