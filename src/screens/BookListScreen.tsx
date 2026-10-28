import React, { useState } from 'react';
import { Alert, FlatList, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useBooks } from '../context/BookContext';
import { CATEGORIES } from '../data/books';
import {
    BookCard,
    Button,
    CategoryPicker,
    Screen,
} from '../components/UI';
import { colors, styles } from '../theme/theme';
import type { Book, Category, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookList'>;
type Filter = Category | 'Tất cả';

const FILTERS: Filter[] = ['Tất cả', ...CATEGORIES];

export default function BookListScreen({ navigation }: Props) {
    const { books, removeBook, busy } = useBooks();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<Filter>('Tất cả');

    const keyword = search.trim().toLocaleLowerCase('vi');

    const filtered = books.filter(book => {
        const matchesSearch =
            book.title.toLocaleLowerCase('vi').includes(keyword) ||
            book.author.toLocaleLowerCase('vi').includes(keyword);

        const matchesCategory =
            category === 'Tất cả' || book.category === category;

        return matchesSearch && matchesCategory;
    });

    const totalBorrowed = books.reduce(
        (total, book) => total + book.borrowed,
        0,
    );

    function confirmDelete(book: Book): void {
        if (book.borrowed > 0) {
            Alert.alert(
                'Không thể xóa',
                `Sách này đang được mượn ${book.borrowed} cuốn.`,
            );
            return;
        }

        Alert.alert(
            'Xóa sách',
            `Bạn có chắc muốn xóa "${book.title}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        void removeBook(book.id);
                    },
                },
            ],
        );
    }

    return (
        <Screen>
            <View style={styles.content}>
                <View style={styles.stats}>
                    <Text style={styles.title}>{books.length} đầu sách</Text>
                    <Text style={styles.text}>
                        Đang được mượn: {totalBorrowed} cuốn
                    </Text>
                </View>

                <Button
                    title="+ Thêm sách"
                    disabled={busy}
                    onPress={() => navigation.navigate('BookForm')}
                />

                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Tìm tên sách hoặc tác giả..."
                    placeholderTextColor={colors.muted}
                    style={styles.input}
                    autoCorrect={false}
                />

                <CategoryPicker<Filter>
                    items={FILTERS}
                    selected={category}
                    onSelect={setCategory}
                />

                <Text style={styles.muted}>
                    Chạm để xem chi tiết • Nhấn giữ để xóa
                </Text>
            </View>

            <FlatList<Book>
                data={filtered}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                renderItem={({ item }) => (
                    <BookCard
                        book={item}
                        disabled={busy}
                        onPress={() =>
                            navigation.navigate('BookDetail', { id: item.id })
                        }
                        onLongPress={() => confirmDelete(item)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        {books.length === 0
                            ? 'Chưa có sách. Hãy thêm sách mới!'
                            : 'Không tìm thấy sách phù hợp.'}
                    </Text>
                }
            />
        </Screen>
    );
}