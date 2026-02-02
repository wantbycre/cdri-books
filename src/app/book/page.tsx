import BooksList from "./BooksList";
import BooksSearch from "./BooksSearch";
import { fetchBooks } from "@/services/bookService";
import { SearchType } from "@/types/book";

interface BookPageProps {
    searchParams: {
        q?: string;
        type?: SearchType;
    };
}

const Book = async ({ searchParams }: BookPageProps) => {
    const query = searchParams.q || "";
    const type = (searchParams.type as SearchType) || "title";

    // SSR: 서버에서 데이터 페칭
    let initialData = null;
    let isError = false;

    if (query) {
        try {
            initialData = await fetchBooks({
                query,
                target: type,
            });
        } catch (error) {
            console.error("Failed to fetch books:", error);
            isError = true;
        }
    }

    return (
        <>
            <BooksSearch />
            <BooksList 
                initialData={initialData} 
                initialError={isError}
                searchQuery={query}
                searchType={type}
            />
        </>
    );
};

export default Book;
