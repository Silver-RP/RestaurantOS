import React from 'react';
import type { FormProps } from 'antd';
import { Form } from 'antd';
import InputComponent from './InputComponents';
import ButtonComponent from './ButtonComponents';


const FormComponent = () => {
  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        
      >
          <InputComponent placeholder="Họ và tên" type="text" value="name" />
          <InputComponent placeholder="Email / Số điện thoại" type="number" value="phone"/>
          <InputComponent placeholder="Mật khẩu" type="password" value="password"/>
          <InputComponent placeholder="Nhập lại mật khẩu" type="password" value="repassword"/>
          <ButtonComponent />
   
      </Form>
    </div>
  );
};
export default FormComponent;
