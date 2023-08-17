type SideBarItemInterface = {
  children: React.ReactNode;
  id: string;
  onClick: (id: string) => void;
};

const SideBarItem: React.FC<SideBarItemInterface> = ({
  children,
  id,
  onClick,
}) => {
  return <div onClick={() => onClick(id)}>{children}</div>;
};

export default SideBarItem;
