
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContact, getAllContacts, updateContactStatus } from '@/api/ContactApi';
import { ContactRequest, ContactResponse, ContactQueryParams, GetAllContactsResponse } from '@/types/Contact.type';
import { toast } from 'react-toastify';


export const useCreateContact = () => {
  return useMutation<ContactResponse, Error, ContactRequest>({
    mutationFn: (data) => createContact(data),
    onSuccess: () => {
      toast.success('Tạo yêu cầu liên hệ thành công!');
    }
  });
};

export const useAllContacts = (params?: ContactQueryParams) => {
  return useQuery<GetAllContactsResponse, Error, GetAllContactsResponse>({
    queryKey: ['contacts', params],
    queryFn: () => getAllContacts(params),
  });
};

export const useUpdateContactStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'NEW' | 'PROCESSED' }) => updateContactStatus(id, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công');
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
