'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface UserProps {
    usersData: {
        _id: string;
        username: string;
        username_en?: string;
        email: string;
        password?: string;
        role: string;
    };
}

const AppSheet = ({ usersData }: UserProps) => {
    const [username, setUsername] = useState(usersData.username);
    const [usernameEn, setUsernameEn] = useState(usersData.username_en || "");
    const [email, setEmail] = useState(usersData.email);
    const [role, setRole] = useState(usersData.role);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");









    
    const handleUpdate = async () => {
        const updatedFields: any = {};

        if (username !== usersData.username) updatedFields.username = username.trim();
        if (usernameEn !== usersData.username_en) updatedFields.username_en = usernameEn.trim();
        if (email !== usersData.email) updatedFields.email = email.trim().toLowerCase();
        if (role !== usersData.role) updatedFields.role = role;
        if (password && password.length > 0) updatedFields.password = password;

        if (Object.keys(updatedFields).length === 0) {
            setMessage("لا توجد تغييرات للتحديث.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/user/${usersData._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFields),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("تم تحديث البيانات بنجاح");
            } else {
                setMessage(data.message || "حدث خطأ أثناء التحديث");
            }
        } catch (error) {
            setMessage("خطأ في الاتصال بالخادم");
        } finally {
            setLoading(false);
        }
    };








    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="text-sm text-white border-white/30 bg-[#b70501] hover:bg-[#b70501]/90 hover:text-white cursor-pointer"
                >
                    تعديل المستخدم
                </Button>
            </SheetTrigger>

            <SheetContent
                side="bottom"
                className="bg-[#b70501] text-white border-white/20 w-full p-16 shadow-xl rounded-2xl font-extrabold "
            >
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold text-white text-right">
                        تعديل بيانات المستخدم
                    </SheetTitle>
                    <SheetDescription className="text-sm text-white mb-4  text-right">
                        يمكنك تعديل بيانات المستخدم من خلال الحقول التالية:
                    </SheetDescription>
                </SheetHeader>

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
                    <div>
                        <Label htmlFor="role" className="block text-base text-right">الدور</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="bg-white/10 text-white border-white/20 focus:ring-white w-full text-right">
                                <SelectValue placeholder="اختر الدور" className="text-right" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#b70501] text-white text-right">
                                <SelectItem value="admin" className="text-right">مدير</SelectItem>
                                <SelectItem value="sales" className="text-right">مبيعات</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="mt-4 bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                    >
                        {loading ? "جاري التحديث..." : "حفظ التعديلات"}
                    </Button>

                    {message && (
                        <p className="text-sm mt-2 text-white/90">{message}</p>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AppSheet;
