export const fetchConToken = (url, method = 'GET', body = null) => {
const token = localStorage.getItem('accessToken');

const headers = {
    'Content-Type': 'application/json',
};

if (token) {
    headers['Authorization'] = `Bearer ${token}`;
}

const config = {
    method,
    headers,
};

if (body) {
    config.body = JSON.stringify(body);
}

return fetch(`http://localhost:4002${url}`, config)
    .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(new Error('No autorizado - sesión expirada'));
        }
        
        // Intentar obtener el mensaje de error del backend
        return response.text().then(errorText => {
            let errorMessage = 'Error del servidor';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorText;
            } catch (e) {
                errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        });
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return {};
    }
    })
    .catch(error => {
        // Si es un error de red (backend no disponible)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 4002.');
        }
        // Re-lanzar otros errores
        throw error;
    });
};