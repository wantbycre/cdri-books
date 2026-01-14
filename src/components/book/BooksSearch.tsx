"use client";

import Image from "next/image";
import { useEffect, useState, useRef, use } from "react";
import { useBookSearch } from "@/hooks/useBooks";

import { SearchType } from "@/types/book";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAtom } from "jotai";
import { searchResultAtom, searchKeywordAtom } from "@/store/bookAtom";

const BooksSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null); // input focus
    const [word, setWord] = useState(""); // input 타이핑
    const [searchWord, setSearchWord] = useState(""); // 검색
    const [wordLayer, setWordLayer] = useState(false); // 검색 기록
    const [type, setType] = useState<SearchType>("title"); // query 전달 타입

    const [modal, setModal] = useState(false); // 모달
    const [modalType, setModalType] = useState<SearchType>("title"); // 모달 타입
    const [modalWord, setModalWord] = useState(""); // 모달 타이핑

    const [searchStatus, setSearchStatus] = useAtom(searchResultAtom);
    const [wordStorage, setWordStorage] = useAtom(searchKeywordAtom);

    // kakao api
    const { data, isLoading, isError } = useBookSearch({
        query: searchWord,
        target: type,
    });

    // jotai atom 저장
    useEffect(() => {
        setSearchStatus({
            contents: data?.documents,
            isLoading,
            isError,
        });
    }, [data, isLoading, isError, setSearchStatus]);

    // 외부 클릭시 닫기
    const handleBlur = (e: React.FocusEvent) => {
        if (e.relatedTarget?.closest(".search-layer-container")) {
            return;
        }
        setWordLayer(false);
    };

    // focus시 기록확인, 출력
    const handleFocus = () => {
        if (wordStorage.length > 0) {
            setWordLayer(true);
        }
    };

    // 직접입력
    const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWord(e.currentTarget.value);

        if (wordStorage.length > 0) {
            setWordLayer(true);
        }
    };

    // 검색기록
    const handleWordLayerClick = (word: string) => {
        setWord(word);
        setSearchWord(word);
        setWordLayer(false);

        const newHistory = [
            word,
            ...wordStorage.filter((h) => h !== word),
        ].slice(0, 8);

        setWordStorage(newHistory);
    };

    // 검색기록 삭제
    const handleDelete = (word: string) => {
        const deleteHistory = wordStorage.filter((n) => n !== word);
        setWordStorage(deleteHistory);
    };

    // 상세검색 팝업
    const handlePopOpen = () => {
        setModal(true);
        setModalWord("");
        setModalType("title");
        inputRef.current?.blur();
    };

    // 상세검색 팝업 닫기
    const handlePopClose = () => {
        setModal(false);
    };

    // TODO: 찜 컨텐츠 메뉴 작업

    // submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!word.trim()) return;

        // 검색
        setSearchWord(word);

        // 키워드 레이어
        setWordLayer(false);

        // 키워드 저장 8개, 최신순, 중복체크
        const newHistory = [
            word,
            ...wordStorage.filter((h) => h !== word),
        ].slice(0, 8);

        setWordStorage(newHistory);

        inputRef.current?.blur();
    };

    // modal submit
    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!modalWord.trim()) return;

        setWord("");
        setModal(false);

        // 검색
        setType(modalType);
        setSearchWord(modalWord);
    };

    // console.log(data?.documents);

    return (
        <search>
            <h2 className="text-xl mb-5">도서검색</h2>
            <div className="relative flex items-center mb-4">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className={`bg-light-gray w-[480px] ps-12 leading-12 ${
                            wordLayer
                                ? `rounded-tl-3xl rounded-tr-3xl`
                                : `rounded-3xl`
                        }`}
                        placeholder="검색어를 입력하세요."
                        ref={inputRef}
                        value={word}
                        onChange={handleWordChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    <Image
                        src="/search.svg"
                        width={20}
                        height={20}
                        alt="검색"
                        className="absolute left-[13px] top-[13px]"
                    />
                </form>
                <div>
                    <button
                        type="button"
                        className="ms-4 px-2 py-1 text-sm border border-subtitle rounded-lg text-subtitle cursor-pointer"
                        onClick={handlePopOpen}
                    >
                        상세검색
                    </button>
                </div>

                {/* 상세검색 팝업 */}
                <div className={modal ? "block" : "hidden"}>
                    <div className="fixed inset-0 flex justify-center items-center z-1000 border">
                        <div className="fixed left-0 top-0 bottom-0 right-0 bg-black opacity-20"></div>
                        <div className="bg-white fixed left-auto top-1/2 z-2000 w-[360px] rounded-2xl shadow-2xl pt-10 pb-5 px-7">
                            <div className="flex">
                                <div className="me-2">
                                    <Select
                                        value={modalType}
                                        onValueChange={(value: SearchType) =>
                                            setModalType(value)
                                        }
                                    >
                                        <SelectTrigger className="w-[100px] border-0 border-b border-gray shadow-none">
                                            <SelectValue placeholder="제목" />
                                        </SelectTrigger>
                                        <SelectContent style={{ zIndex: 3000 }}>
                                            <SelectItem value="title">
                                                제목
                                            </SelectItem>
                                            <SelectItem value="person">
                                                저자명
                                            </SelectItem>
                                            <SelectItem value="publisher">
                                                출판사
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="검색어 입력"
                                        className="border-b border-primary w-full h-8"
                                        value={modalWord}
                                        onChange={(e) =>
                                            setModalWord(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="py-2 px-6 text-white bg-primary rounded-md cursor-pointer w-full"
                                    onClick={handleModalSubmit}
                                >
                                    검색하기{" "}
                                </button>
                            </div>

                            <button type="button" onClick={handlePopClose}>
                                <Image
                                    src="/close.svg"
                                    width={12}
                                    height={12}
                                    alt="팝업 닫기"
                                    className="absolute right-[13px] top-[13px] cursor-pointer"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 검색기록 */}
                <div className={wordLayer ? "block" : "hidden"}>
                    <div className="absolute left-0 top-[48px] z-800 bg-light-gray rounded-b-3xl w-[480px] search-layer-container">
                        <ul className="pb-2">
                            {wordStorage.map((word) => (
                                <li
                                    key={word}
                                    className="ps-12 pe-5 py-2 flex justify-between text-subtitle hover:bg-gray"
                                >
                                    <button
                                        type="button"
                                        className="block w-full text-start cursor-pointer me-2"
                                        onClick={() =>
                                            handleWordLayerClick(word)
                                        }
                                    >
                                        {word}
                                    </button>
                                    <button type="button">
                                        <Image
                                            src="/delete.svg"
                                            width={16}
                                            height={16}
                                            alt="삭제"
                                            className="cursor-pointer"
                                            onClick={() => handleDelete(word)}
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </search>
    );
};

export default BooksSearch;
