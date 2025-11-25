import { toast } from 'react-toastify';

const defaultConfig = {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Notificaciones generales
export const showSuccess = (message) => {
  toast.success(message, {
    ...defaultConfig,
  });
};

export const showError = (message) => {
  toast.error(message, {
    ...defaultConfig,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    ...defaultConfig,
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    ...defaultConfig,
  });
};

// Notificaciones personalizadas por contexto
export const notifyAuthErrors = {
  invalidCredentials: () => showError("Usuario o contraseña incorrectos"),
  userAlreadyExists: () => showError("El usuario o email ya está registrado"),
  passwordMismatch: () => showError("Las contraseñas no coinciden"),
  sessionExpired: () => showWarning("Tu sesión ha expirado. Por favor, inicia sesión nuevamente"),
  notAuthenticated: () => showWarning("Debes iniciar sesión para continuar"),
  registrationSuccess: () => showSuccess("¡Registro exitoso! Ahora puedes iniciar sesión"),
};

export const notifyCartErrors = {
  addedToCart: (marca, modelo) => showSuccess(`${marca} ${modelo} agregado al carrito`),
  invalidPrice: () => showError("El vehículo no tiene precio válido"),
  outOfStock: () => showError("Lo sentimos, no hay stock disponible"),
  addCartError: (error) => showError(`Error al agregar al carrito: ${error}`),
  removeCartError: (error) => showError(`Error al quitar del carrito: ${error}`),
  notAuthenticated: () => showWarning("Debes iniciar sesión para agregar al carrito"),
  checkoutSuccess: () => showSuccess("¡Compra realizada con éxito! Tu pedido ha sido generado"),
  checkoutError: () => showError("Hubo un problema al procesar tu compra. Es posible que no haya stock suficiente"),
  insufficientStock: () => showError("No hay stock suficiente para realizar la compra"),
};

export const notifyVehicleErrors = {
  createdSuccessfully: () => showSuccess("Vehículo creado exitosamente"),
  updatedSuccessfully: () => showSuccess("Vehículo actualizado exitosamente"),
  deletedSuccessfully: () => showSuccess("Vehículo eliminado exitosamente"),
  invalidImage: () => showError("Por favor selecciona un archivo de imagen válido"),
  imageTooLarge: () => showError("La imagen no debe superar los 5MB"),
  saveError: (error) => {
  
    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message ||
      error ||
      "";

    const msg = backendMessage.toString().toLowerCase();

    if (msg.includes("chasis")) {
      return showError("El número de chasis ya está registrado");
    }

    if (msg.includes("motor")) {
      return showError("El número de motor ya está registrado");
    }

    if (msg.includes("409")) {
      return showError("Ya existe un vehículo con ese número de motor o chasis");
    }

    return showError(`Error al guardar el vehículo: ${backendMessage}`);
  },


  deleteError: () => showError("Error al eliminar el vehículo"),
  loadError: () => showError("Error al cargar los vehículos"),
  duplicateChasis: () => showError("El número de chasis ya está registrado"),
  duplicateMotor: () => showError("El número de motor ya está registrado"),
  invalidYear: () => showError("El año del vehículo no es válido"),
  invalidPrice: () => showError("El precio debe ser mayor a 0"),
  invalidStock: () => showError("El stock no puede ser negativo"),
  missingCategory: () => showError("Debes seleccionar una categoría"),
  requiredField: (field) => showError(`${field} es requerido`),
};

export const notifyFormErrors = {
  contactSuccess: () => showSuccess("Gracias por contactarnos. Pronto te responderemos"),
  fieldRequired: (fieldName) => showError(`${fieldName} es requerido`),
  invalidEmail: () => showError("Por favor ingresa un email válido"),
  passwordTooShort: () => showError("La contraseña debe tener al menos 6 caracteres"),
};

export const notifyNetworkErrors = {
  connectionError: () => showError("Error de conexión. Por favor intenta de nuevo"),
  serverError: () => showError("Error del servidor. Por favor intenta más tarde"),
  timeout: () => showError("La solicitud tardó demasiado tiempo"),
  unauthorized: () => showWarning("No tienes permisos para realizar esta acción"),
};
