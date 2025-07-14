import axios from 'axios';

export interface GeminiResponse {
    candidates: {
        content: {
            parts: {
                text: string;
            }[];
            role: string;
        };
        finishReason: string;
        avgLogprobs: number;
    }[];
    usageMetadata: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        totalTokenCount: number;
    };
}

export interface AIRecommendationRequest {
    cycles: Array<{
        cycleStartDate: string;
        cycleLength: number;
        periodDuration: number;
        symptoms?: string[];
    }>;
    recentSymptoms: string[];
}

export interface AIRecommendationResponse {
    recommendations: string[];
    healthConcerns: boolean;
    needsSTITesting: boolean;
    healthIssueDescription?: string;
}

const GEMINI_API_KEY = 'AIzaSyDX7WIhs7wFLwKByocpKzhtZ_ub2z06CKM';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface CacheEntry {
    response: AIRecommendationResponse;
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 30 * 60 * 1000;

export const aiService = {
    async getRecommendations(data: AIRecommendationRequest, forceRefresh: boolean = false): Promise<AIRecommendationResponse> {
        const cacheKey = JSON.stringify(data);
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION && !forceRefresh) {
            console.log('Using cached recommendations');
            return cached.response;
        }
        
        if (forceRefresh) {
            console.log('Force refresh requested - bypassing cache');
        }
        
        const prompt = this.buildPrompt(data);
        
        try {
            const response = await this.makeRequestWithRetry(prompt);
            
            const aiOutput = response.candidates[0]?.content?.parts[0]?.text || '';
            
            if (!aiOutput) {
                console.warn('Empty response from Gemini API, using fallback');
                return this.getFallbackResponse(data);
            }
            
            const analysisResult = this.parseAIResponse(aiOutput);
            
            cache.set(cacheKey, {
                response: analysisResult,
                timestamp: Date.now()
            });
            
            return analysisResult;
        } catch (error) {
            console.error('Error getting AI recommendations:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 429) {
                    console.warn('Rate limit exceeded, using fallback recommendations');
                } else {
                    console.error('API Error Response:', error.response?.data);
                    console.error('API Error Status:', error.response?.status);
                }
            }
            return this.getFallbackResponse(data);
        }
    },
    async makeRequestWithRetry(prompt: string, maxRetries: number = 2, delay: number = 1000): Promise<GeminiResponse> {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const requestPayload = {
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                };
                
                console.log('Gemini API Request Payload:', JSON.stringify(requestPayload, null, 2));
                
                const response = await axios.post<GeminiResponse>(GEMINI_API_URL, requestPayload, {
                    timeout: 10000
                });

                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 429 && attempt < maxRetries) {
                    console.warn(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                    continue;
                }
                throw error;
            }
        }
        throw new Error('Max retries exceeded');
    },

    buildPrompt(data: AIRecommendationRequest): string {
        const cycleInfo = data.cycles.map(cycle => 
            `Cycle started: ${cycle.cycleStartDate}, Length: ${cycle.cycleLength} days, Period duration: ${cycle.periodDuration} days${cycle.symptoms ? `, Symptoms: ${cycle.symptoms.join(', ')}` : ''}`
        ).join('\n');

        const recentSymptomsText = data.recentSymptoms.length > 0 
            ? `Recent symptoms experienced: ${data.recentSymptoms.join(', ')}`
            : 'No recent symptoms reported';

        return `You are a menstrual health advisor. Analyze the provided menstrual cycle data and symptoms to provide health recommendations and detect potential health concerns.

Menstrual Cycle History:
${cycleInfo}

${recentSymptomsText}

Please analyze the data and respond in this exact format:

HEALTH_ANALYSIS_START
HEALTH_CONCERNS: [YES/NO]
STI_TESTING_NEEDED: [YES/NO]
HEALTH_ISSUE_DESCRIPTION: [Brief description if health concerns detected, or "None detected"]
HEALTH_ANALYSIS_END

RECOMMENDATIONS_START
1. [Category]: [Recommendation text]
2. [Category]: [Recommendation text]
3. [Category]: [Recommendation text]
4. [Category]: [Recommendation text]
RECOMMENDATIONS_END

Health concerns to detect:
- Irregular menstrual cycles (cycles shorter than 21 days or longer than 35 days)
- Abnormal bleeding patterns (heavy bleeding, bleeding between periods)
- Severe symptoms (heavy bleeding, severe pain, unusual discharge)
- Symptoms suggesting infections (unusual discharge, itching, burning, strong odor, pain during urination)
- Any symptoms that might indicate STI or reproductive tract infections
- Pelvic pain, fever with menstrual symptoms
- Unusual vaginal discharge (yellow, green, or gray discharge with odor)

Set STI_TESTING_NEEDED to YES if symptoms include:
- Unusual vaginal discharge with odor
- Itching, burning, or pain in genital area
- Pain during urination
- Bleeding between periods
- Pelvic pain
- Any combination of symptoms suggesting possible infection

Use these categories for recommendations: Cycle tracking, Reminders, Nutrition & exercise, Lifestyle, Sleep, Stress management. Keep each recommendation concise (max 80 words), actionable, and tailored to the data.`;
    },
    parseAIResponse(text: string): AIRecommendationResponse {
        // Parse health analysis
        const healthAnalysisMatch = text.match(/HEALTH_ANALYSIS_START([\s\S]*?)HEALTH_ANALYSIS_END/);
        let healthConcerns = false;
        let needsSTITesting = false;
        let healthIssueDescription = undefined;

        if (healthAnalysisMatch) {
            const healthSection = healthAnalysisMatch[1];
            
            const healthConcernsMatch = healthSection.match(/HEALTH_CONCERNS:\s*(YES|NO)/i);
            healthConcerns = healthConcernsMatch?.[1]?.toUpperCase() === 'YES';
            
            const stiTestingMatch = healthSection.match(/STI_TESTING_NEEDED:\s*(YES|NO)/i);
            needsSTITesting = stiTestingMatch?.[1]?.toUpperCase() === 'YES';
            
            const descriptionMatch = healthSection.match(/HEALTH_ISSUE_DESCRIPTION:\s*(.+)/i);
            const description = descriptionMatch?.[1]?.trim();
            if (description && description !== 'None detected') {
                healthIssueDescription = description;
            }
        }

        // Parse recommendations
        const recommendationsMatch = text.match(/RECOMMENDATIONS_START([\s\S]*?)RECOMMENDATIONS_END/);
        let recommendations: string[] = [];

        if (recommendationsMatch) {
            recommendations = this.parseRecommendations(recommendationsMatch[1]);
        } else {
            // Fallback: try to parse the whole text as recommendations
            recommendations = this.parseRecommendations(text);
        }


        return {
            recommendations: recommendations.length > 0 ? recommendations : this.getFallbackRecommendations(),
            healthConcerns,
            needsSTITesting,
            healthIssueDescription
        };
    },

    parseRecommendations(text: string): string[] {
        const cleanText = text.replace(/\*\*/g, '');
        const lines = cleanText.split('\n').filter(line => line.trim());
        const recommendations: string[] = [];
        
        for (const line of lines) {
            if (recommendations.length >= 4) break;
            
            const bracketMatch = line.match(/^\d+\.\s*\[([^\]]+)\]:\s*(.+)$/);
            if (bracketMatch) {
                const [, category, recommendation] = bracketMatch;
                recommendations.push(`<span class="font-semibold text-purple-600">${category}:</span> ${recommendation}`);
                continue;
            }
            
            const colonMatch = line.match(/^\d+\.\s*([^:]+):\s*(.+)$/);
            if (colonMatch) {
                const [, category, recommendation] = colonMatch;
                recommendations.push(`<span class="font-semibold text-purple-600">${category.trim()}:</span> ${recommendation.trim()}`);
                continue;
            }
            
            const asteriskMatch = line.match(/^\*\s*([^:]+):\s*(.+)$/);
            if (asteriskMatch) {
                const [, category, recommendation] = asteriskMatch;
                recommendations.push(`<span class="font-semibold text-purple-600">${category.trim()}:</span> ${recommendation.trim()}`);
                continue;
            }
            
            const dashMatch = line.match(/^-\s*([^:]+):\s*(.+)$/);
            if (dashMatch) {
                const [, category, recommendation] = dashMatch;
                recommendations.push(`<span class="font-semibold text-purple-600">${category.trim()}:</span> ${recommendation.trim()}`);
                continue;
            }
            
            if (line.includes(':') && recommendations.length < 4) {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    const category = parts[0].replace(/^\d+\.\s*|\*\s*|-\s*/, '').trim();
                    const recommendation = parts.slice(1).join(':').trim();
                    if (category && recommendation) {
                        recommendations.push(`<span class="font-semibold text-purple-600">${category}:</span> ${recommendation}`);
                    }
                }
            }
        }
        
        return recommendations.length > 0 ? recommendations : this.getFallbackRecommendations();
    },

    detectHealthConcerns(cycles: Array<{cycleStartDate: string; cycleLength: number; periodDuration: number; symptoms?: string[]}>, recentSymptoms: string[]): {healthConcerns: boolean, needsSTITesting: boolean, healthIssueDescription?: string} {
        const allSymptoms = [...recentSymptoms];
        cycles.forEach(cycle => {
            if (cycle.symptoms) {
                allSymptoms.push(...cycle.symptoms);
            }
        });
        
        const symptomsText = allSymptoms.join(' ').toLowerCase();
        
        // Check for irregular cycles (not in 28-35 days range)
        const hasIrregularCycles = cycles.some(cycle => 
            cycle.cycleLength < 28 || cycle.cycleLength > 35
        );
        
        console.log('AI Detection - Cycle lengths:', cycles.map(c => c.cycleLength));
        console.log('AI Detection - Has irregular cycles:', hasIrregularCycles);
        
        // Check for heavy symptoms
        const hasHeavySymptoms = symptomsText.includes('heavy');
        
        // Check for STI-related symptoms
        const stiSymptoms = [
            'discharge', 'unusual discharge', 'burning', 'itching', 'odor', 'pain during urination',
            'pelvic pain', 'bleeding between periods', 'irregular bleeding'
        ];
        
        const hasStiSymptoms = stiSymptoms.some(symptom => symptomsText.includes(symptom));
        
        // Check for concerning symptoms
        const concerningSymptoms = [
            'severe pain', 'heavy bleeding', 'fever', 'severe cramps'
        ];
        
        const hasConcerningSymptoms = concerningSymptoms.some(symptom => symptomsText.includes(symptom));
        
        // Determine if health concerns exist and STI testing is needed
        const healthConcerns = hasIrregularCycles || hasHeavySymptoms || hasStiSymptoms || hasConcerningSymptoms;
        const needsSTITesting = hasIrregularCycles || hasHeavySymptoms || hasStiSymptoms || hasConcerningSymptoms;
        
        console.log('AI Detection - Health concerns:', healthConcerns);
        console.log('AI Detection - Needs STI testing:', needsSTITesting);
        
        let healthIssueDescription = undefined;
        
        if (hasIrregularCycles && hasHeavySymptoms) {
            healthIssueDescription = "Chu kỳ kinh nguyệt không đều (không trong khoảng 28-35 ngày) và có triệu chứng nặng. Nên thực hiện xét nghiệm để kiểm tra sức khỏe sinh sản.";
        } else if (hasIrregularCycles) {
            const irregularCycles = cycles.filter(cycle => cycle.cycleLength < 28 || cycle.cycleLength > 35);
            const cycleLengths = irregularCycles.map(c => c.cycleLength).join(', ');
            healthIssueDescription = `Phát hiện chu kỳ kinh nguyệt không đều: ${cycleLengths} ngày (bình thường: 28-35 ngày). Nên thực hiện xét nghiệm để đánh giá tình trạng sức khỏe.`;
        } else if (hasHeavySymptoms) {
            healthIssueDescription = "Phát hiện triệu chứng nặng trong chu kỳ kinh nguyệt. Nên thực hiện xét nghiệm để kiểm tra sức khỏe sinh sản.";
        } else if (hasStiSymptoms) {
            healthIssueDescription = "Triệu chứng có thể liên quan đến nhiễm trùng. Nên thực hiện xét nghiệm STI.";
        } else if (hasConcerningSymptoms) {
            healthIssueDescription = "Phát hiện triệu chứng đáng lo ngại. Nên tham khảo ý kiến bác sĩ.";
        }
        
        return {
            healthConcerns,
            needsSTITesting,
            healthIssueDescription
        };
    },

    getFallbackResponse(data?: AIRecommendationRequest): AIRecommendationResponse {
        if (data) {
            const healthAnalysis = this.detectHealthConcerns(data.cycles, data.recentSymptoms);
            return {
                recommendations: this.getFallbackRecommendations(),
                healthConcerns: healthAnalysis.healthConcerns,
                needsSTITesting: healthAnalysis.needsSTITesting,
                healthIssueDescription: healthAnalysis.healthIssueDescription
            };
        }
        
        return {
            recommendations: this.getFallbackRecommendations(),
            healthConcerns: false,
            needsSTITesting: false,
            healthIssueDescription: undefined
        };
    },

    getFallbackRecommendations(): string[] {
        return [
            '<span class="font-semibold text-pink-600">Cycle trend:</span> Regular and stable. <span class="font-semibold text-pink-600">Suggestion:</span> Keep maintaining healthy lifestyle habits!',
            '<span class="font-semibold text-yellow-600">Reminder:</span> If you notice irregular periods, consider <span class="underline">regular gynecological check-ups</span>.',
            '<span class="font-semibold text-red-500">Note:</span> If stress persists, try to spend more time relaxing and resting.',
            '<span class="font-semibold text-green-600">Food & exercise suggestions:</span> Eat more fruits, green vegetables and do gentle yoga during menstruation to reduce fatigue.'
        ];
    },

    clearCache(): void {
        cache.clear();
        console.log('AI recommendations cache cleared');
    }
};
