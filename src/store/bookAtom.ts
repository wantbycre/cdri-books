import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Book } from "@/types/book";

// 데이터 타입
interface SearchState {
    contents: Book[];
    isLoading: boolean;
    isError: boolean;
}

// init
const initialState: SearchState = {
    contents: [],
    isLoading: false,
    isError: false,
};
// query 데이터 저장 atom
export const searchResultAtom = atom<SearchState>(initialState);

// 검색 키워드 저장 atom
export const searchKeywordAtom = atomWithStorage<string[]>("history", []);
