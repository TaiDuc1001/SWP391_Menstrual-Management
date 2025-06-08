import React from 'react';
import TitleBar from '../../components/TitleBar/TitleBar';
import calendarIcon from '../../assets/icons/calendar.svg';
import bloodTestingImage from '../../assets/images/blood-testing.svg';

const BookTestPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <TitleBar
          text="Đặt lịch xét nghiệm"
          buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
          onButtonClick={() => window.history.back()}
        />
        <div className="bg-white rounded-xl shadow-md p-8 mt-4 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-2 mb-6">
              <img src={require('../../assets/icons/calendar.svg').default} alt="calendar" className="w-8 h-8 text-pink-500" />
              <span className="text-xl font-bold text-pink-600">Đặt lịch xét nghiệm</span>
            </div>
            <form className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-semibold mb-1">Ngày</label>
                  <input type="date" className="w-full border rounded px-4 py-2" />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-semibold mb-1">Khung giờ</label>
                  <select className="w-full border rounded px-4 py-2">
                    <option>07:00 - 09:00</option>
                    <option>09:00 - 11:00</option>
                    <option>13:00 - 15:00</option>
                    <option>15:00 - 17:00</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Ghi chú thêm</label>
                <input type="text" className="w-full border rounded px-4 py-2" placeholder="Nhập nội dung nếu cần..." />
              </div>
              <button type="submit" className="w-full bg-pink-400 text-white font-bold py-3 rounded-lg mt-4 flex items-center justify-center gap-2 text-lg hover:bg-pink-500 transition">
                <img src={calendarIcon} alt="calendar" className="w-6 h-6" />
                Xác nhận đặt lịch
              </button>
            </form>
          </div>
          <div className="hidden md:block">
            <img src={bloodTestingImage} alt="lab test" className="w-80 h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTestPage;
