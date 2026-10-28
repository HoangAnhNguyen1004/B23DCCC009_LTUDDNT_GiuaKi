import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useBooks } from '../context/BookContext';
import { Button, Screen } from '../components/UI';
import { styles } from '../theme/theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
    RootStackParamList,
    'BookDetail'
>;

export default function BookDetailScreen({ navigation, route }: Props) {
    const { books, changeBorrowed, busy } = useBooks();
    const book = books.find(item => item.id === route.params.id);

    if (!book) {
        return (
            <Screen>
                <Text style={styles.empty}>Sách không còn tồn tại.</Text>
            </Screen>
        );
    }

    const remaining = book.quantity - book.borrowed;

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.title}>{book.title}</Text>
                    <Text style={styles.muted}>Mã sách: {book.id}</Text>
                    <Text style={styles.text}>Tác giả: {book.author}</Text>
                    <Text style={styles.text}>Thể loại: {book.category}</Text>
                    <Text style={styles.text}>Năm xuất bản: {book.year}</Text>
                    <Text style={styles.text}>
                        Tổng số cuốn: {book.quantity}
                    </Text>
                    <Text style={styles.text}>
                        Đang mượn: {book.borrowed}
                    </Text>

                    <Text
                        style={
                            remaining === 0 ? styles.soldOut : styles.available
                        }>
                        Còn lại: {remaining} cuốn
                        {remaining === 0 ? ' — Hết sách' : ''}
                    </Text>
                </View>

                <Button
                    title="Cho mượn"
                    disabled={busy || remaining === 0}
                    onPress={() => {
                        void changeBorrowed(book.id, 1);
                    }}
                />

                <Button
                    title="Nhận trả"
                    disabled={busy || book.borrowed === 0}
                    onPress={() => {
                        void changeBorrowed(book.id, -1);
                    }}
                />

                <Button
                    title="Sửa thông tin"
                    disabled={busy}
                    onPress={() =>
                        navigation.navigate('BookForm', { id: book.id })
                    }
                />
            </ScrollView>
        </Screen>
    );
}