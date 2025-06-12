'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Strategy {
    text: string;
    timestamp: string;
    source: string;
}

interface ApiResponse {
    strategies: string[];
    source: string;
}

interface GenerationOptions {
    count: number;
    length: 'concise' | 'medium' | 'verbose';
    moods: string[];
}

/**
 * Client component for generating oblique strategies using Google Gemini AI
 */
export default function ObliqueGenerator() {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    
    // Generation options
    const [count, setCount] = useState(1);
    const [length, setLength] = useState<'concise' | 'medium' | 'verbose'>('concise');
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

    const availableMoods = [
        { id: 'dark', label: 'Dark' },
        { id: 'happy', label: 'Happy' },
        { id: 'melancholy', label: 'Melancholy' },
        { id: 'energetic', label: 'Energetic' },
        { id: 'mysterious', label: 'Mysterious' },
        { id: 'playful', label: 'Playful' },
        { id: 'contemplative', label: 'Contemplative' },
        { id: 'urgent', label: 'Urgent' },
        { id: 'serene', label: 'Serene' },
        { id: 'rebellious', label: 'Rebellious' },
        { id: 'nostalgic', label: 'Nostalgic' },
        { id: 'experimental', label: 'Experimental' }
    ];

    const toggleMood = (moodId: string) => {
        setSelectedMoods(prev => 
            prev.includes(moodId) 
                ? prev.filter(id => id !== moodId)
                : [...prev, moodId]
        );
    };

    /**
     * Fetches new strategies from the Google Gemini API
     */
    const generateStrategies = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const options: GenerationOptions = {
                count,
                length,
                moods: selectedMoods
            };

            const response = await fetch('/api/oblique', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(options),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if response has content before parsing JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not valid JSON');
            }

            const text = await response.text();
            if (!text.trim()) {
                throw new Error('Empty response received');
            }

            const data: ApiResponse = JSON.parse(text);
            
            // Validate response structure
            if (!data.strategies || !Array.isArray(data.strategies)) {
                throw new Error('Invalid response format');
            }
            
            // Create strategy objects
            const newStrategies: Strategy[] = data.strategies.map((strategy: string) => ({
                text: strategy,
                timestamp: new Date().toISOString(),
                source: data.source || 'unknown'
            }));

            setStrategies(newStrategies);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            console.error('Error generating strategy:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getSourceLabel = (source: string) => {
        // Only show source for fallback cases, not for AI generation
        switch (source) {
            case 'authentic':
                return '🎯 Authentic Brian Eno Strategy';
            case 'fallback':
                return '📱 Offline Fallback Strategy';
            default:
                return null; // Don't show anything for AI-generated
        }
    };

    return (
        <div className="space-y-6">
            {/* Settings Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg transition-colors"
                    aria-expanded={showSettings}
                    aria-controls="strategy-settings"
                >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        Generation Settings
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                        {showSettings ? '▼' : '▶'}
                    </span>
                </button>
                
                {showSettings && (
                    <div id="strategy-settings" className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-6">
                        {/* Number of Strategies */}
                        <div className="space-y-2">
                            <Label htmlFor="strategy-count" className="text-sm font-medium">
                                Number of strategies
                            </Label>
                            <Select value={count.toString()} onValueChange={(value) => setCount(parseInt(value))}>
                                <SelectTrigger id="strategy-count" className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Length Setting */}
                        <div className="space-y-2">
                            <Label htmlFor="strategy-length" className="text-sm font-medium">
                                Strategy length
                            </Label>
                            <Select value={length} onValueChange={(value: 'concise' | 'medium' | 'verbose') => setLength(value)}>
                                <SelectTrigger id="strategy-length" className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="concise">Concise (3-8 words)</SelectItem>
                                    <SelectItem value="medium">Medium (5-12 words)</SelectItem>
                                    <SelectItem value="verbose">Verbose (8-20 words)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mood Toggles */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Mood (select multiple)
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {availableMoods.map((mood) => (
                                    <button
                                        key={mood.id}
                                        onClick={() => toggleMood(mood.id)}
                                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors border ${
                                            selectedMoods.includes(mood.id)
                                                ? 'bg-gray-200 border-gray-400 text-gray-800 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                        type="button"
                                        aria-pressed={selectedMoods.includes(mood.id)}
                                    >
                                        {mood.label}
                                    </button>
                                ))}
                            </div>
                            {selectedMoods.length === 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    No mood selected - strategies will have neutral tone
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button 
                    onClick={generateStrategies}
                    disabled={isLoading}
                    className="min-w-48"
                    size="lg"
                >
                    {isLoading ? 'Generating...' : `Generate ${count} Strateg${count === 1 ? 'y' : 'ies'}`}
                </Button>

                {strategies.length > 0 && getSourceLabel(strategies[0].source) && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getSourceLabel(strategies[0].source)}
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                    <p className="text-red-700 dark:text-red-300">
                        <strong>Error:</strong> {error}
                    </p>
                    {error.includes('API key') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            Please ensure your Google AI API key is configured in your environment variables.
                        </p>
                    )}
                </div>
            )}

            {/* Strategies Display */}
            {strategies.length > 0 && (
                <div className="space-y-4">
                    <div className={`grid gap-4 ${strategies.length === 1 ? 'max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                        {strategies.map((strategy, index) => (
                            <div
                                key={`${strategy.timestamp}-${index}`}
                                className={`p-6 bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl shadow-lg dark:from-gray-900/20 dark:to-slate-900/20 dark:border-gray-700 ${
                                    strategies.length === 1 ? 'p-8' : ''
                                }`}
                            >
                                <blockquote className={`text-center font-medium text-gray-900 dark:text-gray-100 leading-relaxed ${
                                    strategies.length === 1 ? 'text-xl md:text-2xl' : 'text-lg'
                                }`}>
                                    "{strategy.text}"
                                </blockquote>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Generated at {new Date(strategies[0]?.timestamp).toLocaleString()}
                    </p>
                </div>
            )}

            {/* Initial State */}
            {strategies.length === 0 && !error && !isLoading && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="max-w-md mx-auto space-y-4">
                        <p>
                            Click the button above to generate strategies.
                        </p>

                    </div>
                </div>
            )}
        </div>
    );
}
