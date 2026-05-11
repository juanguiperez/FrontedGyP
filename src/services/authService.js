const BASE_URL = 'https://usuariosgyp.onrender.com/api/usuarios';

/**
 * Realiza la petición de login al backend
 */
export const loginService = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Credenciales incorrectas');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Realiza la petición de registro al backend
 */
export const registroService = async (datos) => {
  try {
    const response = await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear la cuenta');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};


/**
 * Opcional: Validar token o sesión actual
 */
export const validarSesion = async (token) => {
  // Implementar si tienes validación de JWT en el backend
  return true;
};

