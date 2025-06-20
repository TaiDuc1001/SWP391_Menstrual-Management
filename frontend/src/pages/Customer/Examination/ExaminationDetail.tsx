import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import StatusBadge from '../../../components/common/Badge/StatusBadge';
import calendarIcon from '../../../assets/icons/calendar.svg';
import clockIcon from '../../../assets/icons/clock.svg';
import userIcon from '../../../assets/icons/profile.svg';
import testIcon from '../../../assets/icons/tube.svg';

interface TestResult {
  testTypeId: number;
  name: string;
  diagnosis: boolean;
  testIndex: string;
  normalRange: string;
  note: string;
}

interface ExaminationDetailData {
  id: number;
  date: string;
  timeRange: string;
  customerName: string;
  staffName: string | null;
  examinationStatus: string;
  panelId: number;
  testResults?: TestResult[];
  panelName?: string;
}

const ExaminationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [examination, setExamination] = useState<ExaminationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExaminationDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/examinations/${id}`);
        setExamination(response.data);
      } catch (err) {
        console.error('Error fetching examination details:', err);
        setError('Failed to load examination details');
      } finally {
        setLoading(false);
      }
    };

    fetchExaminationDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getResultIndicator = (diagnosis: boolean, testIndex: string, normalRange: string) => {
    if (diagnosis) {
      return (
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ⚠️ Positive
          </span>
          <span className="text-red-600 text-sm">Requires attention</span>
        </div>
      );
    }
    
    const isNumeric = !isNaN(parseFloat(testIndex));
    if (isNumeric && normalRange) {
      // Simple range check for numeric values
      const value = parseFloat(testIndex);
      const ranges = normalRange.match(/(\d+\.?\d*)/g);
      if (ranges && ranges.length >= 2) {
        const min = parseFloat(ranges[0]);
        const max = parseFloat(ranges[1]);
        const isNormal = value >= min && value <= max;
        
        return (
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isNormal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isNormal ? '✅ Normal' : '⚠️ Outside Range'}
            </span>
          </div>
        );
      }
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✅ Negative
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading examination details...</p>
        </div>
      </div>
    );
  }

  if (error || !examination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error || 'Examination not found'}</p>
          <button
            onClick={() => navigate('/customer/sti-tests')}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Back to STI Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">          <button
            onClick={() => navigate('/customer/sti-tests')}
            className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-4"
          >
            <span className="mr-2">←</span>
            Back to STI Tests
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Examination Details</h1>
                <p className="text-gray-600 mt-1">EXM-{examination.id.toString().padStart(4, '0')}</p>
              </div>
              <StatusBadge status={examination.examinationStatus} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Examination Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Examination Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <img src={calendarIcon} alt="Date" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Test Date</p>
                    <p className="font-semibold text-gray-800">{formatDate(examination.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <img src={clockIcon} alt="Time" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time Slot</p>
                    <p className="font-semibold text-gray-800">{examination.timeRange}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <img src={userIcon} alt="Staff" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Staff Member</p>
                    <p className="font-semibold text-gray-800">{examination.staffName || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <img src={testIcon} alt="Panel" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Test Panel</p>
                    <p className="font-semibold text-gray-800">{examination.panelName || 'STI Test Panel'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {examination.testResults && examination.testResults.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Results</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Normal Range
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {examination.testResults.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{result.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getResultIndicator(result.diagnosis, result.testIndex, result.normalRange)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{result.testIndex}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{result.normalRange}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{result.note || '-'}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No Results Message */}
            {examination.examinationStatus.toLowerCase() === 'in_progress' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-center py-8">
                  <div className="text-blue-500 text-6xl mb-4">🔬</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Test in Progress</h3>
                  <p className="text-gray-600">Your samples are currently being processed. Results will be available soon.</p>
                </div>
              </div>
            )}

            {examination.examinationStatus.toLowerCase() === 'sampled' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-center py-8">
                  <div className="text-yellow-500 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Sample Collected</h3>
                  <p className="text-gray-600">Your samples have been collected and sent to the laboratory for analysis.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                {examination.testResults && examination.testResults.length > 0 && (
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    Download Results
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/customer/sti-tests/packages')}
                  className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
                >
                  View Test Packages
                </button>
                
                <button
                  onClick={() => navigate('/customer/sti-tests')}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Back to Tests
                </button>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">Test Scheduled</p>
                    <p className="text-sm text-gray-500">Appointment booked</p>
                  </div>
                </div>
                
                {examination.examinationStatus.toLowerCase() !== 'in_progress' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">Sample Collected</p>
                      <p className="text-sm text-gray-500">Samples taken for analysis</p>
                    </div>
                  </div>
                )}
                
                {['examined', 'completed'].includes(examination.examinationStatus.toLowerCase()) && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">Results Available</p>
                      <p className="text-sm text-gray-500">Analysis completed</p>
                    </div>
                  </div>
                )}

                {examination.examinationStatus.toLowerCase() === 'completed' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">Test Completed</p>
                      <p className="text-sm text-gray-500">All procedures finished</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Important Notes</h2>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">ℹ️</span>
                  <p>Results are for informational purposes only and should be discussed with your healthcare provider.</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-0.5">⚠️</span>
                  <p>If you have any concerns about your results, please consult with a medical professional.</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">📞</span>
                  <p>Contact our support team if you have questions about your test or results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDetail;
