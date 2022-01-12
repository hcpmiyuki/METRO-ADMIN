import { FC } from 'react'

type Props = {
  handleSubmit: (event: any) => void;
  styles?: string;
  label: string;
};

const Button: FC<Props> = ({ handleSubmit, styles, label }) => {
	return (
		<p className={styles && "text-center pt-2 border-solid text-base" + " " + styles} onClick={handleSubmit}>
      {label}
    </p>
	)
}

export default Button;