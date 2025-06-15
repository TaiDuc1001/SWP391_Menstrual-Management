import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TestType {
  id: number;
  name: string;
  normalRange: string;
}

interface SampledData {
  id: number;
  testTypes: TestType[];
  date: string;
  timeRange: string;
  customerName: string;
  staffName: string;
  examinationStatus: string;
}

interface TestDetail {
  id: string;
  name: string;
  result: string;
  normal: string;
  value: string;
  normalValue: string;
  note: string;
}

interface FormUpdateTestResultProps {
  open: boolean;
  onClose: () => void;
  request: any;
  onUpdateSuccess?: () => void; // Thêm prop để refresh
}

const FormUpdateTestResult: React.FC<FormUpdateTestResultProps> = ({ open, onClose, request, onUpdateSuccess }) => {
  const [details, setDetails] = useState<TestDetail[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [sampledData, setSampledData] = useState<SampledData | null>(null);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const fetchSampledData = async () => {
      try {
        const response = await axios.get<SampledData>(`http://localhost:8080/api/examinations/sampled/${request.id}`);
        setSampledData(response.data);
        // Cập nhật details với tên hạng mục từ API
        const newDetails = response.data.testTypes.map(type => ({
          id: type.id.toString(),
          name: type.name,
          result: '',
          normal: type.normalRange,
          value: '',
          normalValue: type.normalRange,
          note: '',
        }));
        setDetails(newDetails);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu hạng mục:', error);
      }
    };

    if (request?.id) {
      fetchSampledData();
    }
  }, [request?.id]);

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
    if (!validateForm()) {
      return;
    }

    try {
      const testResults = details.map(detail => ({
        testTypeId: parseInt(detail.id),
        name: detail.name,
        diagnosis: detail.result === 'Positive', // Dương tính = true, Âm tính = false
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

      const response = await axios.put(`http://localhost:8080/api/examinations/examined/${request.id}`, payload);
      if (response.status === 200) {
        setSuccessMessage('Cập nhật kết quả xét nghiệm thành công!');
        // Đóng form và refresh sau 1.5 giây
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
          if (onUpdateSuccess) {
            onUpdateSuccess(); // Gọi hàm refresh từ component cha
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật kết quả:', error);
      setError('Có lỗi xảy ra khi cập nhật kết quả. Vui lòng thử lại.');
    }
  };

  if (!open) return null;

  const handleDetailChange = (idx: number, key: keyof TestDetail, value: string) => {
    setDetails(prev => prev.map((d, i) => i === idx ? { ...d, [key]: value } : d));
  };

  const handleAddRow = () => {
    setDetails(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
        result: '',
        normal: '',
        value: '',
        normalValue: '',
        note: '',
      },
    ]);
  };

  const handleRemoveRow = (idx: number) => {
    setDetails(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-xl w-[1000px] max-w-full p-8 relative max-h-screen overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-center">
            <img src={require('../../assets/icons/green-check.svg').default} alt="success" className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}
        {/* Header */}
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
        {/* Table */}
        <div className="mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2">
            Bảng cập nhật kết quả chi tiết
          </div>
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
                {details.map((row, idx) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* File upload */}
        {/* <div className="mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
            Upload file kết quả (tùy chọn)
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center bg-gray-50">
            <img src={require('../../assets/icons/upload.svg').default} alt="upload" className="w-10 h-10 mb-2 opacity-60" />
            <div className="text-gray-500 text-sm mb-2">Tải file scan kết quả xét nghiệm</div>
            <div className="text-xs text-gray-400 mb-2">Cho phép upload .pdf, .jpg, .png (Tối đa 10MB)</div>
            <label className="inline-block">
              <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
              <span className="px-4 py-1 bg-blue-500 text-white rounded-lg cursor-pointer font-semibold">Chọn file</span>
            </label>
            {file && (
              <div className="mt-2 text-xs text-gray-700">{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</div>
            )}
          </div>
        </div> */}
        {/* Note */}
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
        {/* Actions */}
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