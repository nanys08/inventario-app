import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StackLayout() {
  const [rol, setRol] = useState<string | null>(null);

  // Cargar el rol actual desde AsyncStorage
  useEffect(() => {
    const cargarRol = async () => {
      try {
        const data = await AsyncStorage.getItem('usuario');
        if (data) {
          const usuario = JSON.parse(data);
          setRol(usuario.rol);
        } else {
          setRol(null);
        }
      } catch (error) {
        console.error('❌ Error al obtener rol desde AsyncStorage:', error);
        setRol(null);
      }
    };

    cargarRol();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />

      <Stack.Screen name="RegistrarUsuario" />
      <Stack.Screen name="EditarUsuario" />

      {rol === 'ADMIN' && (
        <>
          <Stack.Screen name="ListaUsuarios" />
          <Stack.Screen name="EditarUsuarioAdmin" />
        </>
      )}
    </Stack>
  );
}
