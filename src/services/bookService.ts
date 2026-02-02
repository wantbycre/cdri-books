import { SearchParams } from "@/types/book";

const KAKAO_URL = "https://dapi.kakao.com/v3/search/book";

// 서버 사이드 전용 함수 (SSR만 사용)
export const fetchBooks = async ({
    query,
    target,
    page = 1,
    size = 10,
}: SearchParams) => {
    if (!query) return null;

    // 서버 사이드에서만 사용되는 API 키
    const KAKAO_KEY = process.env.KAKAO_REST_API_KEY;
    
    if (!KAKAO_KEY) {
        throw new Error("Kakao API Key is not configured");
    }

    const params = new URLSearchParams({
        query,
        page: String(page),
        size: String(size),
    });

    // target이 있을 때만 파라미터 추가
    if (target) {
        params.append("target", target);
    }

    const res = await fetch(`${KAKAO_URL}?${params.toString()}`, {
        headers: {
            Authorization: `KakaoAK ${KAKAO_KEY}`,
        },
        cache: "no-store", // SSR 캐시 설정
    });

    if (!res.ok) throw new Error("도서 데이터를 불러오는 데 실패했습니다.");
    return res.json();
};
