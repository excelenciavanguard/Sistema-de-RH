export function ScreenHeader({ title, description, eyebrow, actions }) {
  return (
    <header className="screen-header">
      <div>
        {eyebrow ? <p className="screen-eyebrow">{eyebrow}</p> : null}
        <div className="screen-title-row">
          <h1>{title}</h1>
          <span className="demo-label">Dados demonstrativos</span>
        </div>
        <p>{description}</p>
      </div>
      {actions ? <div className="screen-actions">{actions}</div> : null}
    </header>
  );
}
