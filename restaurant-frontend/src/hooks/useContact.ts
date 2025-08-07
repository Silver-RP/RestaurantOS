
import { useMutation } from '@tanstack/react-query';
import { createContact } from '@/api/ContactApi';
import { ContactRequest, ContactResponse } from '@/types/Contact.type';
import { toast } from 'react-toastify';


export const useCreateContact = () => {
  return useMutation<ContactResponse, Error, ContactRequest>({
    mutationFn: (data) => createContact(data),
    onSuccess: () =>{
        toast.success('Tạo yêu cầu liên hệ thành công!');
    }
  });
};
