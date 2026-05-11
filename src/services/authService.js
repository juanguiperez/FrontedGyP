const BASE_URL = 'https://usuariosgyp.onrender.com/api/usuarios';

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


export const validarSesion = async (token) => {
  return true;
};

