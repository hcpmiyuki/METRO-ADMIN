import { FC } from 'react'

type Props = {
  tagName: string;
  customStyles?: string;
};

const defaultStyle = 'bg-slate-500 rounded-md text-sm';

const TagItem: FC<Props> = ({ children, tagName, customStyles }) => {
  const styles = customStyles ? `${defaultStyle} ${customStyles}` : defaultStyle;
	return (
    <a className={styles}>
      {tagName}
      {children}
    </a>
	)
}

export default TagItem;