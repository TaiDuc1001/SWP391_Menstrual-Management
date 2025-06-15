import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

interface TestDetail {
  id: string;
  name: string;
  result: string;
  normal: string;
  value: string;
  normalValue: string;
  note: string;
}

interface SampledData {
  id: number;
  date: string;
  timeRange: string;
  customerName: string;
  staffName: string;
  examinationStatus: string;
  panelId?: number;
}

interface FormUpdateTestResultProps {
  open: boolean;
  onClose: () => void;
  request: any;
  onUpdateSuccess?: () => void;
}

const FormUpdateTestResult: React.FC<FormUpdateTestResultProps> = ({ open, onClose, request, onUpdateSuccess }) => {
  const [details, setDetails] = useState<TestDetail[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [sampledData, setSampledData] = useState<SampledData | null>(null);
  const [panelId, setPanelId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (!(open && request?.id)) return;
    let isMounted = true;
    const fetchSampledData = async () => {
      try {
        const response = await api.get(`/examinations/${request.id}`);
        if (isMounted) {
          setSampledData(response.data);
          if (response.data && response.data.panelId) {
            setPanelId(response.data.panelId);
          }
        }
      } catch (error) {
        setError('Không thể lấy dữ liệu mẫu xét nghiệm.');
      }
    };
    fetchSampledData();
    return () => { isMounted = false; };
  }, [open, request?.id]);

  useEffect(() => {
    if (!panelId) return;
    let isMounted = true;
    const fetchPanelTestTypes = async () => {
      try {
        const response = await api.get(`/panels/${panelId}`);
        const panel = response.data;
        const testTypesNames = panel.testTypesNames || [];
        const testTypesDescriptions = panel.testTypesDescriptions || [];
        const testTypesIds = panel.testTypesIds || [];
        if (isMounted) {
          setDetails(testTypesNames.map((name: string, idx: number) => ({
            id: testTypesIds[idx]?.toString() || '',
            name,
            result: '',
            normal: testTypesDescriptions[idx] || '',
            value: '',
            normalValue: testTypesDescriptions[idx] || '',
            note: '',
          })));
        }
      } catch (error) {
        setError('Không thể lấy danh sách hạng mục xét nghiệm từ gói.');
      }
    };
    fetchPanelTestTypes();
    return () => { isMounted = false; };
  }, [panelId]);

  const validateForm = (): boolean => {
    const emptyFields = details.filter(detail => !detail.result || !detail.value);
    if (emptyFields.length > 0) {
      setError('Vui lòng điền đầy đủ kết quả và chỉ số xét nghiệm cho tất cả các hạng mục.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const testResults = details.map(detail => ({
        testTypeId: parseInt(detail.id),
        name: detail.name,
        diagnosis: detail.result === 'Positive',
        testIndex: detail.value,
        normalRange: detail.normalValue,
        note: detail.note
      }));
      const payload = {
        id: sampledData?.id,
        date: sampledData?.date,
        timeRange: sampledData?.timeRange,
        testResults: testResults,
        customerName: sampledData?.customerName,
        staffName: sampledData?.staffName,
        examinationStatus: sampledData?.examinationStatus
      };
      const response = await api.put(`/examinations/examined/${request.id}`, payload);
      if (response.status === 200) {
        setSuccessMessage('Cập nhật kết quả xét nghiệm thành công!');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
          if (onUpdateSuccess) onUpdateSuccess();
        }, 1500);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật kết quả. Vui lòng thử lại.');
    }
  };

  if (!open) return null;

  const handleDetailChange = (idx: number, key: keyof TestDetail, value: string) => {
    setDetails(prev => prev.map((d, i) => i === idx ? { ...d, [key]: value } : d));
  };

  const handleCancel = () => { onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-xl w-[1000px] max-w-full p-8 relative max-h-screen overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-center">
            <img src={require('../../assets/icons/green-check.svg').default} alt="success" className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <img src={require('../../assets/icons/testing.svg').default} alt="icon" className="w-6 h-6" />
            <span className="text-lg font-bold">Cập nhật kết quả xét nghiệm</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">Ngày xét nghiệm:</div>
              <div className="font-semibold">{sampledData?.date || '22/06/2025'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Người kiểm:</div>
              <div className="font-semibold">{sampledData?.staffName || 'Nhân viên XYZ'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Loại:</div>
              <div className="font-semibold">{request?.panelName || 'Gói xét nghiệm chưa rõ'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Mã:</div>
              <div className="font-semibold">{sampledData?.id || 'STXN-20250522-001'}</div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2">Bảng cập nhật kết quả chi tiết</div>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 font-semibold border">Hạng mục</th>
                  <th className="p-3 font-semibold border">Kết quả</th>
                  <th className="p-3 font-semibold border">Chỉ số xét nghiệm</th>
                  <th className="p-3 font-semibold border whitespace-nowrap">Mức bình thường chỉ số</th>
                  <th className="p-3 font-semibold border">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-4">Không có hạng mục xét nghiệm</td></tr>
                ) : (
                  details.map((row, idx) => (
                    <tr key={row.id}>
                      <td className="p-2 border">
                        <input
                          className="bg-gray-100 border rounded px-2 py-1 w-full text-gray-700 cursor-not-allowed"
                          value={row.name}
                          readOnly
                          disabled
                          placeholder="Hạng mục"
                        />
                      </td>
                      <td className="p-2 border">
                        <select
                          className={`border rounded px-2 py-1 w-full ${row.result === '' ? 'border-red-300 bg-red-50' : ''}`}
                          value={row.result}
                          onChange={e => handleDetailChange(idx, 'result', e.target.value)}
                        >
                          <option value="">Chọn kết quả</option>
                          <option value="Positive">Dương tính</option>
                          <option value="Negative">Âm tính</option>
                        </select>
                      </td>
                      <td className="p-2 border">
                        <input
                          className={`border rounded px-2 py-1 w-full ${row.value === '' ? 'border-red-300 bg-red-50' : ''}`}
                          value={row.value}
                          onChange={e => handleDetailChange(idx, 'value', e.target.value)}
                          placeholder="Chỉ số"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          className="bg-gray-100 border rounded px-2 py-1 w-full text-gray-700 cursor-not-allowed"
                          value={row.normalValue}
                          readOnly
                          disabled
                          placeholder="Mức bình thường chỉ số"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={row.note}
                          onChange={e => handleDetailChange(idx, 'note', e.target.value)}
                          placeholder="Ghi chú"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            Ghi chú cho khách hàng
          </div>
          <textarea
            className="w-full border rounded-xl p-3 min-h-[60px] text-sm"
            placeholder="Miêu tả chi tiết về kết quả xét nghiệm, hướng dẫn tiếp theo hoặc lưu ý quan trọng cho khách hàng."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50"
            onClick={handleCancel}
          >
            <span className="flex items-center gap-2">
              <img src={require('../../assets/icons/cancel.svg').default} alt="cancel" className="w-4 h-4" />
              Hủy bỏ
            </span>
          </button>
          <button 
            className="px-6 py-2 rounded-lg bg-green-400 text-white font-semibold hover:bg-green-500 flex items-center gap-2"
            onClick={handleSubmit}
          >
            <img src={require('../../assets/icons/green-check.svg').default} alt="update" className="w-4 h-4" />
            Cập nhật kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormUpdateTestResult;