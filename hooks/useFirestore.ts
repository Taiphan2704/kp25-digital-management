import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  doc, 
  writeBatch,
  query
} from 'firebase/firestore';

export const useFirestore = <T extends { id: string }>(collectionName: string, initialMockData: T[]) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as T);
      });

      // --- LOGIC SẮP XẾP "QUYỀN LỰC TUYỆT ĐỐI" ---
      if (collectionName === 'kp25_residents') {
          items.sort((a: any, b: any) => {
             // 1. Gom nhóm theo Mã hộ (Cắt khoảng trắng để tránh lỗi nhập liệu)
             const houseA = String(a.householdId || '').trim();
             const houseB = String(b.householdId || '').trim();
             
             // So sánh mã hộ: HD-0001 lên trước HD-0002
             const compareHouse = houseA.localeCompare(houseB);
             if (compareHouse !== 0) return compareHouse;

             // 2. Nếu CÙNG 1 NHÀ: Phân cấp vai vế
             // Hàm chấm điểm: Điểm càng thấp càng đứng đầu
             const getScore = (role: string) => {
                 // Ép về chữ thường và cắt khoảng trắng thừa
                 const r = String(role || '').toLowerCase().trim();
                 
                 // CHỦ HỘ LÀ SỐ 1 (Điểm 0)
                 if (r.includes('chủ hộ') || r === 'chủ hộ') return 0;
                 
                 // VỢ/CHỒNG LÀ SỐ 2 (Điểm 1)
                 if (r.includes('vợ') || r.includes('chồng')) return 1;
                 
                 // CON LÀ SỐ 3 (Điểm 2)
                 if (r.includes('con')) return 2;
                 
                 // CHÁU LÀ SỐ 4 (Điểm 3)
                 if (r.includes('cháu')) return 3;
                 
                 // CÒN LẠI (Điểm 4)
                 return 4;
             };

             const scoreA = getScore(a.relation);
             const scoreB = getScore(b.relation);

             // Nếu vai vế khác nhau -> Xếp theo điểm (Thấp đứng trước)
             if (scoreA !== scoreB) return scoreA - scoreB;

             // 3. Nếu CÙNG vai vế (ví dụ 2 người con): Xếp theo tên A-Z
             const nameA = String(a.fullName || '');
             const nameB = String(b.fullName || '');
             return nameA.localeCompare(nameB);
          });
      } else {
          // Các bảng khác (Hộ dân...) xếp theo ID tăng dần
          items.sort((a, b) => a.id.localeCompare(b.id));
      }

      // --- LOGIC NẠP DỮ LIỆU ---
      if (items.length === 0 && initialMockData.length > 0) {
        // Đổi tên key v6 để đảm bảo code mới được áp dụng
        const isSeeded = localStorage.getItem(`seeded_${collectionName}_v6_strict_sort`);
        
        if (!isSeeded) {
            console.log(`Đang khởi tạo dữ liệu CHUẨN (Strict Sort) cho: ${collectionName}...`);
            const batch = writeBatch(db);
            initialMockData.forEach(item => {
               const docRef = doc(db, collectionName, item.id); 
               batch.set(docRef, item);
            });
            await batch.commit();
            localStorage.setItem(`seeded_${collectionName}_v6_strict_sort`, 'true');
        } else {
             setLoading(false);
        }
      } else {
        setData(items);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [collectionName]);

  // --- GIỮ NGUYÊN CÁC HÀM XỬ LÝ DỮ LIỆU ---
  const add = async (item: any) => {
    try {
      if (item.id) {
        await setDoc(doc(db, collectionName, item.id), item);
      } else {
        const newRef = doc(collection(db, collectionName));
        await setDoc(newRef, { ...item, id: newRef.id });
      }
    } catch (e) {
      console.error("Lỗi thêm mới:", e);
      alert("Lỗi kết nối.");
    }
  };

  const update = async (item: T) => {
    try {
      const { id, ...rest } = item as any;
      if (!id) return;
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, item, { merge: true });
    } catch (e) {
      console.error("Lỗi cập nhật:", e);
    }
  };

  const remove = async (id: string) => {
    if(!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Lỗi xóa:", e);
    }
  };

  return { data, add, update, remove, loading };
};