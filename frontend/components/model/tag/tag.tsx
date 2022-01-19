import { FC } from 'react'

type Props = {
  tagName: string;
};

const TagItem: FC<Props> = ({ tagName, children }) => {
	return (
    <a className='bg-slate-500 rounded-md text-sm'>
      {tagName}
      {children}
    </a>
	)
}

export default TagItem;