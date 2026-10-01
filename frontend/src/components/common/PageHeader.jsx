export default function PageHeader({ icon, title, subtitle, children }) {
  return (
    <header className="page-header">
      <div>
        <h1>
          {icon && <span className="page-header__icon">{icon}</span>}
          {title}
        </h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {children && <div className="page-header__actions">{children}</div>}
    </header>
  )
}
