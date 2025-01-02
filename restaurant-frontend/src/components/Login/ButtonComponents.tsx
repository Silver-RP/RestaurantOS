import React from 'react';
import { Button } from 'antd';
const ButtonComponent = () => {
  return (
    <div>
        <Button className="mt-6 px-4 py-5 w-11/12 text-lg font-medium bg-secondaryColor text-bodyBackground border border-secondaryColor rounded hover:bg-bodyBackground hover:text-secondaryColor hover:border-secondaryColor">
        Đăng Ký
        </Button>
    </div>
  );
};

export default ButtonComponent;
