// Test script to verify health issue detection works
// This simulates the data structure that would be sent to the AI service

const testCycleData = [
    {
        cycleStartDate: '2025-01-15',
        cycleLength: 18,  // Irregular (< 21 days)
        periodDuration: 9,  // Long duration
        symptoms: [
            'unusual discharge',
            'burning sensation', 
            'pain during urination',
            'itching',
            'bleeding between periods',
            'pelvic pain',
            'fever',
            'strong odor',
            'cramps',
            'fatigue'
        ]
    },
    {
        cycleStartDate: '2025-01-02',
        cycleLength: 38,  // Irregular (> 35 days)
        periodDuration: 8,
        symptoms: [
            'unusual vaginal discharge with odor',
            'burning sensation',
            'pain during urination',
            'severe pain',
            'heavy bleeding'
        ]
    }
];

const testRecentSymptoms = [
    'unusual discharge',
    'burning sensation',
    'pain during urination',
    'itching',
    'bleeding between periods',
    'pelvic pain',
    'fever',
    'strong odor'
];

// Simulate the AI detection logic from aiService.ts
function testHealthDetection(cycles, recentSymptoms) {
    const allSymptoms = [...recentSymptoms];
    cycles.forEach(cycle => {
        if (cycle.symptoms) {
            allSymptoms.push(...cycle.symptoms);
        }
    });
    
    const symptomsText = allSymptoms.join(' ').toLowerCase();
    console.log('All symptoms text:', symptomsText);
    
    // Check for STI-related symptoms
    const stiSymptoms = [
        'discharge', 'unusual discharge', 'burning', 'itching', 'odor', 'pain during urination',
        'pelvic pain', 'bleeding between periods', 'irregular bleeding'
    ];
    
    const foundStiSymptoms = stiSymptoms.filter(symptom => symptomsText.includes(symptom));
    console.log('Found STI symptoms:', foundStiSymptoms);
    
    const hasStiSymptoms = foundStiSymptoms.length > 0;
    
    // Check for irregular cycles
    const hasIrregularCycles = cycles.some(cycle => 
        cycle.cycleLength < 21 || cycle.cycleLength > 35
    );
    
    console.log('Has irregular cycles:', hasIrregularCycles);
    
    // Check for concerning symptoms
    const concerningSymptoms = [
        'severe pain', 'heavy bleeding', 'fever', 'severe cramps'
    ];
    
    const foundConcerningSymptoms = concerningSymptoms.filter(symptom => symptomsText.includes(symptom));
    console.log('Found concerning symptoms:', foundConcerningSymptoms);
    
    const hasConcerningSymptoms = foundConcerningSymptoms.length > 0;
    
    const healthConcerns = hasStiSymptoms || hasIrregularCycles || hasConcerningSymptoms;
    
    console.log('\n=== DETECTION RESULTS ===');
    console.log('Health concerns detected:', healthConcerns);
    console.log('STI testing needed:', hasStiSymptoms);
    console.log('Has irregular cycles:', hasIrregularCycles);
    console.log('Has concerning symptoms:', hasConcerningSymptoms);
    
    return {
        healthConcerns,
        needsSTITesting: hasStiSymptoms,
        hasIrregularCycles,
        hasConcerningSymptoms
    };
}

console.log('Testing health detection with severe symptom data...\n');
const result = testHealthDetection(testCycleData, testRecentSymptoms);

if (result.healthConcerns && result.needsSTITesting) {
    console.log('\n✅ SUCCESS: Health issues detected! The "Navigate to STI page" button should appear.');
} else {
    console.log('\n❌ FAILURE: Health issues not detected properly.');
    console.log('   Health concerns:', result.healthConcerns);
    console.log('   STI testing needed:', result.needsSTITesting);
}
