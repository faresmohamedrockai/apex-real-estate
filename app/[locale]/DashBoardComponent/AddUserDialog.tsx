'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface AddUserDialogProps {
    onAdded: () => void;
}

export default function AddUserDialog({ onAdded }: AddUserDialogProps) {
    const [username, setUsername] = useState("");
    const [usernameEn, setUsernameEn] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState('sales'); // القيمة الافتراضية
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleAdd = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    username_en: usernameEn,
                    email,
                    password,
                    role,
                }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "فشل الإضافة");

            setMessage("تم إضافة المستخدم بنجاح");
            // reset form
            setUsername("");
            setUsernameEn("");
            setEmail("");
            setPassword("");
            setRole("");
            onAdded();
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-white bg-[#b70501] cursor-pointer border border-white/30 hover:bg-[#b70501]/70 hover:text-white flex items-center gap-2 px-5 py-2 rounded-lg"
                >
                    <Plus size={18} /> إضافة مستخدم
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#b70501] text-white border-white/20 rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-right">إضافة مستخدم جديد</DialogTitle>
                    <DialogDescription className="text-base text-white/70 mb-6  text-right">
                        قم بإدخال بيانات المستخدم الجديد.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-6 text-right" dir="rtl">
                    <div>
                        <Label htmlFor="username" className="mb-2.5 block text-base text-right">الاسم</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:ring-white text-right"
                        />
                    </div>

                    <div>
                        <Label htmlFor="username_en" className="block text-base text-right">الاسم بالإنجليزية</Label>
                        <Input
                            id="username_en"
                            value={usernameEn}
                            onChange={(e) => setUsernameEn(e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:ring-white text-left"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email" className="block text-base text-right">البريد الإلكتروني</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:ring-white text-right"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="block text-base text-right">الباسورد</Label>
                        <Input
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:ring-white text-right"
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="role" className="block text-base text-right">الدور</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="bg-white/10 text-white border-white/20 focus:ring-white w-full text-right">
                                <SelectValue placeholder="اختر الدور" className="text-right" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#b70501] text-white text-right">
                                <SelectItem value="admin" className="text-right">مدير</SelectItem>
                                <SelectItem value="sales" className="text-right">مابيعات</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleAdd}
                        disabled={loading}
                        className="w-full bg-white text-[#b70501] hover:bg-white/90 font-semibold text-base py-3 rounded-full shadow-md"
                    >
                        {loading ? "جاري الإضافة..." : "حفظ المستخدم"}
                    </Button>

                    {message && (
                        <p className="text-sm mt-3 text-white/80">{message}</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
