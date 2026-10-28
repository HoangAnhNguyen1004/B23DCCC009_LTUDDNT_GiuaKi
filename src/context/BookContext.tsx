import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CATEGORIES, INITIAL_BOOKS } from '../data/books';
import type { Book, BookInput } from '../types';

const STORAGE_KEY = '@LibraryApp/books/v1';

interface BookContextValue {
    books: Book[];
    loading: boolean;
    loadError: string;
    busy: boolean;
    loadBooks: () => Promise<void>;
    saveBook: (values: BookInput, id?: string) => Promise<boolean>;
    removeBook: (id: string) => Promise<boolean>;
    changeBorrowed: (id: string, delta: 1 | -1) => Promise<boolean>;
}

const BookContext = createContext<BookContextValue | undefined>(
    undefined,
);

function isBook(value: unknown): value is Book {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const book = value as Record<string, unknown>;

    return (
        typeof book.id === 'string' &&
        book.id.length > 0 &&
        typeof book.title === 'string' &&
        book.title.trim().length > 0 &&
        typeof book.author === 'string' &&
        book.author.trim().length > 0 &&
        CATEGORIES.some(category => category === book.category) &&
        typeof book.year === 'number' &&
        Number.isInteger(book.year) &&
        book.year >= 1900 &&
        book.year <= new Date().getFullYear() &&
        typeof book.quantity === 'number' &&
        Number.isSafeInteger(book.quantity) &&
        book.quantity > 0 &&
        typeof book.borrowed === 'number' &&
        Number.isSafeInteger(book.borrowed) &&
        book.borrowed >= 0 &&
        book.borrowed <= book.quantity
    );
}

function isBookList(value: unknown): value is Book[] {
    if (!Array.isArray(value) || !value.every(isBook)) {
        return false;
    }

    return new Set(value.map(book => book.id)).size === value.length;
}

export function BookProvider({ children }: { children: ReactNode }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [busy, setBusy] = useState(false);

    const booksRef = useRef<Book[]>([]);
    const lock = useRef(false);

    async function loadBooks(): Promise<void> {
        setLoading(true);
        setLoadError('');

        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            const data: unknown =
                raw === null ? INITIAL_BOOKS : JSON.parse(raw);

            if (!isBookList(data)) {
                throw new Error('Dữ liệu sách không hợp lệ.');
            }

            // Chỉ khởi tạo khi chưa có dữ liệu trong bộ nhớ.
            if (raw === null) {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }

            booksRef.current = data;
            setBooks(data);
        } catch {
            setLoadError('Không đọc được dữ liệu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadBooks();
    }, []);

    async function commit(
        transform: (current: Book[]) => Book[],
    ): Promise<boolean> {
        if (lock.current) {
            return false;
        }

        lock.current = true;
        setBusy(true);

        try {
            const next = transform(booksRef.current);

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

            booksRef.current = next;
            setBooks(next);
            return true;
        } catch (error: unknown) {
            Alert.alert(
                'Không thể thực hiện',
                error instanceof Error ? error.message : 'Lỗi lưu dữ liệu.',
            );
            return false;
        } finally {
            lock.current = false;
            setBusy(false);
        }
    }

    function saveBook(
        values: BookInput,
        id?: string,
    ): Promise<boolean> {
        return commit(current => {
            const old = id
                ? current.find(book => book.id === id)
                : undefined;

            if (id && !old) {
                throw new Error('Sách không còn tồn tại.');
            }

            const book: Book = {
                ...values,
                title: values.title.trim(),
                author: values.author.trim(),
                id:
                    old?.id ??
                    `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                borrowed: old?.borrowed ?? 0,
            };

            if (!isBook(book)) {
                throw new Error(
                    'Dữ liệu không hợp lệ hoặc số lượng nhỏ hơn số đang mượn.',
                );
            }

            return old
                ? current.map(item => (item.id === id ? book : item))
                : [book, ...current];
        });
    }

    function removeBook(id: string): Promise<boolean> {
        return commit(current => {
            const book = current.find(item => item.id === id);

            if (!book) {
                throw new Error('Sách không còn tồn tại.');
            }

            if (book.borrowed > 0) {
                throw new Error('Không thể xóa sách đang có người mượn.');
            }

            return current.filter(item => item.id !== id);
        });
    }

    function changeBorrowed(
        id: string,
        delta: 1 | -1,
    ): Promise<boolean> {
        return commit(current => {
            const book = current.find(item => item.id === id);

            if (!book) {
                throw new Error('Sách không còn tồn tại.');
            }

            const borrowed = book.borrowed + delta;

            if (borrowed < 0 || borrowed > book.quantity) {
                throw new Error('Số lượng mượn/trả không hợp lệ.');
            }

            return current.map(item =>
                item.id === id ? { ...item, borrowed } : item,
            );
        });
    }

    return (
        <BookContext.Provider
            value={{
                books,
                loading,
                loadError,
                busy,
                loadBooks,
                saveBook,
                removeBook,
                changeBorrowed,
            }}>
            {children}
        </BookContext.Provider>
    );
}

export function useBooks(): BookContextValue {
    const context = useContext(BookContext);

    if (!context) {
        throw new Error('useBooks phải được sử dụng trong BookProvider.');
    }

    return context;
}