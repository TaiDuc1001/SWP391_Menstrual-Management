import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';

const mockAdvisors = [
  {
    id: 1,
    name: 'Dr. Nguyễn Văn A',
    avatar: '',
    rating: 4.5,
    reviews: 45,
    appointments: 133,
    specialization: 'General',
    bio: 'Experienced general practitioner with a focus on preventive care and women’s health.',
  },
  {
    id: 2,
    name: 'Dr. Trần Thị B',
    avatar: '',
    rating: 4.8,
    reviews: 60,
    appointments: 200,
    specialization: 'Gynecology',
    bio: 'Specialist in gynecology with 10+ years of experience in reproductive health.',
  },
  {
    id: 3,
    name: 'Dr. Lê Văn C',
    avatar: '',
    rating: 4.2,
    reviews: 30,
    appointments: 90,
    specialization: 'Endocrinology',
    bio: 'Expert in endocrinology, focusing on hormonal disorders and diabetes care.',
  },
  {
    id: 4,
    name: 'Dr. Phạm Thị D',
    avatar: '',
    rating: 4.9,
    reviews: 80,
    appointments: 250,
    specialization: 'Obstetrics',
    bio: 'Obstetrician with a passion for maternal and fetal medicine.',
  },
  {
    id: 5,
    name: 'Dr. Nguyễn Thị E',
    avatar: '',
    rating: 4.7,
    reviews: 55,
    appointments: 180,
    specialization: 'General',
    bio: 'General doctor with a holistic approach to patient care.',
  },
  {
    id: 6,
    name: 'Dr. Đặng Văn F',
    avatar: '',
    rating: 4.3,
    reviews: 38,
    appointments: 120,
    specialization: 'Gynecology',
    bio: 'Gynecologist with expertise in minimally invasive procedures.',
  },
  {
    id: 7,
    name: 'Dr. Hồ Thị G',
    avatar: '',
    rating: 4.6,
    reviews: 70,
    appointments: 210,
    specialization: 'Obstetrics',
    bio: 'Obstetrician dedicated to safe and supportive childbirth experiences.',
  },
  {
    id: 8,
    name: 'Dr. Vũ Văn H',
    avatar: '',
    rating: 4.1,
    reviews: 25,
    appointments: 80,
    specialization: 'Endocrinology',
    bio: 'Endocrinologist with a focus on thyroid and metabolic disorders.',
  },
];

const DoctorDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = mockAdvisors.find(d => d.id === Number(id));

  if (!doctor) {
    return <div className="p-8 text-center">Doctor not found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <TitleBar
          text={doctor.name}
          buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
          onButtonClick={() => navigate(-1)}
        />
        <div className="bg-white rounded-xl shadow-md p-6 mt-4">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
              {/* Avatar placeholder */}
              {doctor.name.split(' ').slice(-1)[0][0]}
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800 mb-1">{doctor.name}</div>
              <div className="text-gray-600 mb-1">Specialization: <span className="font-semibold">{doctor.specialization}</span></div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="text-yellow-500 font-bold">{doctor.rating} ★</span>
                <span>({doctor.reviews} reviews)</span>
                <span className="ml-2 text-xs text-gray-400">({doctor.appointments} appointments given)</span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-1">About</div>
            <div className="text-gray-700">{doctor.bio}</div>
          </div>
          <button
            className="mt-4 px-6 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white font-semibold"
            onClick={() => navigate('/customer/appointments/book')}
          >Book appointment</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
