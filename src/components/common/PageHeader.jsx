const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionClassName = 'btn btn-primary',
  actionElement,
}) => {
  return (
    <div className="page-header">
      <div>
        <div className="page-title">{title}</div>
        {subtitle ? <div className="page-sub">{subtitle}</div> : null}
      </div>
      {actionElement
        ? actionElement
        : actionLabel
          ? (
            <button className={actionClassName} onClick={onAction}>
              {actionLabel}
            </button>
          )
          : null}
    </div>
  );
};

export default PageHeader;
