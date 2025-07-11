// Validation constants for doctor profile
export const VALIDATION_RULES = {
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        PATTERN: /^[a-zA-ZÀ-ỹ\s.]+$/
    },
    EMAIL: {
        PATTERN: /^\S+@\S+\.\S+$/
    },
    PHONE: {
        PATTERN: /^[0-9]{10,11}$/
    },
    EXPERIENCE: {
        MIN: 0,
        MAX: 50
    },
    PRICE: {
        MIN: 0,
        MAX: 10000000
    },
    DESCRIPTION: {
        MIN_LENGTH: 50,
        MAX_LENGTH: 1000
    },
    AVATAR: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    }
};

export const ERROR_MESSAGES = {
    REQUIRED: 'Trường này không được để trống',
    INVALID_EMAIL: 'Email không hợp lệ',
    INVALID_PHONE: 'Số điện thoại không hợp lệ (10-11 chữ số)',
    INVALID_NAME: 'Tên chỉ được chứa chữ cái và dấu cách',
    EXPERIENCE_RANGE: `Kinh nghiệm phải từ ${VALIDATION_RULES.EXPERIENCE.MIN} đến ${VALIDATION_RULES.EXPERIENCE.MAX} năm`,
    PRICE_RANGE: `Giá khám phải từ ${VALIDATION_RULES.PRICE.MIN.toLocaleString()} đến ${VALIDATION_RULES.PRICE.MAX.toLocaleString()} VNĐ`,
    DESCRIPTION_LENGTH: `Mô tả phải có từ ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} đến ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} ký tự`,
    AVATAR_SIZE: 'Ảnh không được vượt quá 5MB',
    AVATAR_TYPE: 'Chỉ hỗ trợ file JPG, PNG, WEBP',
    EDUCATION_REQUIRED: 'Vui lòng thêm ít nhất một bằng cấp'
};

export const SPECIALIZATIONS = [
    'Obstetrics and Gynecology (OB-GYN)',
    'Female Endocrinology',
    'Reproductive Endocrinology and Infertility',
    'Family Planning',
    'Prenatal and Postnatal Care',
    'Gynecologic Oncology',
    'Sexual and Reproductive Health',
    'Reproductive Genetics Counseling',
    'Women\'s Mental Health Counseling',
    'Sexually Transmitted Infections (STIs) Specialist'
];

export const WORKING_HOURS_OPTIONS = [
    { value: '06:00', label: '06:00' },
    { value: '07:00', label: '07:00' },
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' }
];
