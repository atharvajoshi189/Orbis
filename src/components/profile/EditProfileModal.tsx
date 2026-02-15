"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useAppStore } from "@/lib/store";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: any;
    onUpdate: () => void;
}

export default function EditProfileModal({ isOpen, onClose, currentProfile, onUpdate }: EditProfileModalProps) {
    const { user } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        marks_10th: "",
        marks_12th: "",
        interests: [] as string[],
        skills: [] as string[],
        strengths: [] as string[],
        weaknesses: [] as string[],
    });

    const [newTag, setNewTag] = useState("");
    const [activeTagInput, setActiveTagInput] = useState<string | null>(null);

    useEffect(() => {
        if (currentProfile) {
            setFormData({
                marks_10th: currentProfile.marks_10th || "",
                marks_12th: currentProfile.marks_12th || "",
                interests: currentProfile.interests || [],
                skills: currentProfile.skills || [],
                strengths: currentProfile.strengths || [],
                weaknesses: currentProfile.weaknesses || [],
            });
        }
    }, [currentProfile]);

    const handleSave = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('students')
                .update({
                    marks_10th: formData.marks_10th,
                    marks_12th: formData.marks_12th,
                    interests: formData.interests,
                    skills: formData.skills,
                    strengths: formData.strengths,
                    weaknesses: formData.weaknesses,
                })
                .eq('user_id', user.id); // Assuming user.id maps to auth.uid() which maps to students.user_id

            if (error) throw error;
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const addTag = (field: 'interests' | 'skills' | 'strengths' | 'weaknesses') => {
        if (!newTag.trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], newTag.trim()]
        }));
        setNewTag("");
        setActiveTagInput(null);
    };

    const removeTag = (field: 'interests' | 'skills' | 'strengths' | 'weaknesses', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-[5%] -translate-x-1/2 w-full max-w-2xl bg-[#0f172a] border border-cyan-500/20 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">10th Marks (%)</label>
                                    <input
                                        type="text"
                                        value={formData.marks_10th}
                                        onChange={e => setFormData({ ...formData, marks_10th: e.target.value })}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500/50 outline-none transition-colors"
                                        placeholder="e.g. 95%"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">12th Marks (%)</label>
                                    <input
                                        type="text"
                                        value={formData.marks_12th}
                                        onChange={e => setFormData({ ...formData, marks_12th: e.target.value })}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500/50 outline-none transition-colors"
                                        placeholder="e.g. 92%"
                                    />
                                </div>
                            </div>

                            {['skills', 'interests', 'strengths', 'weaknesses'].map((field) => (
                                <div key={field} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-400 uppercase">{field}</label>
                                        <button
                                            onClick={() => setActiveTagInput(field)}
                                            className="text-cyan-400 text-xs flex items-center gap-1 hover:text-cyan-300"
                                        >
                                            <Plus className="w-3 h-3" /> Add
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 min-h-[50px] bg-black/30 border border-white/10 rounded-lg p-3">
                                        {(formData as any)[field].map((tag: string, i: number) => (
                                            <span key={i} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded text-xs flex items-center gap-2">
                                                {tag}
                                                <button onClick={() => removeTag(field as any, i)} className="hover:text-white"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}

                                        {activeTagInput === field && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={newTag}
                                                    onChange={e => setNewTag(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') addTag(field as any);
                                                        if (e.key === 'Escape') setActiveTagInput(null);
                                                    }}
                                                    onBlur={() => {
                                                        if (newTag) addTag(field as any);
                                                        setActiveTagInput(null);
                                                    }}
                                                    className="bg-transparent border-b border-cyan-500 text-white text-xs w-24 outline-none"
                                                    placeholder="Type..."
                                                />
                                            </div>
                                        )}
                                        {(formData as any)[field].length === 0 && !activeTagInput && (
                                            <span className="text-slate-600 text-xs italic">No {field} added yet...</span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
