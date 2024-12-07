import { useNavigate } from "react-router-dom";

interface CloseIconProps {
  color: string;
  onClose?: () => void;
}

function CloseIcon({ color, onClose }: CloseIconProps) {
  const navigate = useNavigate();

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation(); // מונע התפשטות האירוע
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <svg
      className="icon"
      fill="none"
      height="25px"
      viewBox="0 0 24 24"
      width="25px"
      xmlns="http://www.w3.org/2000/svg"
      id="fi_5368396"
      onClick={handleClose}
    >
      <path
        d="m18.8071 6.6071c.3905-.39052.3905-1.02369 0-1.41421-.3905-.39053-1.0237-.39053-1.4142 0l-5.3929 5.39291-5.3929-5.39291c-.39052-.39053-1.02369-.39053-1.41421 0-.39053.39052-.39053 1.02369 0 1.41421l5.39291 5.3929-5.39291 5.3929c-.39053.3905-.39053 1.0237 0 1.4142.39052.3905 1.02369.3905 1.41421 0l5.3929-5.3929 5.3929 5.3929c.3905.3905 1.0237.3905 1.4142 0s.3905-1.0237 0-1.4142l-5.3929-5.3929z"
        fill={color}
      ></path>
    </svg>
  );
}

export default CloseIcon;
