import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.API_C_URL || "http://localhost:3000";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({ baseURL: BASE_URL });
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  login(email: string, password: string): Promise<{ user: any; access_token: string }> {
    return this.post("/auth/login", { email, password });
  }

  register(email: string, password: string): Promise<{ user: any; access_token: string }> {
    return this.post("/auth/register", { email, password });
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

    async autoLogin(): Promise<boolean> {
    const email = process.env.API_C_EMAIL;
    const password = process.env.API_C_PASSWORD;
    
    // Si las variables vienen vacías, con comillas rotas o son indefinidas, cancelamos el proceso limpio
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      console.error("[api-c-bridge] Sin credenciales env válidas, esperando auth_login manual");
      return false;
    }
    
    try {
      // Limpiamos posibles comillas residuales que inyecte PowerShell de forma errónea
      const cleanEmail = email.replace(/['"]/g, "");
      const cleanPassword = password.replace(/['"]/g, "");
      
      const res = await this.login(cleanEmail, cleanPassword);
      this.setToken(res.access_token);
      console.error("[api-c-bridge] Autenticación automática exitosa");
      return true;
    } catch (error) {
      console.error("[api-c-bridge] Error en la autenticación automática");
      return false;
    }
  }


  async get(path: string, config?: any): Promise<any> {
    const res = await this.client.get(path, config);
    return res.data;
  }

  async post(path: string, data?: any): Promise<any> {
    const res = await this.client.post(path, data);
    return res.data;
  }

  async put(path: string, data?: any): Promise<any> {
    const res = await this.client.put(path, data);
    return res.data;
  }

  async patch(path: string, data?: any): Promise<any> {
    const res = await this.client.patch(path, data);
    return res.data;
  }

  async del(path: string, config?: any): Promise<any> {
    const res = await this.client.delete(path, config);
    return res.data;
  }
}

export const api = new ApiClient();
