import { UserForm } from "@/components/admin/users/user-form"

// This would fetch the user data from your API
async function getUser(id: string) {
  // Simulate API call - replace with actual API call
  return {
    id,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
  }
}

export default async function EditUserPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getUser(params.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">Update user information and permissions</p>
      </div>

      <UserForm user={user} />
    </div>
  )
}
