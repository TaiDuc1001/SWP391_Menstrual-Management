import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TitleBar from '../../components/TitleBar/TitleBar';
import ActionButton from '../../components/Button/ActionButton';

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

const STIPackageDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = availablePackages.find(p => p.id === Number(id));

  if (!pkg) {
    return <div className="p-8 text-center">Package not found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <TitleBar
          text={pkg.label}
          buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
          onButtonClick={() => navigate(-1)}
        />
        <div className="bg-white rounded-xl shadow-md p-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-pink-500 font-bold text-2xl">{pkg.price}</div>
            <div className="text-gray-400 text-xs">{pkg.priceNote}</div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-1">Tests included:</div>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><b>HIV I/II (Quick test):</b> Detects both HIV type 1 and 2 antibodies for early diagnosis. Example: "A rapid finger-prick test for HIV antibodies, results in 20 minutes."</li>
              <li><b>Syphilis (TPHA):</b> Screens for syphilis infection using Treponema pallidum hemagglutination assay. Example: "Blood test to check for syphilis antibodies, recommended for anyone with new sexual partners."</li>
              <li><b>Chlamydia Testing:</b> Identifies Chlamydia trachomatis infection, a common cause of urethritis. Example: "Urine sample test for Chlamydia, especially for those with burning sensation during urination."</li>
              <li><b>Gonorrhea Testing:</b> Detects Neisseria gonorrhoeae bacteria. Example: "Swab or urine test for gonorrhea, useful if experiencing unusual discharge."</li>
              <li><b>Herpes Simplex Virus 1/2 (HSV):</b> Checks for both HSV-1 and HSV-2, which can cause genital or oral herpes. Example: "Blood test for HSV antibodies, even if no visible sores are present."</li>
              <li><b>HPV (Human Papillomavirus):</b> Screens for high-risk HPV strains linked to cervical cancer. Example: "Swab test for HPV, recommended for women over 21 or with abnormal Pap smears."</li>
              <li><b>Hepatitis B (HBsAg):</b> Detects Hepatitis B surface antigen to identify active infection. Example: "Blood test for Hepatitis B, important for those with multiple partners or unprotected sex."</li>
            </ul>
          </div>
          <div className="mb-2 text-gray-600">Sample type: {pkg.sampleType}</div>
          <div className="mb-2 text-gray-600">{pkg.resultTime}</div>
          <div className="mb-2 text-gray-600">Consultation: {pkg.consultation}</div>
          <div className="flex gap-4 mt-6">
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
    </div>
  );
};

export default STIPackageDetail;
