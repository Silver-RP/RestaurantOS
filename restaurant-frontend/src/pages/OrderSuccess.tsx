import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonComponents from '@components/common/ButtonComponents';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
    const navigate = useNavigate();

    // Redirect to home if user directly accesses this page without an order
    useEffect(() => {
        const hasOrderedRecently = sessionStorage.getItem('recentOrderSuccess');
        if (!hasOrderedRecently) {
            navigate('/');
        }

        return () => {
            // Clear session storage on component unmount
            sessionStorage.removeItem('recentOrderSuccess');
        };
    }, [navigate]);

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleViewOrders = () => {
        navigate('/account/orders');
    };

    return (
        <div className="min-h-screen bg-[#012B40] flex flex-col items-center justify-center text-white px-4">
            <div className="bg-headerBackground border border-hr rounded-lg p-8 w-full max-w-md text-center">
                <FiCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />

                <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>

                <p className="text-gray-300 mb-8">
                    Cảm ơn bạn đã đặt hàng tại BeefBeef Restaurant. Chúng tôi sẽ chuẩn bị đơn hàng của bạn và cập nhật trạng thái sớm nhất.
                </p>

                <div className="flex flex-col gap-4">
                    <ButtonComponents
                        variant="filled"
                        size="large"
                        onClick={handleViewOrders}
                    >
                        Xem đơn hàng của tôi
                    </ButtonComponents>

                    <ButtonComponents
                        variant="outlined"
                        size="large"
                        onClick={handleBackToHome}
                    >
                        Quay lại trang chủ
                    </ButtonComponents>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess; 