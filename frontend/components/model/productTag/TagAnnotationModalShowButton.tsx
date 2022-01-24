import { FC } from 'react'

type Props = {
  showModal: () => void;
	customStyles?: string;
};

const defaultStyle = "w-16 h-16 pt-2 rounded-full text-center text-4xl bg-lime-300 fixed bottom-5 right-5";

const EditButton: FC<Props> = ({ showModal, customStyles }) => {
  const styles = customStyles ? `${defaultStyle} ${customStyles}` : defaultStyle;
	return (
		<p className={styles} onClick={showModal}>✏️</p>
	)
}

export default EditButton;