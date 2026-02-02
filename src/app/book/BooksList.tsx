"use client";

import Image from "next/image";
import { useBookSearch } from "@/hooks/useBooks";
import Books from "@/components/ui/books";
import { KakaoBookResponse } from "@/types/book";
import { SearchType } from "@/types/book";

interface BooksListProps {
    initialData: KakaoBookResponse | null;
    initialError: boolean;
    searchQuery: string;
    searchType: SearchType;
}

const BooksList = ({ 
    initialData, 
    initialError, 
    searchQuery, 
    searchType 
}: BooksListProps) => {
    // react-query는 캐시 및 클라이언트 사이드 업데이트용
    const { data, isError } = useBookSearch({
        query: searchQuery,
        target: searchType,
    }, initialData);

    // SSR 데이터 또는 react-query 캐시 데이터 사용
    const contents = data?.documents || initialData?.documents || [];
    const error = isError || initialError;

    return (
        <article>
            <section className="flex font-[400] mb-5">
                <p className="me-5">도서 검색 결과</p>
                <span>
                    총{" "}
                    <strong className="text-primary">
                        {contents?.length || 0}
                    </strong>
                    건
                </span>
            </section>

            {error ? (
                <section className="text-center mt-40">
                    <Image
                        src="/emp-book.svg"
                        width={80}
                        height={80}
                        alt="검색 결과가 없습니다."
                        className="m-auto"
                    />
                    <p className="text-secondary mt-10">
                        오류가 발생하였습니다.
                        <br />
                        다시 검색해주세요.
                    </p>
                </section>
            ) : !contents || contents.length === 0 ? (
                <section className="text-center mt-40">
                    <Image
                        src="/emp-book.svg"
                        width={80}
                        height={80}
                        alt="검색 결과가 없습니다."
                        className="m-auto"
                    />
                    <p className="text-secondary mt-10">
                        검색된 결과가 없습니다.
                    </p>
                </section>
            ) : (
                <Books contents={contents} />
            )}
        </article>
    );
};

export default BooksList;
