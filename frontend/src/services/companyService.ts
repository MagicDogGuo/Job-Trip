import api from './api';
import { Company, CreateCompanyData, PaginatedResponse } from '@/types';

// 公司服务
const companyService = {
  // 获取公司列表
  getCompanies: async (params?: { 
    page?: number; 
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Company>> => {
    try {
      return await api.get<PaginatedResponse<Company>>('/companies', params);
    } catch (error) {
      console.error('获取公司列表失败:', error);
      throw error;
    }
  },

  // 获取单个公司
  getCompany: async (id: string): Promise<Company> => {
    try {
      return await api.get<Company>(`/companies/${id}`);
    } catch (error) {
      console.error(`获取公司(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 创建公司
  createCompany: async (companyData: CreateCompanyData): Promise<Company> => {
    try {
      return await api.post<Company>('/companies', companyData);
    } catch (error) {
      console.error('创建公司失败:', error);
      throw error;
    }
  },

  // 更新公司
  updateCompany: async (id: string, companyData: Partial<CreateCompanyData>): Promise<Company> => {
    try {
      return await api.put<Company>(`/companies/${id}`, companyData);
    } catch (error) {
      console.error(`更新公司(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 删除公司
  deleteCompany: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/companies/${id}`);
    } catch (error) {
      console.error(`删除公司(ID: ${id})失败:`, error);
      throw error;
    }
  }
};

export default companyService; 