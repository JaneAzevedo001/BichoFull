// src/services/api.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

//Interceptor de requisição
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    
    // NÃO adiciona token em rotas públicas de autenticação
    const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    
    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

//Interceptor de resposta 
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {  
    //Token expirado ou inválido → logout automático
    if (error.response?.status === 401) {
      console.warn("Não autorizado. Fazendo logout...");
      
      //Limpa apenas itens relevantes (evita apagar outros dados do localStorage)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Previne redirecionamento em loop se já estiver na página de login
      if (!window.location.pathname.includes("/login")) {
        // Usa replace para não criar histórico "voltar" para página protegida
        window.location.replace("/login");
      }
      return Promise.reject(error);
    }
    
    //Erro 500: log amigável para o dev
    if (error.response?.status === 500) {
      console.error("Erro interno no servidor:", {
        url: error.config?.url,
        method: error.config?.method,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;