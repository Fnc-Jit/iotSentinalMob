import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('analyst@sentinel.io');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // TODO: Replace with real API auth call
    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter your credentials');
            return;
        }
        setError('');
        setLoading(true);
        // Simulated login delay — replace with POST /api/auth/login
        setTimeout(() => {
            setLoading(false);
            navigation.replace('MainTabs');
        }, 1200);
    };

    return (
        <View style={styles.container}>
            {/* Gradient accent bar */}
            <LinearGradient colors={['#FF6B35', '#E8478C', '#FFB347']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBar} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <LinearGradient colors={['#FF6B35', '#E8478C']} style={styles.logoIcon}>
                        <Shield size={28} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={styles.logoText}>Sentinel</Text>
                    <Text style={styles.subtitle}>Enterprise Security Platform</Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sign in to your account</Text>

                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="analyst@sentinel.io"
                        placeholderTextColor="#555"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordWrap}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter password"
                            placeholderTextColor="#555"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} color="#8B8FA3" /> : <Eye size={20} color="#8B8FA3" />}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                        {loading ? (
                            <ActivityIndicator color="#0C0C0C" />
                        ) : (
                            <Text style={styles.loginBtnText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>© 2026 Sentinel Security Platform</Text>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0C0C0C' },
    gradientBar: { height: 3, width: '100%' },
    inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
    logoContainer: { alignItems: 'center', marginBottom: 32 },
    logoIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    logoText: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
    logoTextLight: { fontWeight: '400' },
    subtitle: { fontSize: 13, color: '#8B8FA3', marginTop: 4 },
    card: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#2A2A3A' },
    cardTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 20, textAlign: 'center' },
    errorBox: { backgroundColor: 'rgba(255,76,76,0.1)', borderWidth: 1, borderColor: 'rgba(255,76,76,0.3)', borderRadius: 8, padding: 12, marginBottom: 16 },
    errorText: { color: '#FF4C4C', fontSize: 13, textAlign: 'center' },
    label: { fontSize: 13, fontWeight: '600', color: '#8B8FA3', marginBottom: 6, marginTop: 12 },
    input: { backgroundColor: '#111111', borderWidth: 1, borderColor: '#2A2A3A', borderRadius: 10, padding: 14, color: '#FFFFFF', fontSize: 15, marginBottom: 4 },
    passwordWrap: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
    eyeBtn: { position: 'absolute', right: 14, top: 14 },
    loginBtn: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
    loginBtnText: { color: '#0C0C0C', fontSize: 15, fontWeight: '700' },
    forgotBtn: { alignItems: 'center', marginTop: 16 },
    forgotText: { color: '#FF6B35', fontSize: 13, fontWeight: '600' },
    footerText: { color: '#555', fontSize: 11, textAlign: 'center', marginTop: 32 },
});
