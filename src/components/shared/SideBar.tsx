import classes from './SideBar.module.css';

const SideBar: React.FC<{ title: string; children?: React.ReactNode }> = ({
  children,
  title,
}) => {
  return (
    <div className={classes['side-bar']}>
      <h4>{title}</h4>
      <div className={classes['side-bar__items']}>{children}</div>
    </div>
  );
};

export default SideBar;
