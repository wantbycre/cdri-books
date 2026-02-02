import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "@/services/bookService";
import { SearchParams, KakaoBookResponse } from "@/types/book";

export const useBookSearch = (
    params: SearchParams,
    initialData?: KakaoBookResponse | null
) => {
    return useQuery({
        queryKey: ["books", params],
        queryFn: () => fetchBooks(params),
        enabled: !!params.query,
        initialData: initialData || undefined, // SSR 데이터를 initialData로 설정
        staleTime: 1000 * 60 * 5, // 5분간 데이터 유효
        gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    });
};
