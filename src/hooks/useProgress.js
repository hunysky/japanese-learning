import { supabase } from '../lib/supabase';

export function useProgress() {

    const saveFlashcardPos = async (section, position) => {
        try {
            if (!supabase) return;
            await supabase
                .from('flashcard_progress')
                .upsert({ section, position, updated_at: new Date() }, { onConflict: 'section' });
        } catch (e) {
            console.error('Error saving flashcard position:', e);
        }
    };

    const getFlashcardPos = async (section) => {
        try {
            if (!supabase) return 0;
            const { data } = await supabase
                .from('flashcard_progress')
                .select('position')
                .eq('section', section)
                .single();
            return data?.position || 0;
        } catch (e) {
            return 0;
        }
    };

    const saveQuizScore = async (section, score, total = 10) => {
        try {
            if (!supabase) return;
            await supabase
                .from('quiz_scores')
                .insert({ section, score, total });
        } catch (e) {
            console.error('Error saving quiz score:', e);
        }
    };

    const saveWrongAnswer = async (section, character) => {
        try {
            if (!supabase) return;

            const { data: existing } = await supabase
                .from('quiz_wrong_answers')
                .select('wrong_count')
                .eq('section', section)
                .eq('character', character)
                .single();

            await supabase
                .from('quiz_wrong_answers')
                .upsert({
                    section,
                    character,
                    wrong_count: (existing?.wrong_count || 0) + 1,
                    updated_at: new Date()
                }, { onConflict: 'section,character' });
        } catch (e) {
            console.error('Error saving wrong answer:', e);
        }
    };

    const getWrongAnswers = async (section) => {
        try {
            if (!supabase) return [];
            const { data } = await supabase
                .from('quiz_wrong_answers')
                .select('character, wrong_count')
                .eq('section', section)
                .order('wrong_count', { ascending: false });
            return data || [];
        } catch (e) {
            return [];
        }
    };

    return {
        saveFlashcardPos,
        getFlashcardPos,
        saveQuizScore,
        saveWrongAnswer,
        getWrongAnswers
    };
}
