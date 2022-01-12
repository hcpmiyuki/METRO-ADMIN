import { FC } from 'react'

type Props = {
  tag: Tag;
  handleClick: (value: any) => void;
};

const TagWithDelete: FC<Props> = ({ tag, handleClick }) => {
	return (
    <div>
      <a className='bg-slate-500 rounded-md text-sm p-1.5'>
        {tag.tag_name}
        <span className='px-1.5' onClick={() => handleClick(tag.id)}>×</span>
      </a>
    </div>
	)
}

export default TagWithDelete;