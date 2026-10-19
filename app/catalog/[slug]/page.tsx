import Image from "next/image"
import { notFound } from "next/navigation"
import { catalogueCategories } from "@/lib/catalogue-categories"

async function getCatalogue(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
  const res = await fetch(`${base.replace(/\/$/, "")}/api/public/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function PublicCataloguePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getCatalogue(slug)

  if (!data?.business) {
    notFound()
  }

  const products = data.products || []
  const categories = catalogueCategories.filter((c) =>
    products.some((p: { category: string }) => p.category === c)
  )

  return (
    <div className="min-h-screen bg-[#f4f7ff] text-[#0f172a]">
      <header className="border-b border-[#dbe4ff] bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-6">
          <Image
            src="/logo.png"
            alt={`${data.business.name} logo`}
            width={52}
            height={52}
            className="rounded-full"
            priority
          />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#0033ad]">
              {data.business.name}
            </h1>
            <p className="text-sm text-slate-600">{data.business.tagline}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-5 py-8">
        {categories.length === 0 ? (
          <p className="text-center text-slate-500">Catalogue coming soon.</p>
        ) : (
          categories.map((category) => (
            <section key={category}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#0033ad]">
                {category}
              </h2>
              <ul className="divide-y divide-[#e2e8f0] rounded-lg border border-[#e2e8f0] bg-white">
                {products
                  .filter((p: { category: string }) => p.category === category)
                  .map((product: { id: string; name: string; description?: string; type: string; price: number }) => (
                    <li
                      key={product.id}
                      className="flex items-start justify-between gap-4 px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        {product.description && (
                          <p className="mt-0.5 text-sm text-slate-500">
                            {product.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs uppercase text-slate-400">
                          {product.type}
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold text-[#0033ad]">
                        {product.price.toLocaleString()} ETB
                      </p>
                    </li>
                  ))}
              </ul>
            </section>
          ))
        )}

        <footer className="border-t border-[#dbe4ff] pt-6 text-center text-sm text-slate-500">
          <p>{data.business.phone}</p>
          <p>{data.business.address}</p>
          <p className="mt-2 text-xs">Powered by Beyond Solution RMS</p>
        </footer>
      </main>
    </div>
  )
}
