import { FC } from 'react'

type Props = {
  tagName: string;
};

const TagItem: FC<Props> = ({ tagName }) => {
	return (
    <a className='bg-slate-500 rounded-md text-sm'>{tagName}</a>
	)
}

export default TagItem;