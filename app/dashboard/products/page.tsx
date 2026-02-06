import { getCurrentUser } from '@/lib/actions/auth'
import { getProducts } from '@/lib/actions/products'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { isStaff } from '@/lib/rbac'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProductsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: products, error } = await getProducts(isStaff(user.role))

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{'Products'}</h1>
            <p className="text-muted-foreground">
              {isStaff(user.role) ? 'Manage product catalog' : 'Browse available products'}
            </p>
          </div>
          {isStaff(user.role) && (
            <Button asChild>
              <Link href="/dashboard/products/new">{'Add Product'}</Link>
            </Button>
          )}
        </div>

        {error ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">{'No image'}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                      {product.category && (
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      )}
                    </div>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.stock} {'in stock'}
                      </p>
                    </div>
                    {isStaff(user.role) && (
                      <Button asChild variant="outline" size="sm" className="bg-transparent">
                        <Link href={`/dashboard/products/${product.id}`}>{'Edit'}</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">{'No products available'}</p>
                {isStaff(user.role) && (
                  <Button asChild>
                    <Link href="/dashboard/products/new">{'Add Your First Product'}</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
