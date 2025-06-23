import React, {useEffect, useState} from 'react';
import {Button} from '../../components/common/Button';
import {Badge} from '../../components/common/Badge';
import uploadIcon from '../../assets/icons/upload.svg';
import profileIcon from '../../assets/icons/profile.svg';
import hospitalIcon from '../../assets/icons/hospital.svg';
import clockIcon from '../../assets/icons/clock.svg';
import starIcon from '../../assets/icons/Star.svg';

interface DoctorProfile {
    id: number;
    name: string;
    avatar?: string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    experienceYears: number;
    workingHours: {
        from: string;
        to: string;
    };
    appointmentPrice: number;
    rating: number;
    totalReviews: number;
    totalPatients: number;
    description: string;
    certifications: {
        id: number;
        name: string;
        issuedBy: string;
        year: number;
        file?: string;
    }[];
    education: {
        id: number;
        degree: string;
        institution: string;
        year: number;
    }[];
    languages: string[];
    achievements: string[];
}

const MyProfile: React.FC = () => {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<Partial<DoctorProfile>>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const mockProfile: DoctorProfile = {
            id: 1,
            name: "TS.BS Nguyễn Thị Hoa",
            avatar: "",
            email: "hoa.nguyen@example.com",
            phone: "0912345678",
            specialization: "Sản phụ khoa",
            qualification: "Tiến sĩ Y khoa",
            experienceYears: 15,
            workingHours: {
                from: "08:00",
                to: "17:00"
            },
            appointmentPrice: 500000,
            rating: 4.8,
            totalReviews: 256,
            totalPatients: 1250,
            description: "Chuyên gia với hơn 15 năm kinh nghiệm trong lĩnh vực sản phụ khoa. Chuyên điều trị các bệnh lý phụ khoa, thai sản và vô sinh hiếm muộn.",
            certifications: [
                {
                    id: 1,
                    name: "Chứng chỉ hành nghề khám chữa bệnh",
                    issuedBy: "Bộ Y tế",
                    year: 2010
                },
                {
                    id: 2,
                    name: "Chứng nhận chuyên khoa Sản Phụ khoa",
                    issuedBy: "Bệnh viện Phụ sản Trung ương",
                    year: 2012
                }
            ],
            education: [
                {
                    id: 1,
                    degree: "Tiến sĩ Y khoa",
                    institution: "Đại học Y Hà Nội",
                    year: 2015
                },
                {
                    id: 2,
                    degree: "Bác sĩ Chuyên khoa II",
                    institution: "Đại học Y Hà Nội",
                    year: 2010
                }
            ],
            languages: ["Tiếng Việt", "Tiếng Anh"],
            achievements: [
                "Giải thưởng Bác sĩ xuất sắc năm 2020",
                "Đã thực hiện hơn 1000 ca phẫu thuật thành công",
                "Tham gia nhiều dự án nghiên cứu về sức khỏe phụ nữ"
            ]
        };

        setProfile(mockProfile);
        setEditedProfile(mockProfile);
    }, []);

    const handleInputChange = (field: keyof DoctorProfile, value: any) => {
        setEditedProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditedProfile(prev => ({
                    ...prev,
                    avatar: e.target?.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            
            await new Promise(resolve => setTimeout(resolve, 1000));

            
            setProfile(prev => ({
                ...prev!,
                ...editedProfile
            }));

            setSuccessMessage('Thông tin đã được cập nhật thành công');
            setIsEditing(false);

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
                        <p className="text-gray-600">Quản lý thông tin và hồ sơ chuyên môn của bạn</p>
                    </div>
                    <Button
                        variant={isEditing ? "secondary" : "primary"}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
                    </Button>
                </div>

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="space-y-6">
                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                                        {editedProfile.avatar ? (
                                            <img
                                                src={editedProfile.avatar}
                                                alt="MyProfile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <img src={profileIcon} alt="" className="w-16 h-16 text-gray-400"/>
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label
                                            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                            <img src={uploadIcon} alt="upload" className="w-5 h-5"/>
                                        </label>
                                    )}
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="text-xl font-semibold text-center w-full p-2 border rounded"
                                        value={editedProfile.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                ) : (
                                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                                )}
                                <p className="text-gray-600 mt-1">{profile.qualification}</p>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <img src={hospitalIcon} alt="" className="w-5 h-5"/>
                                    <span>{profile.specialization}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <img src={clockIcon} alt="" className="w-5 h-5"/>
                                    <span>{profile.workingHours.from} - {profile.workingHours.to}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <img src={starIcon} alt="" className="w-5 h-5"/>
                                    <span>{profile.rating} ★ ({profile.totalReviews} đánh giá)</span>
                                </div>
                            </div>
                        </div>

                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Thống kê</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-pink-50 rounded-lg">
                                    <div className="text-2xl font-bold text-pink-600">{profile.totalPatients}</div>
                                    <div className="text-sm text-gray-600">Bệnh nhân</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{profile.experienceYears}</div>
                                    <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{profile.totalReviews}</div>
                                    <div className="text-sm text-gray-600">Đánh giá</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{profile.rating}/5</div>
                                    <div className="text-sm text-gray-600">Điểm đánh giá</div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="w-full p-2 border rounded mt-1"
                                            value={editedProfile.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-800">{profile.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Số điện thoại</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            className="w-full p-2 border rounded mt-1"
                                            value={editedProfile.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-800">{profile.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Giới thiệu</h3>
                            {isEditing ? (
                                <textarea
                                    className="w-full p-3 border rounded min-h-[150px]"
                                    value={editedProfile.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            ) : (
                                <p className="text-gray-700 whitespace-pre-wrap">{profile.description}</p>
                            )}
                        </div>

                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Học vấn</h3>
                            <div className="space-y-4">
                                {(isEditing ? editedProfile.education : profile.education)?.map((edu, index) => (
                                    <div key={edu.id}
                                         className="flex justify-between items-start border-b pb-4 last:border-0">
                                        <div>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded"
                                                        value={edu.degree}
                                                        onChange={(e) => {
                                                            const updatedEducation = [...(editedProfile.education || [])];
                                                            updatedEducation[index] = {...edu, degree: e.target.value};
                                                            handleInputChange('education', updatedEducation);
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded"
                                                        value={edu.institution}
                                                        onChange={(e) => {
                                                            const updatedEducation = [...(editedProfile.education || [])];
                                                            updatedEducation[index] = {
                                                                ...edu,
                                                                institution: e.target.value
                                                            };
                                                            handleInputChange('education', updatedEducation);
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="font-medium text-gray-800">{edu.degree}</div>
                                                    <div className="text-gray-600">{edu.institution}</div>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-gray-500">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className="w-24 p-2 border rounded"
                                                    value={edu.year}
                                                    onChange={(e) => {
                                                        const updatedEducation = [...(editedProfile.education || [])];
                                                        updatedEducation[index] = {
                                                            ...edu,
                                                            year: parseInt(e.target.value)
                                                        };
                                                        handleInputChange('education', updatedEducation);
                                                    }}
                                                />
                                            ) : (
                                                edu.year
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isEditing && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            const newEducation = [...(editedProfile.education || []), {
                                                id: Date.now(),
                                                degree: '',
                                                institution: '',
                                                year: new Date().getFullYear()
                                            }];
                                            handleInputChange('education', newEducation);
                                        }}
                                    >
                                        Thêm học vấn
                                    </Button>
                                )}
                            </div>
                        </div>

                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Chứng chỉ</h3>
                            <div className="space-y-4">
                                {(isEditing ? editedProfile.certifications : profile.certifications)?.map((cert, index) => (
                                    <div key={cert.id}
                                         className="flex justify-between items-start border-b pb-4 last:border-0">
                                        <div>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded"
                                                        value={cert.name}
                                                        onChange={(e) => {
                                                            const updatedCerts = [...(editedProfile.certifications || [])];
                                                            updatedCerts[index] = {...cert, name: e.target.value};
                                                            handleInputChange('certifications', updatedCerts);
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded"
                                                        value={cert.issuedBy}
                                                        onChange={(e) => {
                                                            const updatedCerts = [...(editedProfile.certifications || [])];
                                                            updatedCerts[index] = {...cert, issuedBy: e.target.value};
                                                            handleInputChange('certifications', updatedCerts);
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="font-medium text-gray-800">{cert.name}</div>
                                                    <div className="text-gray-600">{cert.issuedBy}</div>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-gray-500">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className="w-24 p-2 border rounded"
                                                    value={cert.year}
                                                    onChange={(e) => {
                                                        const updatedCerts = [...(editedProfile.certifications || [])];
                                                        updatedCerts[index] = {...cert, year: parseInt(e.target.value)};
                                                        handleInputChange('certifications', updatedCerts);
                                                    }}
                                                />
                                            ) : (
                                                cert.year
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isEditing && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            const newCerts = [...(editedProfile.certifications || []), {
                                                id: Date.now(),
                                                name: '',
                                                issuedBy: '',
                                                year: new Date().getFullYear()
                                            }];
                                            handleInputChange('certifications', newCerts);
                                        }}
                                    >
                                        Thêm chứng chỉ
                                    </Button>
                                )}
                            </div>
                        </div>

                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="font-semibold text-gray-800 mb-4">Ngôn ngữ</h3>
                                <div className="space-y-2">
                                    {(isEditing ? editedProfile.languages : profile.languages)?.map((lang, index) => (
                                        <div key={index}>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border rounded"
                                                    value={lang}
                                                    onChange={(e) => {
                                                        const updatedLangs = [...(editedProfile.languages || [])];
                                                        updatedLangs[index] = e.target.value;
                                                        handleInputChange('languages', updatedLangs);
                                                    }}
                                                />
                                            ) : (
                                                <Badge variant="primary">{lang}</Badge>
                                            )}
                                        </div>
                                    ))}
                                    {isEditing && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                const newLangs = [...(editedProfile.languages || []), ''];
                                                handleInputChange('languages', newLangs);
                                            }}
                                        >
                                            Thêm ngôn ngữ
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="font-semibold text-gray-800 mb-4">Thành tựu</h3>
                                <div className="space-y-2">
                                    {(isEditing ? editedProfile.achievements : profile.achievements)?.map((achievement, index) => (
                                        <div key={index}>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border rounded"
                                                    value={achievement}
                                                    onChange={(e) => {
                                                        const updatedAchievements = [...(editedProfile.achievements || [])];
                                                        updatedAchievements[index] = e.target.value;
                                                        handleInputChange('achievements', updatedAchievements);
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-yellow-500">★</span>
                                                    <span>{achievement}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {isEditing && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                const newAchievements = [...(editedProfile.achievements || []), ''];
                                                handleInputChange('achievements', newAchievements);
                                            }}
                                        >
                                            Thêm thành tựu
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                {isEditing && (
                    <div className="fixed bottom-6 right-6 flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsEditing(false);
                                setEditedProfile(profile);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProfile;
