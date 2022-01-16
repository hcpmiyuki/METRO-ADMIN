import { FC } from 'react'

type Props = {
  handleSubmit: (event: any) => void;
  label: string;
  styles?: string;
};

const Button: FC<Props> = ({ handleSubmit, styles, children, label }) => {
	return (
		<p className={styles && "text-center border-solid text-base" + " " + styles} onClick={handleSubmit}>
      {label}
      {children}
    </p>
	)
}

export default Button;