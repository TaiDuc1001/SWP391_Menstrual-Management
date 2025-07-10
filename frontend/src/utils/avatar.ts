export const generateAvatarUrl = (
    name: string,
    size: number = 40,
    background: string = 'ec4899',
    color: string = 'ffffff'
) => {
    const encodedName = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=${background}&color=${color}&bold=true`;
};
