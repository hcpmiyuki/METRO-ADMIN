import { FC } from 'react'

type Props = {
  showModal: () => void;
};

const EditButton: FC<Props> = ({ showModal }) => {
	return (
		<p className="w-16 h-16 pt-2 rounded-full text-center text-4xl bg-lime-300 fixed bottom-5 right-5" onClick={showModal}>✏️</p>
	)
}

export default EditButton;