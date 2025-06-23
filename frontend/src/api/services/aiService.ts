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

const GEMINI_API_KEY = 'AIzaSyDX7WIhs7wFLwKByocpKzhtZ_ub2z06CKM';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface CacheEntry {
    recommendations: string[];
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 30 * 60 * 1000;

export const aiService = {    async getRecommendations(data: AIRecommendationRequest): Promise<string[]> {
        const cacheKey = JSON.stringify(data);
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('Using cached recommendations');
            return cached.recommendations;
        }
        
        const prompt = this.buildPrompt(data);
        
        try {
            const response = await this.makeRequestWithRetry(prompt);
            
            const recommendations = response.candidates[0]?.content?.parts[0]?.text || '';
            
            if (!recommendations) {
                console.warn('Empty response from Gemini API, using fallback');
                return this.getFallbackRecommendations();
            }
            
            const parsedRecommendations = this.parseRecommendations(recommendations);
            
            cache.set(cacheKey, {
                recommendations: parsedRecommendations,
                timestamp: Date.now()
            });
            
            return parsedRecommendations;
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
            return this.getFallbackRecommendations();
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

        return `You are a menstrual health advisor. Using the provided menstrual cycle data and symptoms, give 4 personalized, practical, health-focused recommendations.

Menstrual Cycle History:
${cycleInfo}

${recentSymptomsText}

Please provide exactly 4 recommendations in the following format, each starting with a category label:
1. [Category]: [Recommendation text]
2. [Category]: [Recommendation text]
3. [Category]: [Recommendation text]
4. [Category]: [Recommendation text]

Use these categories: Cycle tracking, Reminders, Nutrition & exercise, Lifestyle, Sleep, Stress management. Keep each recommendation concise (max 80 words), actionable, and tailored to the data. Avoid general advice; focus on specific, evidence-based suggestions.

Keep each recommendation concise (max 100 words) and actionable.`;
    },    parseRecommendations(text: string): string[] {
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

    getFallbackRecommendations(): string[] {
        return [
            '<span class="font-semibold text-pink-600">Cycle trend:</span> Regular and stable. <span class="font-semibold text-pink-600">Suggestion:</span> Keep maintaining healthy lifestyle habits!',
            '<span class="font-semibold text-yellow-600">Reminder:</span> If you notice irregular periods, consider <span class="underline">regular gynecological check-ups</span>.',
            '<span class="font-semibold text-red-500">Note:</span> If stress persists, try to spend more time relaxing and resting.',
            '<span class="font-semibold text-green-600">Food & exercise suggestions:</span> Eat more fruits, green vegetables and do gentle yoga during menstruation to reduce fatigue.'
        ];
    }
};
