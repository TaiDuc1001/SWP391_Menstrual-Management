import React, { useState } from 'react';

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
  requestInfo?: {
    date: string;
    staff: string;
    type: string;
    code: string;
  };
}

const initialDetails: TestDetail[] = [
  {
    id: '1',
    name: 'HIV Ag/Ab Combo',
    result: '',
    normal: 'Âm tính',
    value: '',
    normalValue: 'S/CO < 1.0',
    note: '',
  },
  {
    id: '2',
    name: 'TPHA (Giang mai)',
    result: '',
    normal: 'Âm tính',
    value: '',
    normalValue: 'Không phát hiện',
    note: '',
  },
  {
    id: '3',
    name: 'Lậu cầu PCR',
    result: '',
    normal: 'Âm tính',
    value: '',
    normalValue: 'A450 ≤ 0.2',
    note: '',
  },
];

const FormUpdateTestResult: React.FC<FormUpdateTestResultProps & { request?: any }> = ({ open, onClose, requestInfo, request }) => {
  const [details, setDetails] = useState<TestDetail[]>(initialDetails);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');

  if (!open) return null;

  const info = requestInfo || request;

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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <img src={require('../../assets/icons/testing.svg').default} alt="icon" className="w-6 h-6" />
            <span className="text-lg font-bold">Cập nhật kết quả xét nghiệm</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">Ngày xét nghiệm:</div>
              <div className="font-semibold">{info?.date || '22/06/2025'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Người kiểm:</div>
              <div className="font-semibold">{info?.staff || 'Nhân viên XYZ'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Loại:</div>
              <div className="font-semibold">{info?.type || 'HIV, Lậu, Giang mai'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Mã:</div>
              <div className="font-semibold">{info?.code || 'STXN-20250522-001'}</div>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2">
            Bảng cập nhật kết quả chi tiết
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 font-semibold">Hạng mục</th>
                  <th className="p-3 font-semibold">Kết quả</th>
                  <th className="p-3 font-semibold whitespace-nowrap">Mức bình thường</th>
                  <th className="p-3 font-semibold">Chỉ số xét nghiệm</th>
                  <th className="p-3 font-semibold whitespace-nowrap">Mức bình thường chỉ số</th>
                  <th className="p-3 font-semibold">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {details.map((row, idx) => (
                  <tr key={row.id}>
                    <td className="p-2">
                      <input
                        className="border rounded px-2 py-1 w-36"
                        value={row.name}
                        onChange={e => handleDetailChange(idx, 'name', e.target.value)}
                        placeholder="Hạng mục"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={`border rounded px-2 py-1 w-24 ${row.result === '' ? 'border-red-300 bg-red-50' : ''}`}
                        value={row.result}
                        onChange={e => handleDetailChange(idx, 'result', e.target.value)}
                        placeholder="Kết quả"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="border rounded px-2 py-1 w-24"
                        value={row.normal}
                        onChange={e => handleDetailChange(idx, 'normal', e.target.value)}
                        placeholder="Mức bình thường"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={`border rounded px-2 py-1 w-24 ${row.value === '' ? 'border-red-300 bg-red-50' : ''}`}
                        value={row.value}
                        onChange={e => handleDetailChange(idx, 'value', e.target.value)}
                        placeholder="Chỉ số"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="border rounded px-2 py-1 w-28"
                        value={row.normalValue}
                        onChange={e => handleDetailChange(idx, 'normalValue', e.target.value)}
                        placeholder="Mức bình thường chỉ số"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="border rounded px-2 py-1 w-32"
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
          {/* <button className="px-6 py-2 rounded-lg bg-yellow-400 text-white font-semibold hover:bg-yellow-500 flex items-center gap-2">
            <img src={require('../../assets/icons/draft.svg').default} alt="draft" className="w-4 h-4" />
            Lưu nháp
          </button> */}
          <button className="px-6 py-2 rounded-lg bg-green-400 text-white font-semibold hover:bg-green-500 flex items-center gap-2">
            <img src={require('../../assets/icons/green-check.svg').default} alt="update" className="w-4 h-4" />
            Cập nhật kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormUpdateTestResult;