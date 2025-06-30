module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './public/index.html',
    ],
    theme: {
        extend: {
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
            },
            zIndex: {
                '60': '60',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
