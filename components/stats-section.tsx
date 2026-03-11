const stats = [
  { value: "15,254", label: "total books" },
  { value: "1,287", label: "authors" },
  { value: "7,589", label: "books sold" },
  { value: "97%", label: "happy customer" },
]

export function StatsSection() {
  return (
    <section className="py-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
