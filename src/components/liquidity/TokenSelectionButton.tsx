import { FaAngleDown } from "react-icons/fa";

interface IProps {
  name: string;
  logo: string;
  onClick?: () => void;
}

const TokenSelectButton = ({ name, logo, onClick }: IProps) => {
  return (
    <div
      className="token-select flex  items-center min-w-[140px]"
      onClick={onClick}
    >
      <img src={logo} alt="movex" />
      <h4 className="token-name">{name}</h4>
      <div className="text-base text-white ml-2">
        <FaAngleDown />
      </div>
    </div>
  );
};

export default TokenSelectButton;
