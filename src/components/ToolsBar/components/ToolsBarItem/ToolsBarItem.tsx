import type { ElementType, SVGProps } from 'react';

interface ToolsBarItemProps {
  Icon: ElementType<SVGProps<SVGSVGElement>>;
  name: string;
}

export const ToolsBarItem = ({ Icon, name }: ToolsBarItemProps) => {
  return (
    <li className='flex cursor-grab px-5 py-2 shadow-sm rounded-2xl items-center gap-1'>
      <Icon height={20} width={20} />
      <p>{name}</p>
    </li>
  );
};
