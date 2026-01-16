"use client";

import Image from "next/image";
import { cartContentAtom } from "@/store/bookAtom";
import { useAtom } from "jotai";
import Books from "@/components/ui/books";

const Cart = () => {
    const [cartStorage, setCartStorage] = useAtom(cartContentAtom); // cart atom

    return (
        <article>
            <h2 className="text-xl mb-3 font-[700]">내가 찜한 책</h2>
            <section className="flex font-[400] mb-5">
                <p className="me-5">찜한 책</p>
                <span>
                    총{" "}
                    <strong className="text-primary">
                        {cartStorage.length}
                    </strong>
                    건
                </span>
            </section>
            {!cartStorage || cartStorage.length === 0 ? (
                <section className="text-center mt-40">
                    <Image
                        src="/emp-book.svg"
                        width={80}
                        height={80}
                        alt="찜한 책이 없습니다."
                        className="m-auto"
                    />
                    <p className="text-secondary mt-10">찜한 책이 없습니다.</p>
                </section>
            ) : (
                <Books contents={cartStorage} />
            )}
        </article>
    );
};

export default Cart;
