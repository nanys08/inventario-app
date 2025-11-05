import { api } from '../api';
import { Usuario } from '../types/usuario';

// 🔹 Probar conexión (listar todos los usuarios)
export const probarConexion = async (): Promise<Usuario[]> => {
  const response = await api.get('/api/usuarios');
  return response.data;
};

// 🔹 Login de usuario
export const loginUsuario = async (cedula: string, contrasena: string): Promise<Usuario> => {
  try {
    const response = await api.post('/api/usuarios/login', { cedula, contrasena });
    return response.data;
  } catch (error: any) {
    console.log(' Error en loginUsuario:', error.response?.data || error.message);

    let mensaje = 'Error al iniciar sesión.';
    if (typeof error.response?.data === 'string') {
      mensaje = error.response.data;
    } else if (error.response?.data?.message) {
      mensaje = error.response.data.message;
    } else if (error.message) {
      mensaje = error.message;
    }

    throw new Error(mensaje);
  }
};

// 🔹 Registrar usuario
export const registrarUsuario = async (usuario: any): Promise<Usuario> => {
  const payload = {
    nombre: usuario.nombre,
    cedula: usuario.cedula,
    correo: usuario.correo,
    contrasena: usuario.contrasena,
    rol: usuario.rol?.toUpperCase() || 'TECNICO',
  };

  console.log(' Enviando usuario a registrar:', payload);
  const response = await api.post('/api/usuarios/registrar', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// 🔹 Obtener todos los usuarios
export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get('/api/usuarios');
  return response.data;
};

// 🔹 Cambiar estado (activar / desactivar usuario)
export const cambiarEstadoUsuario = async (idUsuario: number, activo: boolean): Promise<Usuario> => {
  try {
    console.log(` Cambiando estado del usuario ${idUsuario} a: ${activo ? 'Activo' : 'Inactivo'}`);
    const response = await api.put(`/api/usuarios/${idUsuario}/estado`, { activo });
    console.log(' Estado cambiado correctamente:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(' Error al cambiar estado del usuario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Error al cambiar estado del usuario.');
  }
};

// 🔹 Actualizar usuario
export const actualizarUsuario = async (
  idUsuario: number,
  nuevosDatos: Partial<Usuario>
): Promise<Usuario> => {
  const response = await api.put(`/api/usuarios/${idUsuario}`, nuevosDatos, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// 🔹 Obtener usuario por ID
export const obtenerUsuarioPorId = async (id: string | number): Promise<Usuario> => {
  try {
    console.log(` Solicitando usuario con ID: ${id}`);
    const response = await api.get(`/api/usuarios/${id}`);
    console.log(' Usuario obtenido:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(' Error en obtenerUsuarioPorId:', error.response?.data || error.message);
    throw error;
  }
};
