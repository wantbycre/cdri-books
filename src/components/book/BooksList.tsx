"use client";

import Image from "next/image";
import { useState } from "react";
import { useAtom } from "jotai";
import { searchResultAtom } from "@/store/bookAtom";
// import { Spinner } from "@/components/ui/spinner";

const BooksList = () => {
    // key
    const [openIsbn, setOpenIsbn] = useState<string | null>(null);

    // atom data
    const [{ contents, isLoading, isError }] = useAtom(searchResultAtom);

    // 국가 화폐단위 처리
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR").format(price);
    };

    // toggle
    const handleToggle = (isbn: string) => {
        setOpenIsbn(openIsbn === isbn ? null : isbn);
    };

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

            {isError ? (
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
                // <BooksList BooksData={data.documents} />
                contents.map((book, index) => {
                    const isbn = book.isbn || String(index);
                    const isOpen = openIsbn === isbn;

                    return (
                        <div key={isbn} className="flex flex-col">
                            {!isOpen && (
                                <section className="flex justify-between items-center border-b border-gray py-3 ps-7 pe-5">
                                    <div className="flex flex-1 pe-5">
                                        <div className="w-[48px] h-[68px] bg-gray me-8 relative overflow-hidden shrink-0">
                                            <Image
                                                src={book.thumbnail}
                                                alt={book.title}
                                                sizes="48px"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-lg font-[600] truncate max-w-[300px]">
                                                {book.title}
                                            </p>
                                            <span className="text-sm text-secondary ms-5">
                                                {book.authors.join(", ")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center w-[350px] justify-end">
                                        <div className="text-lg font-[600] whitespace-nowrap">
                                            {book.sale_price > 0
                                                ? `${formatPrice(
                                                      book.sale_price
                                                  )}원`
                                                : `${formatPrice(
                                                      book.price
                                                  )}원`}
                                        </div>
                                        <div className="flex ms-10">
                                            <a
                                                href={book.url}
                                                target="_blank"
                                                className="py-3 px-6 text-white bg-primary rounded-md cursor-pointer"
                                            >
                                                구매하기
                                            </a>
                                            <button
                                                type="button"
                                                className="py-3 ps-6 pe-5 text-secondary bg-light-gray rounded-md ms-2 flex items-center cursor-pointer"
                                                onClick={() =>
                                                    handleToggle(isbn)
                                                }
                                            >
                                                상세보기
                                                <Image
                                                    src="/arrow.svg"
                                                    width={12}
                                                    height={18}
                                                    alt="펼침"
                                                    className="ms-1"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* 상세 섹션 (isOpen이 true일 때만 block) */}
                            <div className={isOpen ? "block" : "hidden"}>
                                <section className="flex justify-between border-b border-gray py-8 ps-7 pe-5 bg-[#fafafa]">
                                    <div className="flex flex-1">
                                        <div className="relative w-[210px] h-[280px] bg-gray me-8 shrink-0 overflow-hidden shadow-md">
                                            <Image
                                                src={book.thumbnail}
                                                alt={book.title}
                                                fill
                                                className="object-cover"
                                                sizes="210px"
                                            />
                                            <button className="absolute right-2 top-2 z-10">
                                                <Image
                                                    src="/like-active.svg"
                                                    width={24}
                                                    height={24}
                                                    alt="좋아요"
                                                />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center mt-2">
                                                <p className="text-22 font-[700]">
                                                    {book.title}
                                                </p>
                                                <span className="text-sm text-secondary ms-5">
                                                    {book.authors.join(", ")}
                                                </span>
                                            </div>
                                            <div className="mt-6">
                                                <p className="font-[600] mb-3 text-16">
                                                    책 소개
                                                </p>
                                                <div className="text-[10px] pe-8 w-110">
                                                    {book.contents}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-[350px] flex-col justify-between items-stretch text-end">
                                        <div>
                                            <button
                                                type="button"
                                                className="py-3 ps-6 pe-5 text-secondary bg-light-gray rounded-md cursor-pointer inline-flex items-center"
                                                onClick={() =>
                                                    setOpenIsbn(null)
                                                }
                                            >
                                                상세보기
                                                <Image
                                                    src="/arrow.svg"
                                                    width={12}
                                                    height={18}
                                                    alt="닫힘"
                                                    className="ms-1 transform rotate-180"
                                                />
                                            </button>
                                        </div>
                                        <div className="mb-2">
                                            {book.sale_price > 0 && (
                                                <div className="text-lg flex items-center justify-end text-font-subtitle">
                                                    <span className="text-[10px] text-subtitle font-[400] me-2">
                                                        원가
                                                    </span>
                                                    <span className="line-through">
                                                        {formatPrice(
                                                            book.price
                                                        )}
                                                        원
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-lg font-[600] flex items-center justify-end mt-2">
                                                <span className="text-[10px] text-subtitle font-[400] me-2">
                                                    {book.sale_price > 0
                                                        ? "할인가"
                                                        : "판매가"}
                                                </span>
                                                {formatPrice(
                                                    book.sale_price > 0
                                                        ? book.sale_price
                                                        : book.price
                                                )}
                                                원
                                            </div>
                                            <a
                                                href={book.url}
                                                target="_blank"
                                                className="block text-center py-3 px-6 text-white bg-primary rounded-md cursor-pointer w-full mt-6 font-bold"
                                            >
                                                구매하기
                                            </a>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    );
                })
            )}
        </article>
    );
};

export default BooksList;
