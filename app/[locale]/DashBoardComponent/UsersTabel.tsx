'use client';
import AppSheet from "@/app/[locale]/DashBoardComponent/Dialog";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";
import AddUserDialog from "./AddUserDialog";

type User = {
  _id: string;
  username: string;
  username_en: string;
  email: string;
  role: string;
};

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch("/api/user");
    const data = await res.json();
    setUsers(data);
    setLoading(false)
  };



  const { data: session } = useSession();

  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async (id: string) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء الحذف");
      }

      // ✅ إعادة تحميل المستخدمين بعد الحذف
      fetchUsers();
    } catch (error: any) {
      setErrorMsg(error.message || "فشل في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };




  if (loading) {
    return (
      <div className="w-full mt-10 overflow-x-auto rounded-xl shadow-lg border border-white/10 bg-white/5 backdrop-blur-md">
        ...... جاري تحميل المستخدمين
      </div>
    )
  }





  return (
    <div className="w-full mt-10 overflow-x-auto rounded-xl shadow-lg border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-white/10">
        <h2 className="text-2xl font-bold text-white">المستخدمين</h2>
        <AddUserDialog onAdded={fetchUsers} />
      </div>

      <Table className="w-full text-white text-right ltr">
        <TableHeader>
          <TableRow className="bg-white/10 text-white text-right">
            <TableHead className="px-4 py-3 font-bold">الاسم بالعربي</TableHead>
            <TableHead className="px-4 py-3 font-bold">الاسم بالإنجليزية</TableHead>
            <TableHead className="px-4 py-3 font-bold">البريد الإلكتروني</TableHead>
            <TableHead className="px-4 py-3 font-bold">الدور</TableHead>
            <TableHead className="px-4 py-3 font-bold text-center">التعديلات والحذف</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user._id}
              className={clsx(
                index % 2 === 0 ? "bg-white/5" : "bg-transparent",
                "hover:bg-white/10 transition-colors duration-200"
              )}
            >
              <TableCell className="font-semibold px-4 py-3">
                {session?.user?.name === user.username ? `${user.username} (You)` : user.username}
              </TableCell>

              <TableCell className="px-4 py-3">{user.username_en}</TableCell>
              <TableCell className="px-4 py-3">{user.email}</TableCell>
              <TableCell className="px-4 py-3">{user.role}</TableCell>

              <TableCell className="px-4 py-3">
                <div className="flex justify-center gap-4 items-center">
                  <AppSheet usersData={user} />
                  <Trash2
                    size={26}
                    onClick={() => handleDelete(user._id)}
                    className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="bg-white/10">
            <TableCell colSpan={5} className="px-4 py-3 text-center font-bold">
              عدد المستخدمين: {users.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>

  );
}
