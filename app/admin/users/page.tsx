import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Customer and staff accounts
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Not wired yet</CardTitle>
          <CardDescription>
            Placeholder for user search, roles, and account status.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Super-admin access stays on the existing auth flow until this page is
          connected.
        </CardContent>
      </Card>
    </div>
  );
}
