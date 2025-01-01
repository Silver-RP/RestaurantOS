// import React from 'react';
// import type { FormProps } from 'antd';
// import { Button, Checkbox, Form, Input } from 'antd';
// import InputComponent from './InputComponents';
// import ButtonComponent from './ButtonComponents';
// type Props = {};

// const FormComponent = (props: Props) => {
//   type FieldType = {
//     username?: string;
//     password?: string;
//     remember?: string;
//   };
//   const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
//     console.log('Success:', values);
//   };

//   const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
//     errorInfo,
//   ) => {
//     console.log('Failed:', errorInfo);
//   };

//   return (
//     <div>
//       <Form
//         name="basic"
//         labelCol={{ span: 8 }}
//         wrapperCol={{ span: 16 }}
//         style={{ maxWidth: 600 }}
//         initialValues={{ remember: true }}
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//         autoComplete="off"
//         className='--ant-display:none'
//       >
//         <Form.Item<FieldType>
//           name="username"
//           rules={[{ required: true, message: 'Please input your username!' }]}
//         >   
//           <InputComponent />
//         </Form.Item>

//         <Form.Item<FieldType>
//           name="password"
//           rules={[{ required: true, message: 'Please input your password!' }]}
//         >
//           <InputComponent />
//         </Form.Item>

//         {/* <Form.Item<FieldType>
//           name="remember"
//           valuePropName="checked"
//           label={null}
//         >
//           <Checkbox>Remember me</Checkbox>
//         </Form.Item> */}

//         <Form.Item label={null}>
//             <ButtonComponent />
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };
// export default FormComponent;
