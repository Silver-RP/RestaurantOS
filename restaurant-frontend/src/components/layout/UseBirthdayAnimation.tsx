import { useSelector } from 'react-redux';
import BirthdayAnimation from '@/components/common/BirthdayAnimation';


const UseBirthdayAnimation = () => {
    const { userInfo, isBirthday } = useSelector((state: any) => state.auth);
    return (
        <>
            <BirthdayAnimation
                username={userInfo?.username || ''}
                isVisible={isBirthday}
                onComplete={() => {

                    console.log('Animation completed');
                }}
            />
        </>
    );
};

export default UseBirthdayAnimation;