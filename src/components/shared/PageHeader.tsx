import CustomButton from './CustomButton';

type PageHeaderProps = {
  title?: string;
  titleValue?: number;
  itemTitle?: string;
  itemName?: string;
  noItemTitle?: boolean;
  secondTitle?: string;
  secondValue?: number;
  thirdTitle?: string;
  thirdValue?: number;
  fourthTitle?: string;
  fourthValue?: string;
  hasInput?: boolean;
  onClick?: () => void;
  noMargin?: boolean;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  titleValue,
  itemTitle,
  itemName,
  noItemTitle,
  secondTitle,
  secondValue,
  thirdTitle,
  thirdValue,
  fourthTitle,
  fourthValue,
  hasInput,
  onClick,
  noMargin,
}) => {
  return (
    <>
      {title && !titleValue && <h1 className="text-center">{title}</h1>}
      {title && titleValue && (
        <h1 className="text-center">
          {title}: <span className="green">{titleValue}</span>
        </h1>
      )}
      {itemTitle && (
        <div className="order-seeding__item--box">
          <h4 className="fw-bold ms-2">:{itemName}</h4>
          <h3 className="text-success ms-5">{itemTitle}</h3>
          {secondValue || secondValue === 0 ? (
            <>
              <h4 className="fw-bold ms-2">:{secondTitle}</h4>
              <h3 className="text-success ms-5">{secondValue}</h3>
            </>
          ) : null}
          {thirdValue || thirdValue === 0 ? (
            <>
              <h4 className="fw-bold ms-2">:{thirdTitle}</h4>
              <h3 className={`text-success ${fourthValue && 'ms-5'}`}>
                {thirdValue}
              </h3>
            </>
          ) : null}
          {fourthValue ? (
            <>
              <h4 className="fw-bold ms-2">:{fourthTitle}</h4>
              <h3 className="text-success">{fourthValue}</h3>
            </>
          ) : null}
          {hasInput && (
            <CustomButton onClick={onClick}>تعديل سعر الوحدة</CustomButton>
          )}
        </div>
      )}
      {!itemTitle && !noItemTitle && !noMargin && (
        <div className="order-seeding__item--box">
          <h4 className="fw-bold ms-4">&nbsp;</h4>
          <h3 className="text-success">&nbsp;</h3>
        </div>
      )}
    </>
  );
};

export default PageHeader;
