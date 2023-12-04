import { useNavigate } from 'react-router-dom';
import ComingSoonComponent from '../../components/ComingSoon/ComingSoon.tsx';
import { FC } from 'react';
interface IProps {
  onClick?: () => void;
}
const ComingSoon: FC<IProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const goPreviousPage = () => {
    navigate(-1);
  };
  return (
    <ComingSoonComponent
      onClick={onClick ? onClick : goPreviousPage}
    />
  );
};

export default ComingSoon;
