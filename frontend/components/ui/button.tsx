import { FC } from 'react'

type Props = {
  handleSubmit: () => void;
  text: string;
  customStyles?: string;
};

const defaultStyle = 'text-center border-solid';

const Button: FC<Props> = ({ children, handleSubmit, text, customStyles }) => {
  const styles = customStyles ? `${defaultStyle} ${customStyles}` : defaultStyle;
	return (
		<p className={styles} onClick={handleSubmit}>
      {text}
      {children}
    </p>
	)
}

export default Button;