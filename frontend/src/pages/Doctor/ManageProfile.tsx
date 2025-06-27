import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import uploadIcon from '../../assets/icons/upload.svg';
import profileIcon from '../../assets/icons/profile.svg';
import { doctorService, DoctorProfile } from '../../api/services/doctorService';
import { mockDoctorService } from '../../api/services/mockDoctorService';
import { SimpleNotification, useSimpleNotification } from '../../components/common/SimpleNotification';

// Toggle between real API and mock for testing
const USE_MOCK_API = true;

interface ManageProfileProps {
    isFirstTime?: boolean;
}

const ManageProfile: React.FC<ManageProfileProps> = ({ isFirstTime = false }) => {
    const navigate = useNavigate();
    const { notification, showNotification, hideNotification } = useSimpleNotification();
    const [profile, setProfile] = useState<Partial<DoctorProfile>>({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        qualification: '',
        experienceYears: 0,
        workingHours: { from: '08:00', to: '17:00' },
        appointmentPrice: 0,
        description: '',
        certifications: [],
        education: [],
        languages: ['Tiếng Việt'],
        achievements: []
    });
    
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load existing profile if not first time
    useEffect(() => {
        const loadProfile = async () => {
            if (!isFirstTime) {
                try {
                    const service = USE_MOCK_API ? mockDoctorService : doctorService;
                    const response = await service.getDoctorProfile();
                    if (response.data) {
                        setProfile(response.data);
                        if (response.data.avatar) {
                            setAvatarPreview(response.data.avatar);
                        }
                    }
                } catch (error) {
                    console.error('Error loading profile:', error);
                }
            }
        };

        const loadSpecializations = async () => {
            try {
                const service = USE_MOCK_API ? mockDoctorService : doctorService;
                const response = await service.getSpecializations();
                setSpecializations(response.data || [
                    'Sản phụ khoa',
                    'Nội tiết - Tuyến vú',
                    'Nội khoa tổng quát',
                    'Tâm lý học',
                    'Dinh dưỡng',
                    'Y học gia đình'
                ]);
            } catch (error) {
                console.error('Error loading specializations:', error);
                setSpecializations([
                    'Sản phụ khoa',
                    'Nội tiết - Tuyến vú',
                    'Nội khoa tổng quát',
                    'Tâm lý học',
                    'Dinh dưỡng',
                    'Y học gia đình'
                ]);
            }
        };

        loadProfile();
        loadSpecializations();
    }, [isFirstTime]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!profile.name?.trim()) {
            newErrors.name = 'Họ tên không được để trống';
        }

        if (!profile.email?.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!profile.phone?.trim()) {
            newErrors.phone = 'Số điện thoại không được để trống';
        } else if (!/^[0-9]{10,11}$/.test(profile.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!profile.specialization) {
            newErrors.specialization = 'Vui lòng chọn chuyên khoa';
        }

        if (!profile.qualification?.trim()) {
            newErrors.qualification = 'Trình độ chuyên môn không được để trống';
        }

        if (!profile.experienceYears || profile.experienceYears < 0) {
            newErrors.experienceYears = 'Số năm kinh nghiệm không hợp lệ';
        }

        if (!profile.appointmentPrice || profile.appointmentPrice <= 0) {
            newErrors.appointmentPrice = 'Giá khám không hợp lệ';
        }

        if (!profile.description?.trim()) {
            newErrors.description = 'Mô tả không được để trống';
        }

        if (profile.education && profile.education.length === 0) {
            newErrors.education = 'Vui lòng thêm ít nhất một bằng cấp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof DoctorProfile, value: any) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({ ...prev, avatar: 'Ảnh không được vượt quá 5MB' }));
                return;
            }

            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            
            // Clear avatar error
            setErrors(prev => ({ ...prev, avatar: '' }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const service = USE_MOCK_API ? mockDoctorService : doctorService;
            
            // Upload avatar first if exists
            let avatarUrl = profile.avatar;
            if (avatarFile) {
                const avatarResponse = await service.uploadAvatar(avatarFile);
                avatarUrl = avatarResponse.data.url;
            }

            // Update profile - use the form data from profile state
            const profileData = {
                ...profile,
                avatar: avatarUrl
            };

            console.log('Submitting profile data:', profileData); // Debug log

            const response = await service.updateDoctorProfile(profileData);
            console.log('Profile update response:', response); // Debug log

            // Show success message
            const successMessage = isFirstTime ? 'Hồ sơ đã được hoàn thiện!' : 'Cập nhật hồ sơ thành công!';
            showNotification(successMessage, 'success');

            setTimeout(() => {
                if (isFirstTime) {
                    // Redirect to dashboard after successful first-time setup
                    navigate('/doctor/dashboard');
                } else {
                    // Show success message and redirect
                    navigate('/doctor/profile');
                }
            }, 1500);
        } catch (error: any) {
            console.error('Error saving profile:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi lưu hồ sơ';
            showNotification(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addEducation = () => {
        const newEducation = {
            id: Date.now(),
            degree: '',
            institution: '',
            year: new Date().getFullYear()
        };
        handleInputChange('education', [...(profile.education || []), newEducation]);
    };

    const updateEducation = (index: number, field: string, value: any) => {
        const updatedEducation = [...(profile.education || [])];
        updatedEducation[index] = { ...updatedEducation[index], [field]: value };
        handleInputChange('education', updatedEducation);
    };

    const removeEducation = (index: number) => {
        const updatedEducation = [...(profile.education || [])];
        updatedEducation.splice(index, 1);
        handleInputChange('education', updatedEducation);
    };

    const addCertification = () => {
        const newCert = {
            id: Date.now(),
            name: '',
            issuedBy: '',
            year: new Date().getFullYear()
        };
        handleInputChange('certifications', [...(profile.certifications || []), newCert]);
    };

    const updateCertification = (index: number, field: string, value: any) => {
        const updatedCerts = [...(profile.certifications || [])];
        updatedCerts[index] = { ...updatedCerts[index], [field]: value };
        handleInputChange('certifications', updatedCerts);
    };

    const removeCertification = (index: number) => {
        const updatedCerts = [...(profile.certifications || [])];
        updatedCerts.splice(index, 1);
        handleInputChange('certifications', updatedCerts);
    };

    const addLanguage = () => {
        handleInputChange('languages', [...(profile.languages || []), '']);
    };

    const updateLanguage = (index: number, value: string) => {
        const updatedLangs = [...(profile.languages || [])];
        updatedLangs[index] = value;
        handleInputChange('languages', updatedLangs);
    };

    const removeLanguage = (index: number) => {
        const updatedLangs = [...(profile.languages || [])];
        updatedLangs.splice(index, 1);
        handleInputChange('languages', updatedLangs);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isFirstTime ? 'Hoàn thiện hồ sơ bác sĩ' : 'Quản lý hồ sơ'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isFirstTime 
                            ? 'Vui lòng điền đầy đủ thông tin để hoàn thiện hồ sơ của bạn'
                            : 'Cập nhật thông tin và hồ sơ chuyên môn của bạn'
                        }
                    </p>
                    {isFirstTime && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800">
                                <strong>Lưu ý:</strong> Bạn cần hoàn thiện hồ sơ trước khi có thể sử dụng đầy đủ các tính năng của hệ thống.
                            </p>
                        </div>
                    )}
                </div>

                <form className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin cơ bản</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Avatar */}
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <img src={profileIcon} alt="" className="w-16 h-16 text-gray-400"/>
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 border">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                        <img src={uploadIcon} alt="upload" className="w-5 h-5"/>
                                    </label>
                                </div>
                                {errors.avatar && (
                                    <p className="text-red-500 text-sm">{errors.avatar}</p>
                                )}
                                <p className="text-sm text-gray-500 text-center">
                                    Tải lên ảnh đại diện<br/>
                                    (Tối đa 5MB)
                                </p>
                            </div>

                            {/* Basic Fields */}
                            <div className="lg:col-span-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        value={profile.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Vd: TS.BS Nguyễn Văn A"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={profile.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="example@email.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={profile.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="0912345678"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin chuyên môn</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chuyên khoa <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.specialization ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={profile.specialization}
                                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                                >
                                    <option value="">Chọn chuyên khoa</option>
                                    {specializations.map((spec) => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                                {errors.specialization && (
                                    <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trình độ chuyên môn <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.qualification ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={profile.qualification}
                                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                                    placeholder="Vd: Tiến sĩ Y khoa"
                                />
                                {errors.qualification && (
                                    <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kinh nghiệm (năm) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.experienceYears ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={profile.experienceYears}
                                    onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                                />
                                {errors.experienceYears && (
                                    <p className="text-red-500 text-sm mt-1">{errors.experienceYears}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá khám (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.appointmentPrice ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={profile.appointmentPrice}
                                    onChange={(e) => handleInputChange('appointmentPrice', parseInt(e.target.value) || 0)}
                                    placeholder="500000"
                                />
                                {errors.appointmentPrice && (
                                    <p className="text-red-500 text-sm mt-1">{errors.appointmentPrice}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giờ làm việc
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Từ</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={profile.workingHours?.from}
                                        onChange={(e) => handleInputChange('workingHours', {
                                            ...profile.workingHours,
                                            from: e.target.value
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Đến</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={profile.workingHours?.to}
                                        onChange={(e) => handleInputChange('workingHours', {
                                            ...profile.workingHours,
                                            to: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Giới thiệu</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả về bản thân <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={6}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                value={profile.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Mô tả về kinh nghiệm, chuyên môn và phương pháp điều trị của bạn..."
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Học vấn <span className="text-red-500">*</span>
                            </h2>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addEducation}
                            >
                                Thêm học vấn
                            </Button>
                        </div>
                        
                        {profile.education && profile.education.length > 0 ? (
                            <div className="space-y-4">
                                {profile.education.map((edu, index) => (
                                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Bằng cấp
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                    placeholder="Vd: Tiến sĩ Y khoa"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Trường học
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    value={edu.institution}
                                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                    placeholder="Vd: Đại học Y Hà Nội"
                                                />
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Năm tốt nghiệp
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1900"
                                                        max={new Date().getFullYear()}
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                        value={edu.year}
                                                        onChange={(e) => updateEducation(index, 'year', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="error"
                                                    onClick={() => removeEducation(index)}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>Chưa có thông tin học vấn. Vui lòng thêm ít nhất một bằng cấp.</p>
                            </div>
                        )}
                        {errors.education && (
                            <p className="text-red-500 text-sm mt-2">{errors.education}</p>
                        )}
                    </div>

                    {/* Certifications */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Chứng chỉ</h2>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addCertification}
                            >
                                Thêm chứng chỉ
                            </Button>
                        </div>
                        
                        {profile.certifications && profile.certifications.length > 0 ? (
                            <div className="space-y-4">
                                {profile.certifications.map((cert, index) => (
                                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tên chứng chỉ
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    value={cert.name}
                                                    onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                                    placeholder="Vd: Chứng chỉ hành nghề"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Đơn vị cấp
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    value={cert.issuedBy}
                                                    onChange={(e) => updateCertification(index, 'issuedBy', e.target.value)}
                                                    placeholder="Vd: Bộ Y tế"
                                                />
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Năm cấp
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1900"
                                                        max={new Date().getFullYear()}
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                        value={cert.year}
                                                        onChange={(e) => updateCertification(index, 'year', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="error"
                                                    onClick={() => removeCertification(index)}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>Chưa có chứng chỉ nào. Bạn có thể thêm chứng chỉ để tăng độ tin cậy.</p>
                            </div>
                        )}
                    </div>

                    {/* Languages */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Ngôn ngữ</h2>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addLanguage}
                            >
                                Thêm ngôn ngữ
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.languages?.map((lang, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                                        value={lang}
                                        onChange={(e) => updateLanguage(index, e.target.value)}
                                        placeholder="Vd: Tiếng Anh"
                                    />
                                    {profile.languages && profile.languages.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="error"
                                            onClick={() => removeLanguage(index)}
                                        >
                                            Xóa
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6">
                        {!isFirstTime && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/doctor/profile')}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang lưu...' : (isFirstTime ? 'Hoàn thiện hồ sơ' : 'Lưu thay đổi')}
                        </Button>
                    </div>
                </form>
            </div>
            
            {/* Simple Notification */}
            {notification && (
                <SimpleNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}
        </div>
    );
};

export default ManageProfile;
