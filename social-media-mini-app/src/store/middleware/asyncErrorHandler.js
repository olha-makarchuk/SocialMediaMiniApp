const asyncErrorHandler = () => (next) => (action) => {
  if (action.type.endsWith("/rejected")) {
    
    const errorMsg = action.payload?.message || action.error?.message || "Щось пішло не так";

    console.error(`[Async Error] in ${action.type}:`, errorMsg);

    if (action.meta?.condition !== true) {
       alert(`Помилка: ${errorMsg}`);
    }
  }

  return next(action);
};

export default asyncErrorHandler;