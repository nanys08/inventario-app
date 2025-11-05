import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { obtenerUsuarios, cambiarEstadoUsuario } from '../../services/usuarioService';

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<any | null>(null);
  const router = useRouter();

  // 🔹 Cargar lista de usuarios solo si es admin
  useEffect(() => {
    const verificarYcargar = async () => {
      const data = await AsyncStorage.getItem('usuario');
      if (!data) {
        Alert.alert('Sesión expirada', 'Debes iniciar sesión nuevamente.');
        router.replace('/login');
        return;
      }

      const user = JSON.parse(data);
      setUsuarioActual(user);

      if (user.rol !== 'ADMIN') {
        Alert.alert('Acceso denegado', 'Solo los administradores pueden ver esta sección.');
        router.replace('/home');
        return;
      }

      await cargarUsuarios();
    };

    verificarYcargar();
  }, []);

  // 🔁 Cargar usuarios desde backend
const cargarUsuarios = async () => {
  try {
    const lista = await obtenerUsuarios();

    // 🔤 Ordenar alfabéticamente por nombre
    const listaOrdenada = lista.sort((a: any, b: any) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

    setUsuarios(listaOrdenada);
  } catch (error) {
    console.error(' Error al cargar usuarios:', error);
    Alert.alert('Error', 'No se pudo cargar la lista de usuarios.');
  }
};


  // 🔹 Confirmar desactivación / activación
  const toggleEstado = (usuario: any) => {
    Alert.alert(
      usuario.activo ? 'Desactivar usuario' : 'Activar usuario',
      `¿Estás seguro de ${usuario.activo ? 'desactivar' : 'activar'} a ${usuario.nombre}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              await cambiarEstadoUsuario(usuario.idUsuario, !usuario.activo);
              Alert.alert('Éxito', `Usuario ${usuario.activo ? 'desactivado' : 'activado'} correctamente.`);
              await cargarUsuarios();
            } catch (error) {
              console.error(' Error al cambiar estado:', error);
              Alert.alert('Error', 'No se pudo cambiar el estado del usuario.');
            }
          },
        },
      ]
    );
  };

  // 🔹 Renderizar lista
  const renderUsuario = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text>Rol: {item.rol}</Text>
      <Text>Estado: {item.activo ? 'Activo' : 'Desactivado'}</Text>

      <View style={styles.botones}>
        <Button
          title="Editar"
          onPress={() => router.push({ pathname: '/EditarUsuarioAdmin', params: { idUsuario: item.idUsuario } })}
        />
        <Button
          title={item.activo ? 'Desactivar' : 'Activar'}
          color={item.activo ? 'red' : 'green'}
          onPress={() => toggleEstado(item)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios</Text>
      <FlatList
        data={usuarios}
        renderItem={renderUsuario}
        keyExtractor={(item) => item.idUsuario.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  nombre: { fontWeight: 'bold', fontSize: 16 },
  botones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
