import api from './axiosInstance';

export interface PostReportType {
  _id: string;
  post_id: {
    _id: string;
    title: string;
    desc: string;
  };
  reporter_id: {
    _id: string;
    username: string;
    email: string;
  };
  reason: string;
  createdAt: string;
}

export interface CreatePostReportPayload {
  post_id: string;
  reason: string;
}

const PostReportApi = {
  getAllReports: async (): Promise<PostReportType[]> => {
    const response = await api.get('/post-reports');
    return response.data.data;
  },
  createReport: async (payload: CreatePostReportPayload): Promise<any> => {
    const response = await api.post('/post-reports', payload);
    return response.data;
  },
  deleteReport: async (id: string): Promise<any> => {
    const response = await api.delete(`/post-reports/${id}`);
    return response.data;
  },
};

export default PostReportApi;
