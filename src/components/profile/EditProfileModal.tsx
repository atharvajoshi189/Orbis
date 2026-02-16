
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: any;
    onSave: (updatedProfile: any) => Promise<void>;
}

export function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        uni: '',
        gpa: '',
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                uni: profile.uni || '',
                gpa: profile.gpa || '',
                phone: profile.phone || '', // Assuming phone exists in profile
                email: profile.email || ''  // Assuming email exists in profile
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            // Error handling is managed by the parent or toast there
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md">
                <Card className="w-full bg-[#0a0a0a] border-white/10 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
                        <CardTitle className="text-xl font-bold">Edit Operative Profile</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/10 rounded-full">
                            <X size={18} />
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Operative Name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">University / Base</label>
                                <Input
                                    name="uni"
                                    value={formData.uni}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    placeholder="Enter university name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Current GPA</label>
                                <Input
                                    name="gpa"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    type="text"
                                    className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    placeholder="e.g. 3.8"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/10 text-slate-400 hover:text-white">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
