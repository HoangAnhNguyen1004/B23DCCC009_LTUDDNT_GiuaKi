import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#2563EB',
    background: '#F1F5F9',
    white: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#CBD5E1',
    danger: '#DC2626',
    success: '#15803D',
    disabled: '#94A3B8',
    lightBlue: '#DBEAFE',
};

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 16,
        gap: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
    card: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 16,
        gap: 8,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    text: {
        fontSize: 16,
        color: colors.text,
    },
    muted: {
        fontSize: 14,
        color: colors.muted,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
    },
    invalid: {
        borderColor: colors.danger,
    },
    error: {
        fontSize: 13,
        color: colors.danger,
        marginTop: 6,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
    },
    disabled: {
        backgroundColor: colors.disabled,
    },
    pressed: {
        opacity: 0.65,
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 20,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 14,
        color: colors.text,
    },
    chipTextActive: {
        color: colors.white,
        fontWeight: '700',
    },
    available: {
        color: colors.success,
        fontSize: 15,
        fontWeight: '700',
    },
    soldOut: {
        color: colors.danger,
        fontSize: 15,
        fontWeight: '700',
    },
    stats: {
        backgroundColor: colors.lightBlue,
        padding: 16,
        borderRadius: 12,
        gap: 6,
    },
    empty: {
        textAlign: 'center',
        color: colors.muted,
        fontSize: 16,
        paddingVertical: 40,
    },
});