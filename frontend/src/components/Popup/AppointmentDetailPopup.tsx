import React from 'react';
import StatusBadge from '../Badge/StatusBadge';
import Popup from './Popup';

interface AppointmentDetailPopupProps {
  open: boolean;
  onClose: () => void;
  appointment: {
    name: string;
    code: string;
    date: string;
    time: string;
    status: string;
    problem: string;
    doctorNote: string;
    rating?: number;
    ratingComment?: string;
  };
}

const AppointmentDetailPopup: React.FC<AppointmentDetailPopupProps> = ({ open, onClose, appointment }) => {
  if (!open) return null;
  return (
    <Popup open={open} onClose={onClose}>
      <div className="p-6 max-w-2xl w-full">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
            {/* Avatar placeholder: simple circle */}
            <span className="w-10 h-10 rounded-full bg-gray-300 block"></span>
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold">{appointment.name}</div>
            <div className="text-xs text-blue-600 font-medium">ID: {appointment.code}</div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2 text-sm">
          <span className="flex items-center gap-1">
            <img src={require('../../assets/icons/calendar.svg').default} alt="calendar" className="w-4 h-4" />
            {appointment.date} - {appointment.time}
          </span>
          <span className="flex items-center gap-1">
            <img src={require('../../assets/icons/tube.svg').default} alt="type" className="w-4 h-4" />
            Hình thức: <span className="font-medium text-gray-800">Trực tuyến</span>
          </span>
          <span className="flex items-center gap-1">
            <img src={require('../../assets/icons/camera.svg').default} alt="meeting" className="w-4 h-4" />
            Địa điểm: <a href="https://zoom.us/mock-link" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Zoom Meeting</a>
          </span>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4 flex-1 border border-blue-100">
            <div className="font-semibold mb-1 text-blue-700 flex items-center gap-1">
              <i className="fa-regular fa-comment-dots" /> Mô tả vấn đề
            </div>
            <div className="text-gray-700 text-sm">
              {appointment.problem || 'Gần đây tôi có quan hệ không sử dụng biện pháp bảo vệ và xuất hiện cảm giác ngứa, rát khi tiểu tiện. Tôi lo lắng có thể bị nhiễm bệnh lây qua đường tình dục (STI). Mong được tư vấn về các triệu chứng và làm xét nghiệm cần thiết.'}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex-1 border border-green-100">
            <div className="font-semibold mb-1 text-green-700 flex items-center gap-1">
              <i className="fa-regular fa-notes-medical" /> Ghi chú từ bác sĩ
            </div>
            <div className="text-gray-700 text-sm">
              {appointment.doctorNote || 'Nghi ngờ nhiễm STI – cần xét nghiệm thêm. Tránh quan hệ tình dục cho đến khi có kết quả. Hẹn tái khám sau 7 ngày.'}
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-100">
          <div className="font-semibold mb-1 text-yellow-700 flex items-center gap-1">
            <i className="fa-regular fa-star" /> Đánh giá buổi tư vấn
          </div>
          <div className="flex items-center gap-2 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < (appointment.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
            ))}
            <span className="text-gray-600 text-sm font-medium">{appointment.rating || '4'} / 5</span>
          </div>
          <div className="text-gray-600 text-sm mb-2">{appointment.ratingComment || 'Bác sĩ tư vấn rõ ràng, nhiệt tình. Hẹn đặt lịch rất thuận tiện.'}</div>
          <a href="#" className="text-blue-600 text-sm underline flex items-center gap-1"><i className="fa-regular fa-paper-plane" />Gửi phản hồi mới</a>
        </div>
        <div className="flex justify-between mt-6 gap-2">
          <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold" onClick={onClose}>Quay lại</button>
          <button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold">Đặt lại lịch</button>
          <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold">Ẩn lịch sử</button>
        </div>
      </div>
    </Popup>
  );
};

export default AppointmentDetailPopup;
